import type { DayKind } from '../types'
import { AuthButton } from './AuthButton'

interface HeaderProps {
  selectedDay: DayKind
  onSelectDay: (day: DayKind) => void
  onRefresh: () => void
  isDark: boolean
  onToggleDark: () => void
}

export function Header({ selectedDay, onSelectDay, onRefresh, isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="app-header card">
      <h1>인천공항 혼잡도 대시보드</h1>
      <div className="day-toggle">
        <button
          className={selectedDay === 'today' ? 'active' : ''}
          onClick={() => onSelectDay('today')}
        >
          오늘
        </button>
        <button
          className={selectedDay === 'tomorrow' ? 'active' : ''}
          onClick={() => onSelectDay('tomorrow')}
        >
          내일
        </button>
        <button onClick={onRefresh} aria-label="새로고침">
          ⟳ 새로고침
        </button>
        <button onClick={onToggleDark} aria-label="다크모드 토글">
          {isDark ? '🌙 다크' : '☀️ 라이트'}
        </button>
        <AuthButton />
      </div>
    </header>
  )
}
