export type KapperId = 'joop' | 'mat' | 'sari'

export interface Kapper {
  id: KapperId
  name: string
  colorHex: string
  photo?: string
}

export const KAPPERS: Kapper[] = [
  { id: 'joop', name: 'Joop', colorHex: '#C49A6C', photo: 'https://placehold.co/96x96/C49A6C/1A1410?text=J&font=oswald' },
  { id: 'mat',  name: 'Mat',  colorHex: '#6C8EC4', photo: 'https://placehold.co/96x96/6C8EC4/1A1410?text=M&font=oswald' },
  { id: 'sari', name: 'Sari', colorHex: '#6CC49A', photo: 'https://placehold.co/96x96/6CC49A/1A1410?text=S&font=oswald' },
]

export const KAPPER_MAP = Object.fromEntries(
  KAPPERS.map(k => [k.id, k])
) as Record<KapperId, Kapper>

export function getKapper(id: string): Kapper {
  if (id in KAPPER_MAP) return KAPPER_MAP[id as KapperId]
  return { id: id as KapperId, name: id, colorHex: '#9CA3AF' }
}
