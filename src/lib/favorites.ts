import type { Favorite, Terminal, ZoneType } from '../types'
import { supabase } from './supabaseClient'

interface FavoriteRow {
  id: string
  adate: string
  atime: string
  terminal: string | null
  zone_type: string | null
  created_at: string
}

function rowToFavorite(row: FavoriteRow): Favorite {
  return {
    id: row.id,
    adate: row.adate,
    atime: row.atime,
    terminal: (row.terminal as Terminal | null) ?? null,
    zoneType: (row.zone_type as ZoneType | null) ?? null,
    createdAt: row.created_at,
  }
}

export async function listFavorites(): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id, adate, atime, terminal, zone_type, created_at')
    .order('adate', { ascending: true })
    .order('atime', { ascending: true })
  if (error) throw error
  return (data ?? []).map(rowToFavorite)
}

export async function addFavorite(input: {
  adate: string
  atime: string
  terminal: Terminal
  zoneType: ZoneType
}): Promise<Favorite> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!userData.user) throw new Error('로그인이 필요합니다')

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userData.user.id,
      adate: input.adate,
      atime: input.atime,
      terminal: input.terminal,
      zone_type: input.zoneType,
    })
    .select('id, adate, atime, terminal, zone_type, created_at')
    .single()
  if (error) throw error
  return rowToFavorite(data)
}

export async function removeFavorite(id: string): Promise<void> {
  const { error } = await supabase.from('favorites').delete().eq('id', id)
  if (error) throw error
}
