import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { NumericInput } from '@/components/ui/numeric-input'
import { asNumber, formatNumber } from '@/lib/utils'
import { ApiRequestError } from '@/services/errors'
import { rewardService } from '@/services/reward.service'
import type { RewardOption } from '@/types/reward'

export function RedeemDialog({
  reward,
  points,
  minimum,
  onClose,
  onSubmitted,
}: {
  reward: RewardOption
  points: number
  minimum: number
  onClose: () => void
  onSubmitted: (name: string) => void
}) {
  const [redeemPoints, setRedeemPoints] = useState(Math.max(minimum, reward.pointsRequired))
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const remaining = points - asNumber(redeemPoints)
  const canRedeem = asNumber(redeemPoints) >= minimum && asNumber(redeemPoints) <= points && points >= minimum

  async function confirmRedeem() {
    setSubmitting(true)
    setErrorMessage('')
    try {
      await rewardService.redeem({
        rewardId: reward.id,
        rewardName: reward.name,
        rewardPoints: asNumber(redeemPoints),
        paymentMethod: reward.paymentMethod,
        remark: reward.name,
      })
      onSubmitted(reward.name)
      onClose()
    } catch (error) {
      setErrorMessage(error instanceof ApiRequestError ? error.message : 'Unable to submit this request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent title="Request this reward" description={`Review this ${reward.name} request before you submit.`}>
        {errorMessage ? (
          <p className="mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="grid gap-4">
          <dl className="grid gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reward</dt>
              <dd className="font-medium text-ink">{reward.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Current balance</dt>
              <dd className="font-medium text-ink">{formatNumber(points)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Remaining balance</dt>
              <dd className="font-medium text-ink">{formatNumber(remaining)}</dd>
            </div>
          </dl>
          <Field label="Points to redeem" htmlFor="redeem-points" hint={`Minimum ${formatNumber(minimum)} points.`}>
            <NumericInput
              id="redeem-points"
              integer
              maxDigits={8}
              value={redeemPoints || ''}
              onValueChange={(value) => setRedeemPoints(asNumber(value))}
            />
          </Field>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          Submitting creates a pending request. You can follow approval, rejection, or completion in History.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => void confirmRedeem()} disabled={submitting || !canRedeem}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
