export type Terminal = 'T1' | 'T2'

export type ZoneType = '입국장' | '출국장'

export type CongestionLevel = '여유' | '보통' | '혼잡'

export type DayKind = 'today' | 'tomorrow'

export interface CongestionRecord {
  terminal: Terminal
  zoneType: ZoneType
  date: string // YYYY-MM-DD
  timeSlot: string // HH:mm
  congestionValue: number // 0-100
  congestionLevel: CongestionLevel
}

export interface Favorite {
  id: string
  adate: string // YYYY-MM-DD
  atime: string // HH:mm
  terminal: Terminal | null // 컬럼 추가 전 저장된 행은 null일 수 있음
  zoneType: ZoneType | null
  createdAt: string
}
