import { useState } from 'react'
import type { CongestionRecord } from '../types'
import { useAuth } from '../auth/AuthContext'
import { addFavorite } from '../lib/favorites'

interface CongestionDetailCardProps {
  records: CongestionRecord[]
  selectedDate: string
  selectedTimeSlot: string
}

const levelStatusVar: Record<CongestionRecord['congestionLevel'], string> = {
  여유: 'var(--status-good)',
  보통: 'var(--status-warning)',
  혼잡: 'var(--status-critical)',
}

type TileStatus = 'idle' | 'saving' | 'saved' | 'error'

export function CongestionDetailCard({ records, selectedDate, selectedTimeSlot }: CongestionDetailCardProps) {
  const { session } = useAuth()
  const [tileStatus, setTileStatus] = useState<Record<string, TileStatus>>({})
  const [tileError, setTileError] = useState<Record<string, string>>({})

  async function handleAddFavorite(record: CongestionRecord) {
    const key = `${record.terminal}-${record.zoneType}`
    setTileStatus((prev) => ({ ...prev, [key]: 'saving' }))
    try {
      await addFavorite({
        adate: selectedDate,
        atime: selectedTimeSlot,
        terminal: record.terminal,
        zoneType: record.zoneType,
      })
      setTileStatus((prev) => ({ ...prev, [key]: 'saved' }))
    } catch (err) {
      setTileStatus((prev) => ({ ...prev, [key]: 'error' }))
      setTileError((prev) => ({ ...prev, [key]: err instanceof Error ? err.message : String(err) }))
    }
  }

  return (
    <section className="card">
      <p className="section-title">선택 시점 상세 혼잡도</p>
      {records.length === 0 ? (
        <p>해당 시간대 데이터가 없습니다.</p>
      ) : (
        <div className="stat-grid">
          {records.map((record) => {
            const key = `${record.terminal}-${record.zoneType}`
            const status = tileStatus[key] ?? 'idle'
            return (
              <div className="stat-tile" key={key}>
                <div className="label">
                  {record.terminal} · {record.zoneType}
                </div>
                <div className="value">
                  <span
                    className="status-dot"
                    style={{ background: levelStatusVar[record.congestionLevel] }}
                  />
                  {record.congestionValue} · {record.congestionLevel}
                </div>
                <div style={{ marginTop: 8 }}>
                  {session ? (
                    <>
                      <button onClick={() => handleAddFavorite(record)} disabled={status === 'saving'}>
                        즐겨찾기 추가
                      </button>
                      {status === 'saved' && (
                        <span style={{ color: 'var(--status-good)', marginLeft: 6 }}>저장됨</span>
                      )}
                      {status === 'error' && (
                        <span style={{ color: 'var(--status-critical)', marginLeft: 6 }}>
                          에러: {tileError[key]}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="label">로그인 후 즐겨찾기에 추가할 수 있습니다.</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
