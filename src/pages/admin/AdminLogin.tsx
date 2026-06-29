import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Eye, EyeOff } from 'lucide-react'

export function AdminLogin() {
  const { user, isAdmin, isLoading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1410] flex items-center justify-center">
        <div className="text-[#C49A6C] text-sm uppercase tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>
          Laden...
        </div>
      </div>
    )
  }

  if (user && isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1410] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/JoopLogo.png" alt="Kapper Joop" className="h-20 w-auto mb-5" />
          <h1 className="text-2xl font-bold text-[#D4B48C]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin toegang
          </h1>
          <p className="text-[#C9C0B4]/60 text-sm mt-1" style={{ fontFamily: "'Lora', serif" }}>
            Kapper Joop — Rijssen
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#2C1F14] p-8 space-y-5"
          style={{ border: '1px solid rgba(196,154,108,0.2)' }}
        >
          <div className="relative">
            <Input
              label="E-mailadres"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-[#1A1410] border-[rgba(196,154,108,0.25)] text-[#D4B48C] placeholder:text-[#C9C0B4]/30"
            />
          </div>

          <div className="relative">
            <Input
              label="Wachtwoord"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-[#1A1410] border-[rgba(196,154,108,0.25)] text-[#D4B48C] placeholder:text-[#C9C0B4]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-9 text-[#C49A6C]/60 hover:text-[#C49A6C] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[rgba(139,32,32,0.2)] border border-[rgba(139,32,32,0.4)]">
              <p className="text-sm text-[#E8A0A0]" style={{ fontFamily: "'Lora', serif" }}>
                {error.includes('admin') ? 'Je bent ingelogd, maar je hebt geen admin-toegang.' : error}
              </p>
            </div>
          )}

          {user && !isAdmin && (
            <div className="p-3 bg-[rgba(139,32,32,0.2)] border border-[rgba(139,32,32,0.4)]">
              <p className="text-sm text-[#E8A0A0]" style={{ fontFamily: "'Lora', serif" }}>
                Je bent ingelogd, maar je hebt geen admin-toegang.
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="copper"
            size="md"
            className="w-full mt-2"
            disabled={submitting}
          >
            {submitting ? 'Inloggen...' : 'Inloggen'}
          </Button>
        </form>

        <p className="text-center text-[#C9C0B4]/30 text-xs mt-6" style={{ fontFamily: "'Lora', serif" }}>
          Niet voor publiek gebruik.
        </p>
      </div>
    </div>
  )
}
