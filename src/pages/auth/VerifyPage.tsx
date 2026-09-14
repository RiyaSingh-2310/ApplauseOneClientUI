import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

export function VerifyPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { completeSession, user } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState(token ? 'Verifying your email…' : 'A verification token is missing.')
  const [error, setError] = useState(!token)

  useEffect(() => {
    if (!token || user) return
    let cancelled = false
    authService
      .verify(token)
      .then((session) => {
        if (cancelled) return
        completeSession(session.token, session.user, true)
        navigate('/panelist/dashboard', { replace: true })
      })
      .catch((err) => {
        if (cancelled) return
        setError(true)
        setMessage(err instanceof ApiRequestError ? err.message : 'Unable to verify this email link.')
      })
    return () => {
      cancelled = true
    }
  }, [token, user, completeSession, navigate])

  if (user) return null

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-card">
        <h1 className="font-display text-3xl text-ink">Email verification</h1>
        <p className={`mt-4 text-sm ${error ? 'text-danger' : 'text-ink-soft'}`}>{message}</p>
        {error ? (
          <Button className="mt-6" asChild>
            <Link to="/login">Back to login</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
