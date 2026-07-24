# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

인천공항 혼잡도 공공데이터를 보여주고, 로그인한 사용자의 즐겨찾기를 Supabase Database에 저장하는 대시보드. (PRD.md 참고 — 구현 전 반드시 전체를 먼저 읽을 것)

## 반드시 지킬 규칙

- 공공데이터포털 API 키는 Supabase Edge Function의 Secret(`AIRPORT_API_KEY`)으로만 관리하며, 프론트엔드 코드나 `.env`에는 절대 두지 않는다.
- 프론트엔드는 공공데이터 API를 직접 호출하지 않고, 반드시 Supabase Edge Function을 통해서만 호출한다.
- Supabase URL과 anon key는 `.env`의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`로 관리한다. service_role key는 프론트엔드 코드나 `.env`에 절대 두지 않는다 (RLS를 우회함).
- 즐겨찾기 테이블은 RLS를 켜고 "본인 데이터만" 정책(SELECT/INSERT/DELETE, `auth.uid() = user_id`)을 적용한다. RLS를 끈 채로 테스트하지 않고, 정책 변경 후에는 Supabase MCP의 `get_advisors`로 점검한다.
- `.env`는 `.gitignore`에 포함한다. 대신 값 없이 변수명만 있는 `.env.example`을 커밋한다.
- 화면은 목업 데이터로 먼저 만들고, 마지막에 실제 연동으로 교체한다. 목업 데이터 형태는 PRD.md에 정리된 실제 API/DB 응답 스키마와 동일하게 맞춘다.
- 데이터 함수 이름과 타입은 PRD.md의 정의를 따른다.
- Supabase 관련 작업(테이블, RLS)은 Supabase MCP 도구로 수행한다.
- (임시) Supabase MCP로 작업할 때는 반드시 "kokim80-maker's Project"(project ref `rnjktyadxotlirvpvbkj`, URL `https://rnjktyadxotlirvpvbkj.supabase.co`)에만 작업하고, 다른 프로젝트는 절대 건드리지 않는다. 현재 로컬 MCP 연결 설정에 `--project-ref`가 지정되어 있지 않으므로 특히 주의할 것.
- Vercel 환경변수는 Preview/Production 환경 모두 등록한다 (Production에만 등록하면 프리뷰 배포가 깨짐).
- MCP 조회 중 노출되는 액세스 토큰 등 민감정보는 CLAUDE.md, 커밋 메시지 등 어디에도 그대로 남기지 않는다.

## 기술 스택

React + TypeScript + Vite, recharts, Supabase(Auth/Database, MCP로 관리), 공공데이터포털 API (프론트엔드에서 직접 호출)

## 프로젝트 현재 상태

React + TypeScript + Vite로 스캐폴딩됨. 화면 컴포넌트는 PRD.md 화면 구성(헤더, 날짜·시간 선택, 상세 카드, 터미널 비교/추이 그래프, 로그인 버튼, 즐겨찾기 목록)대로 뼈대가 잡혀 있고, 혼잡도 데이터는 `src/mock/`의 하드코딩된 배열로 채워져 있다 — 아직 공공데이터포털 API 연동은 없다(`src/lib/congestion.ts`가 교체 지점, `src/lib/passgrAnncmt.ts`에 실 API 호출 함수는 있으나 응답 필드 스키마 미확정이라 연결 전).

**Auth는 실제 Supabase Auth로 연동됨** (이메일/비밀번호): `src/lib/auth.ts`(signUp/signIn/signOut), `src/auth/AuthContext.tsx`(세션 상태 공유), `src/components/AuthButton.tsx`(헤더의 로그인/회원가입 폼 + 로그인 시 이메일/로그아웃 표시). 로그아웃 상태에서도 혼잡도 조회는 그대로 되고, `FavoritesList`만 로그인을 요구한다.

