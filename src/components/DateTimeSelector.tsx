import type { DayKind } from '../types'

interface DateTimeSelectorProps {
  selectedDay: DayKind
  selectedDate: string
  selectedTimeSlot: string
  timeSlots: readonly string[]
  onSelectTimeSlot: (timeSlot: string) => void
}

export function DateTimeSelector({
  selectedDay,
  selectedDate,
  selectedTimeSlot,
  timeSlots,
  onSelectTimeSlot,
}: DateTimeSelectorProps) {
  return (
    <section className="card">
      <p className="section-title">날짜·시간 선택</p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>
          {selectedDate} ({selectedDay === 'today' ? '오늘' : '내일'})
        </span>
        <select value={selectedTimeSlot} onChange={(e) => onSelectTimeSlot(e.target.value)}>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
