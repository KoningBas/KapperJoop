import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="font-label text-xs font-semibold uppercase tracking-widest text-[#A07848]">
            {label}{props.required && ' *'}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 font-body text-sm text-[#3D2B1F] bg-white border border-[rgba(196,154,108,0.35)] focus:outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[rgba(196,154,108,0.3)] placeholder:text-[#A07848]/50 transition-colors duration-200 ${error ? 'border-[#8B2020]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#8B2020] font-body">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="font-label text-xs font-semibold uppercase tracking-widest text-[#A07848]">
            {label}{props.required && ' *'}
          </label>
        )}
        <textarea
          ref={ref}
          rows={4}
          className={`w-full px-4 py-3 font-body text-sm text-[#3D2B1F] bg-white border border-[rgba(196,154,108,0.35)] focus:outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[rgba(196,154,108,0.3)] placeholder:text-[#A07848]/50 transition-colors duration-200 resize-none ${error ? 'border-[#8B2020]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#8B2020] font-body">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
