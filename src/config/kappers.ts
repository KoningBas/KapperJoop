export type KapperId = 'joop' | 'mat' | 'sari'

export interface Kapper {
  id: KapperId
  name: string
  colorHex: string
}

export const KAPPERS: Kapper[] = [
  { id: 'joop', name: 'Joop', colorHex: '#C49A6C' },
  { id: 'mat',  name: 'Mat',  colorHex: '#6C8EC4' },
  { id: 'sari', name: 'Sari', colorHex: '#6CC49A' },
]

export const KAPPER_MAP = Object.fromEntries(
  KAPPERS.map(k => [k.id, k])
) as Record<KapperId, Kapper>

export function getKapper(id: string): Kapper {
  return KAPPER_MAP[id as KapperId] ?? {
    id: id as KapperId,
    name: id,
    colorHex: '#9CA3AF',
  }
}
