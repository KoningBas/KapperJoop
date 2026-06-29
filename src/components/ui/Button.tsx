import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'copper' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'copper', size = 'md', className = '', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-label font-semibold uppercase tracking-widest cursor-pointer transition-transform transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      copper: 'bg-[#C49A6C] text-[#1A1410] hover:bg-[#A07848] focus-visible:outline-[#C49A6C] active:scale-95',
      outline: 'border border-[#C49A6C] text-[#C49A6C] bg-transparent hover:bg-[rgba(196,154,108,0.08)] focus-visible:outline-[#C49A6C] active:scale-95',
      ghost: 'text-[#C49A6C] bg-transparent hover:bg-[rgba(196,154,108,0.08)] focus-visible:outline-[#C49A6C] active:scale-95',
      danger: 'bg-[#8B2020] text-white hover:bg-[#6B1818] focus-visible:outline-[#8B2020] active:scale-95',
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-sm',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
