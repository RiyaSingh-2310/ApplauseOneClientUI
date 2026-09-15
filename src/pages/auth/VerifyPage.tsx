import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle2, LoaderCircle, MailX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

function readActivationToken(search: URLSearchParams, hash: string, pathToken?: string) {
  const keys = ['token', 'activation_token', 'activationToken']
  for (const key of keys) {
    const value = search.get(key)?.trim()
    if (value) return value
  }
  const hashValue = hash.startsWith('#') ? hash.slice(1) : hash
  if (hashValue) {
    const params = new URLSearchParams(hashValue.includes('=') ? hashValue : `token=${hashValue}`)
    for (const key of keys) {
      const value = params.get(key)?.trim()
      if (value) return value
    }
  }
  return pathToken?.trim() ?? ''
}

export function VerifyPage() {
  const [params] = useSearchParams()
  const { token: pathToken } = useParams()
  const token = useMemo(
    () => readActivationToken(params, window.location.hash, pathToken),
    [params, pathToken],
  )
  const [status, setStatus] = useState<'loading' | 'success' | 'invalid' | 'expired' | 'missing'>(
    token ? 'loading' : 'missing',
  )

  useEffect(() => {
    if (!token) {
      setStatus('missing')
      return
    }
    let cancelled = false
    authService
      .verify(token)
      .then(() => {
        if (!cancelled) setStatus('success')
      })
      .catch((error) => {
        if (cancelled) return
        const code = error instanceof ApiRequestError ? error.status : undefined
        setStatus(code === 410 ? 'expired' : 'invalid')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const copy =
    status === 'loading'
      ? {
          title: 'Verifying your email…',
          body: 'Please wait while we activate your Applause One account.',
        }
      : status === 'success'
        ? {
            title: 'Email Verified Successfully',
            body: 'Your account has been successfully activated. You can now log in and start using Applause One.',
          }
        : status === 'expired'
          ? {
              title: 'Verification Link Expired',
              body: 'This verification link is no longer valid. Sign in or join again if you still need to activate your account.',
            }
          : {
              title: 'Verification Link Invalid or Expired',
              body:
                status === 'missing'
                  ? 'This page needs a valid verification link from your email.'
                  : 'We could not activate your account with this link. It may have already been used.',
            }

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-10">
        <div
          className={`mx-auto grid size-14 place-items-center rounded-full ${
            status === 'success' ? 'bg-success-soft text-success' : status === 'loading' ? 'bg-teal-soft text-teal' : 'bg-danger-soft text-danger'
          }`}
        >
          {status === 'loading' ? (
            <LoaderCircle className="size-7 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="size-7" />
          ) : (
            <MailX className="size-7" />
          )}
        </div>
        <h1 className="font-display mt-5 text-3xl text-ink">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">{copy.body}</p>
        {status !== 'loading' ? (
          <Button className="mt-8" asChild>
            <Link to="/login">{status === 'success' ? 'Continue to Login' : 'Back to Login'}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
