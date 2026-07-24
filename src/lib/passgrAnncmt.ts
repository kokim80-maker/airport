// 인천공항 여객예고정보 API — Supabase Edge Function(airport-proxy) 경유 호출 (CLAUDE.md §시크릿 관리 규칙)
// 공공데이터 API 키는 Edge Function의 Secret으로만 관리되며 프론트엔드에는 전달되지 않는다.
// XML 파싱 등 원본 API와의 통신은 airport-proxy 함수(supabase/functions/airport-proxy/index.ts)가 대행한다.
import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export interface PassgrAnncmtItem {
  [key: string]: string
}

export interface PassgrAnncmtResult {
  resultCode: string
  resultMsg: string
  items: PassgrAnncmtItem[]
}

export async function getPassgrAnncmt(selectdate: 0 | 1): Promise<PassgrAnncmtResult> {
  console.log('[getPassgrAnncmt] 불러오는 중...', { selectdate })

  const { data, error } = await supabase.functions.invoke('airport-proxy', {
    body: { selectdate },
  })

  if (error) {
    let message = error.message
    if (error instanceof FunctionsHttpError) {
      try {
        const body = await error.context.json()
        if (body?.error) message = body.error
      } catch {
        // 응답 바디를 JSON으로 읽지 못한 경우 기본 메시지 사용
      }
    }
    console.error('[getPassgrAnncmt] 요청 실패', message)
    throw new Error(`API 요청 실패: ${message}`)
  }

  console.log('[getPassgrAnncmt] 응답', data)

  const { resultCode, resultMsg, items } = data as PassgrAnncmtResult

  if (resultCode !== '00') {
    throw new Error(`API 오류: ${resultCode} ${resultMsg}`)
  }

  return { resultCode, resultMsg, items }
}
