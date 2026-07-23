import type { CongestionRecord } from '../types'

export const TIME_SLOTS = [
  '07:00',
  '09:00',
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '21:00',
] as const

// 목업 배열 1: 오늘(2026-07-23) 데이터
export const todayCongestionMock: CongestionRecord[] = [
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '07:00', congestionValue: 20, congestionLevel: '여유' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '09:00', congestionValue: 35, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '11:00', congestionValue: 55, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '13:00', congestionValue: 70, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '15:00', congestionValue: 60, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '17:00', congestionValue: 45, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '19:00', congestionValue: 30, congestionLevel: '여유' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-23', timeSlot: '21:00', congestionValue: 15, congestionLevel: '여유' },

  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '07:00', congestionValue: 40, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '09:00', congestionValue: 65, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '11:00', congestionValue: 80, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '13:00', congestionValue: 75, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '15:00', congestionValue: 55, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '17:00', congestionValue: 40, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '19:00', congestionValue: 25, congestionLevel: '여유' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-23', timeSlot: '21:00', congestionValue: 10, congestionLevel: '여유' },

  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '07:00', congestionValue: 15, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '09:00', congestionValue: 25, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '11:00', congestionValue: 40, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '13:00', congestionValue: 50, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '15:00', congestionValue: 45, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '17:00', congestionValue: 30, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '19:00', congestionValue: 20, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-23', timeSlot: '21:00', congestionValue: 10, congestionLevel: '여유' },

  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '07:00', congestionValue: 30, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '09:00', congestionValue: 50, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '11:00', congestionValue: 60, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '13:00', congestionValue: 55, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '15:00', congestionValue: 40, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '17:00', congestionValue: 30, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '19:00', congestionValue: 15, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-23', timeSlot: '21:00', congestionValue: 8, congestionLevel: '여유' },
]

// 목업 배열 2: 내일(2026-07-24) 데이터
export const tomorrowCongestionMock: CongestionRecord[] = [
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '07:00', congestionValue: 25, congestionLevel: '여유' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '09:00', congestionValue: 40, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '11:00', congestionValue: 58, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '13:00', congestionValue: 72, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '15:00', congestionValue: 62, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '17:00', congestionValue: 48, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '19:00', congestionValue: 33, congestionLevel: '여유' },
  { terminal: 'T1', zoneType: '입국장', date: '2026-07-24', timeSlot: '21:00', congestionValue: 18, congestionLevel: '여유' },

  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '07:00', congestionValue: 45, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '09:00', congestionValue: 68, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '11:00', congestionValue: 82, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '13:00', congestionValue: 78, congestionLevel: '혼잡' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '15:00', congestionValue: 58, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '17:00', congestionValue: 42, congestionLevel: '보통' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '19:00', congestionValue: 28, congestionLevel: '여유' },
  { terminal: 'T1', zoneType: '출국장', date: '2026-07-24', timeSlot: '21:00', congestionValue: 12, congestionLevel: '여유' },

  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '07:00', congestionValue: 18, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '09:00', congestionValue: 28, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '11:00', congestionValue: 42, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '13:00', congestionValue: 52, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '15:00', congestionValue: 47, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '17:00', congestionValue: 32, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '19:00', congestionValue: 22, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '입국장', date: '2026-07-24', timeSlot: '21:00', congestionValue: 12, congestionLevel: '여유' },

  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '07:00', congestionValue: 32, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '09:00', congestionValue: 52, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '11:00', congestionValue: 62, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '13:00', congestionValue: 57, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '15:00', congestionValue: 42, congestionLevel: '보통' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '17:00', congestionValue: 32, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '19:00', congestionValue: 17, congestionLevel: '여유' },
  { terminal: 'T2', zoneType: '출국장', date: '2026-07-24', timeSlot: '21:00', congestionValue: 10, congestionLevel: '여유' },
]
