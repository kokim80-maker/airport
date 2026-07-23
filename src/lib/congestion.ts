import type { CongestionRecord, DayKind } from '../types'
import { todayCongestionMock, tomorrowCongestionMock } from '../mock/congestionData'

// TODO: 실제 연동 시 공공데이터포털 API 호출로 교체 (CORS 확인 후 — CLAUDE.md 참고)

export async function fetchTodayCongestion(): Promise<CongestionRecord[]> {
  return todayCongestionMock
}

export async function fetchTomorrowCongestion(): Promise<CongestionRecord[]> {
  return tomorrowCongestionMock
}

export async function fetchCongestionByDay(day: DayKind): Promise<CongestionRecord[]> {
  return day === 'today' ? fetchTodayCongestion() : fetchTomorrowCongestion()
}

export async function fetchCongestionByDateTime(
  day: DayKind,
  timeSlot: string,
): Promise<CongestionRecord[]> {
  const records = await fetchCongestionByDay(day)
  return records.filter((record) => record.timeSlot === timeSlot)
}
