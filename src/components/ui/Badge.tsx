interface BadgeProps {
  children: React.ReactNode
  variant?: 'koper' | 'dark' | 'light'
  className?: string
}

export function Badge({ children, variant = 'koper', className = '' }: BadgeProps) {
  const variants = {
    koper: 'bg-[rgba(196,154,108,0.15)] text-[#C49A6C] border border-[rgba(196,154,108,0.4)]',
    dark: 'bg-[rgba(26,20,16,0.7)] text-[#D4B48C] border border-[rgba(196,154,108,0.3)]',
    light: 'bg-[rgba(245,240,232,0.9)] text-[#A07848] border border-[rgba(196,154,108,0.25)]',
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-label font-semibold uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