**Supabase `public.favorites` 테이블 실제 생성됨(2026-07-23)**: `id, user_id(FK→auth.users, on delete cascade), adate, atime, terminal(nullable), zone_type(nullable), created_at` — RLS 활성화 + `authenticated` 역할 대상 SELECT/INSERT/DELETE 정책(`auth.uid() = user_id`) 적용 확인함(Supabase MCP `apply_migration`/`execute_sql`로 생성·검증). `terminal`/`zone_type`은 나중에 추가된 컬럼이라 **nullable** — 추가 전에 저장된 실사용자 행 1건이 두 값 모두 `NULL`인 채로 남아있고, 화면에는 "(터미널/구역 미기록)"으로 표시됨. 새로 저장되는 행은 상세 카드의 터미널·구역별 버튼에서 항상 값을 채워 저장한다 (PRD.md §4/§8 참고).

**즐겨찾기 CRUD도 실제 Supabase 연동으로 교체 완료(2026-07-23)**: `src/lib/favorites.ts`가 목업 대신 `favorites` 테이블에 직접 select/insert/delete하고, `src/types.ts`의 `Favorite` 타입도 DB 스키마(`id, adate, atime, terminal: Terminal|null, zoneType: ZoneType|null, createdAt`)와 맞춰뒀다. `CongestionDetailCard`는 터미널·구역 스탯 타일마다 개별 "즐겨찾기 추가" 버튼을 가진다(로그인 시에만 노출) — 하나의 카드에 4개 조합이 있으므로 버튼도 4개, 각각 독립적으로 저장 상태를 표시함. `FavoritesList`가 `listFavorites`/`removeFavorite`을 사용한다. 실제 저장/조회/삭제를 Supabase MCP로 직접 조회해 데이터 변화를 확인함.

- 개발 서버: `npm run dev`
- 빌드(타입체크 포함): `npm run build`
- 빌드 결과 미리보기: `npm run preview`
- 린트: 아직 미설정.
- 테스트: 아직 미설정(테스트 프레임워크 도입 전). 단일 테스트 실행 방법은 프레임워크 도입 시 이 섹션에 추가할 것.

## 구현 전에 확인이 필요한 사항

PRD.md §16("미해결 질문")에서 아직 열려 있는 항목 — 임의로 답을 가정하지 말고 해결하거나 사용자에게 확인할 것:

- ~~공공데이터포털 API의 CORS 허용 여부~~ → **확인됨(2026-07-23), 허용.** `Access-Control-Allow-Origin: *` 응답 확인 — 프록시 불필요, 프론트엔드 직접 호출 유지.
- ~~API 활용신청 승인 상태~~ → **승인 완료, 정상 응답 확인함.**
- ~~응답 포맷/시간 단위~~ → **XML 고정(`_type=json` 무시됨), 1시간 단위**로 확정. `src/lib/passgrAnncmt.ts`가 `DOMParser`로 XML을 직접 파싱함.
- **[최우선]** 응답 필드(`t1dg1~6`/`t1eg1~4`/`t2dg1~2`/`t2eg1~2`)가 입국장/출국장 중 무엇을 뜻하는지, 값의 단위·"혼잡도" 등급 변환 방식이 아직 불명확 — data.go.kr 문서로 재검증 전까지 이 필드를 `CongestionRecord`로 매핑하지 말 것 (PRD.md §6 참고).
- 데이터 갱신 주기.
- ~~로그인 방식~~ → **이메일/비밀번호로 구현됨(2026-07-23).** 소셜 로그인 추가 여부만 아직 미정.
- 만료된 즐겨찾기 처리 방식(자동 삭제 vs. "만료됨" 표시 후 사용자가 직접 삭제).
- 모바일 반응형 지원 범위, 다국어 지원 여부, 즐겨찾기 개수 제한, 배포 브랜치 전략/모니터링 도구.

위 항목이 결정되면 코드뿐 아니라 PRD.md §16도 함께 갱신할 것.
