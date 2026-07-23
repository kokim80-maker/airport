import { useEffect, useState } from 'react'
import type { Favorite } from '../types'
import { listFavorites, removeFavorite } from '../lib/favorites'
import { useAuth } from '../auth/AuthContext'

function isExpired(date: string): boolean {
  const todayIso = new Date().toISOString().slice(0, 10)
  return date < todayIso
}

export function FavoritesList() {
  const { session } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    if (!session) return
    listFavorites().then(setFavorites)
  }, [session])

  async function handleRemove(id: string) {
    await removeFavorite(id)
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  if (!session) {
    return (
      <section className="card">
        <p className="section-title">즐겨찾기</p>
        <p>로그인 후 이용할 수 있습니다.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <p className="section-title">즐겨찾기</p>
      {favorites.length === 0 ? (
        <p>저장된 즐겨찾기가 없습니다.</p>
      ) : (
        favorites.map((favorite) => (
          <div className="favorite-row" key={favorite.id}>
            <span>
              {favorite.adate} {favorite.atime}
              {favorite.terminal && favorite.zoneType
                ? ` · ${favorite.terminal} ${favorite.zoneType}`
                : ' · (터미널/구역 미기록)'}
              {isExpired(favorite.adate) && <span className="tag-expired">지난 항목</span>}
            </span>
            <button onClick={() => handleRemove(favorite.id)}>삭제</button>
          </div>
        ))
      )}
    </section>
  )
}
