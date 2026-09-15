import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle2, LoaderCircle, MailX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { readActivationToken } from '@/lib/activationToken'
import { ApiRequestError } from '@/services/errors'
import { authService } from '@/services/auth.service'

function isAlreadyVerified(error: unknown) {
  if (!(error instanceof ApiRequestError)) return false
  const message = error.message.toLowerCase()
  return error.status === 409 || message.includes('already verified') || message.includes('already activated')
}

export function VerifyPage() {
  const [params] = useSearchParams()
  const { token: pathToken } = useParams()
  const token = useMemo(
    () => readActivationToken(params, typeof window !== 'undefined' ? window.location.hash : '', pathToken),
    [params, pathToken],
  )
  const [status, setStatus] = useState<'loading' | 'success' | 'already' | 'invalid' | 'expired' | 'missing' | 'error'>(
    token ? 'loading' : 'missing',
  )
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!token) {
      setStatus('missing')
      return
    }

    let cancelled = false
    setStatus('loading')
    authService
      .verify(token)
      .then(() => {
        if (!cancelled) setStatus('success')
      })
      .catch((error) => {
        if (cancelled) return
        if (isAlreadyVerified(error)) {
          setStatus('already')
          return
        }
        const code = error instanceof ApiRequestError ? error.status : undefined
        if (code === 410) setStatus('expired')
        else if (code === 404 || code === 400 || code === 422) setStatus('invalid')
        else setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [token, retry])

  const copy =
    status === 'loading'
      ? {
          title: 'Verifying your email…',
          body: 'Please wait while we activate your Applause One account.',
        }
      : status === 'success'
        ? {
            title: 'Email Verified Successfully',
            body: 'Your email has been verified. You can now log in to your Applause One account.',
          }
        : status === 'already'
          ? {
              title: 'Email already verified',
              body: 'This account is already activated. You can log in with your email and password.',
            }
          : status === 'expired'
            ? {
                title: 'Verification Link Expired',
                body: 'This verification link is no longer valid. Please register again or contact support if you still need access.',
              }
            : status === 'error'
              ? {
                  title: 'We couldn’t verify your email',
                  body: 'The connection failed or the server is unavailable. Please try again in a moment.',
                }
              : {
                  title: 'Verification Link Invalid or Expired',
                  body:
                    status === 'missing'
                      ? 'This page needs a valid verification link from your email.'
                      : 'We could not activate your account with this link. It may be invalid or already used.',
                }

  const showLogin = status !== 'loading'
  const loginLabel = status === 'success' || status === 'already' ? 'Go to Login' : 'Back to Login'

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-10">
        <div
          className={`mx-auto grid size-14 place-items-center rounded-full ${
            status === 'success' || status === 'already'
              ? 'bg-success-soft text-success'
              : status === 'loading'
                ? 'bg-teal-soft text-teal'
                : 'bg-danger-soft text-danger'
          }`}
        >
          {status === 'loading' ? (
            <LoaderCircle className="size-7 animate-spin" />
          ) : status === 'success' || status === 'already' ? (
            <CheckCircle2 className="size-7" />
          ) : (
            <MailX className="size-7" />
          )}
        </div>
        <h1 className="font-display mt-5 text-3xl text-ink">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">{copy.body}</p>
        {status === 'error' ? (
          <Button className="mt-8" type="button" variant="outline" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        ) : null}
        {showLogin ? (
          <Button className={status === 'error' ? 'mt-3' : 'mt-8'} asChild>
            <Link to={paths.login}>{loginLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
