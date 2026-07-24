# 인천공항 혼잡도 대시보드

인천국제공항 여객터미널(T1, T2)의 입국장·출국장 혼잡도를 조회하고, 로그인한 사용자가 자주 보는 날짜·시간을 즐겨찾기로 저장하는 대시보드. 상세 기획은 [PRD.md](PRD.md), 구현 규칙/현재 상태는 [CLAUDE.md](CLAUDE.md) 참고.

## 기술 스택

- **프론트엔드**: React 18 + TypeScript + Vite
- **차트**: recharts (막대그래프, 꺾은선그래프)
- **인증/DB**: Supabase (Auth + Postgres + Row Level Security)
- **외부 데이터**: 공공데이터포털(data.go.kr) 인천공항 여객예고정보 API — Supabase Edge Function(`airport-proxy`)이 대행 호출, 프론트엔드는 Edge Function만 호출
- **백엔드 서버 없음** — 프론트엔드가 Supabase(Auth/DB/Edge Function)만 호출하는 서버리스 구조 (공공데이터 API 키는 Edge Function Secret으로 관리, 브라우저에는 노출되지 않음)

## 시작하기

```bash
npm install
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 타입체크 + 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

### 환경변수 (`.env`)

`.env.example` 참고. 둘 다 `VITE_` 접두사가 붙어 클라이언트 번들에 포함된다 (`.env`는 `.gitignore`에 포함되어 있다). 공공데이터포털 API 키는 프론트엔드 환경변수가 아니라 Supabase Edge Function의 Secret(`AIRPORT_API_KEY`)으로 관리한다 — PRD.md §9 참고.

| 변수 | 용도 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon(publishable) key |

## 폴더 구조

```
src/
  types.ts                  공용 타입 (Terminal, ZoneType, CongestionRecord, Favorite 등)
  App.tsx                   화면 조립 (헤더 → 날짜/시간 선택 → 상세 카드 → 그래프 2종 → 즐겨찾기)
  index.css                 전역 스타일 (라이트/다크 테마 CSS 변수)

  components/
    Header.tsx               제목 + 오늘/내일 새로고침 + 다크모드 토글 + AuthButton
    DateTimeSelector.tsx      날짜(오늘/내일)·시간 선택
    CongestionDetailCard.tsx  선택 시점 T1/T2 × 입국장/출국장 상세 수치 + 터미널·구역별 "즐겨찾기 추가" 버튼
    TerminalComparisonChart.tsx  터미널별 비교 막대그래프 (선택 시간대 기준)
    CongestionTrendChart.tsx     시간대별 추이 꺾은선그래프 (선택 시간대 하이라이트)
    AuthButton.tsx            로그인/회원가입 폼 ↔ 로그인 시 이메일 + 로그아웃
    FavoritesList.tsx         본인 즐겨찾기 목록 조회/삭제 (비로그인 시 안내 문구)

  auth/
    AuthContext.tsx           Supabase 세션 상태를 앱 전체에 공유하는 Context

  hooks/
    useDarkMode.ts            prefers-color-scheme 감지 + localStorage 유지

  lib/
    supabaseClient.ts         Supabase 클라이언트 생성
    auth.ts                   signUp / signIn / signOut
    favorites.ts              favorites 테이블 CRUD (실제 Supabase 연동)
    congestion.ts             혼잡도 데이터 접근 함수 (현재는 mock/congestionData.ts 반환)
    passgrAnncmt.ts           공공데이터포털 실 API 호출 (CORS/인증 확인됨, 필드 매핑은 아직 보류)

  mock/
    congestionData.ts         혼잡도 목업 데이터 + TIME_SLOTS 상수
```

## 구현된 기능

### 혼잡도 조회 (비로그인 가능)
- 오늘/내일 토글, 시간 선택, 상세 수치 카드, 터미널 비교 막대그래프, 시간대별 추이 꺾은선그래프, 다크모드
- **데이터는 아직 목업**(`src/mock/congestionData.ts`) — 공공데이터포털 실 API 연동은 아래 "미해결 항목" 참고

### 인증 (이메일/비밀번호)
- Supabase Auth `signUp`/`signInWithPassword`/`signOut` 사용
- 헤더의 로그인 버튼 → 로그인/회원가입 토글 폼 → 로그인 시 이메일 + 로그아웃 버튼으로 전환
- 비로그인 상태에서도 혼잡도 조회 전체 기능은 그대로 사용 가능 — 즐겨찾기만 로그인 필요

### 즐겨찾기 (Supabase 연동 완료)
- 상세 카드의 터미널·구역 조합별(T1/T2 × 입국장/출국장) "즐겨찾기 추가" 버튼으로 저장(Create)
- 목록에서 본인 즐겨찾기만 조회(Read)·삭제(Delete)
- **DB**: `public.favorites` 테이블, RLS 활성화, `authenticated` 역할 대상 SELECT/INSERT/DELETE 정책(`auth.uid() = user_id`)

  ```
  id          uuid PK
  user_id     uuid FK -> auth.users (on delete cascade)
  adate       date
  atime       text
  terminal    text, nullable (T1 | T2)
  zone_type   text, nullable (입국장 | 출국장)
  created_at  timestamptz
  ```

  `terminal`/`zone_type`은 나중에 추가된 컬럼이라 nullable — 컬럼 추가 이전에 저장된 행은 두 값이 `NULL`일 수 있고, 화면에는 "(터미널/구역 미기록)"으로 표시된다.

### 공공데이터포털 API 연동 상태
- 엔드포인트: `https://apis.data.go.kr/B551177/passgrAnncmt/getPassgrAnncmt`
- **CORS 허용 확인됨** (`Access-Control-Allow-Origin: *`) — 프록시 불필요, 프론트엔드 직접 호출 유지
- **응답은 XML 고정**(`_type=json` 파라미터 무시됨) — `src/lib/passgrAnncmt.ts`가 `DOMParser`로 직접 파싱
- 1시간 단위(`atime`이 `"00_01"`~`"09_10"` 형태)로 확인됨
- **아직 화면에 연결하지 않음**: 응답 필드(`t1dg1~6`, `t1eg1~4`, `t2dg1~2`, `t2eg1~2` 등)가 정확히 입국장/출국장 중 무엇을 뜻하는지, 어떤 단위인지 data.go.kr 문서로 재검증 전이라 `CongestionRecord` 타입으로 매핑하지 않았음

## 미해결 항목

자세한 내용과 이력은 [PRD.md §16](PRD.md)과 [CLAUDE.md](CLAUDE.md) 참고. 요약:

- 공공데이터 응답 필드(`dg`/`eg` 그룹)의 정확한 의미와 "혼잡도" 등급 변환 방식
- 데이터 갱신 주기
- 소셜 로그인 추가 여부(현재는 이메일/비밀번호만)
- 만료된 즐겨찾기 처리 방식(자동 삭제 vs. 표시만)
- 모바일 반응형 범위, 다국어 지원, 즐겨찾기 개수 제한, 배포 브랜치 전략/모니터링 도구

## 개발 시 참고

- 이 저장소에는 아직 린트/테스트 설정이 없다.
- Supabase 관련 작업(테이블/RLS 등)은 Supabase MCP 도구로 수행하고, 반드시 프로젝트 ref `rnjktyadxotlirvpvbkj`("kokim80-maker's Project")에만 적용한다 — 자세한 규칙은 [CLAUDE.md](CLAUDE.md) 참고.
