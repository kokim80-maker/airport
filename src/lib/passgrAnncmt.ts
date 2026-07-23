// 공공데이터포털 인천공항 여객예고정보 API — 프론트엔드 직접 호출 (CLAUDE.md §시크릿 관리 전제)
// 이 API는 `_type=json`을 보내도 무시하고 항상 XML로 응답한다(실제 호출로 확인됨) — JSON 파싱을
// 시도하면 실패하므로 XML을 직접 파싱한다.
// PRD.md §16: 응답 필드 자체는 확인됐지만(adate/atime/t1dg*/t1eg*/t2dg*/t2eg* 등) 각 필드가
// 정확히 무엇을 의미하는지(예: dg/eg가 입국장/출국장 중 무엇인지)는 data.go.kr 공식 문서로
// 아직 재검증 필요 — 그래서 CongestionRecord로 매핑하지 않고 원본 필드를 그대로 반환한다.

export interface PassgrAnncmtItem {
  [key: string]: string
}

export interface PassgrAnncmtResult {
  resultCode: string
  resultMsg: string
  items: PassgrAnncmtItem[]
}

const ENDPOINT = 'https://apis.data.go.kr/B551177/passgrAnncmt/getPassgrAnncmt'

function parseXml(text: string): Document {
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  if (doc.querySelector('parsererror')) {
    throw new Error('API 응답을 XML로 해석하지 못했습니다')
  }
  return doc
}

function elementToItem(el: Element): PassgrAnncmtItem {
  const item: PassgrAnncmtItem = {}
  for (const child of Array.from(el.children)) {
    item[child.tagName] = child.textContent ?? ''
  }
  return item
}

export async function getPassgrAnncmt(selectdate: 0 | 1): Promise<PassgrAnncmtResult> {
  const apiKey = import.meta.env.VITE_AIRPORT_API_KEY
  if (!apiKey) {
    throw new Error('VITE_AIRPORT_API_KEY가 설정되어 있지 않습니다 (.env 확인)')
  }

  const url = new URL(ENDPOINT)
  url.searchParams.set('serviceKey', apiKey)
  url.searchParams.set('selectdate', String(selectdate))
  url.searchParams.set('numOfRows', '100')

  const response = await fetch(url.toString())
  const text = await response.text()

  if (!response.ok) {
    throw new Error(`API 요청 실패: HTTP ${response.status}`)
  }

  console.log('[getPassgrAnncmt] raw response', text)

  const doc = parseXml(text)
  const resultCode = doc.querySelector('header > resultCode')?.textContent ?? ''
  const resultMsg = doc.querySelector('header > resultMsg')?.textContent ?? ''

  if (resultCode !== '00') {
    throw new Error(`API 오류: ${resultCode} ${resultMsg}`)
  }

  const items = Array.from(doc.querySelectorAll('items > item')).map(elementToItem)

  return { resultCode, resultMsg, items }
}
