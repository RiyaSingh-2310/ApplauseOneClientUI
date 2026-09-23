import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { NumericInput } from '@/components/ui/numeric-input'
import { RewardMethodSelect } from '@/components/rewards/RewardMethodSelect'
import { RewardMethodMark } from '@/components/rewards/RewardMethodMark'
import {
  getRewardMethodById,
  resolveRewardMethodId,
} from '@/content/rewardMethods'
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
  const [methodId, setMethodId] = useState(() =>
    resolveRewardMethodId(reward.paymentMethod ?? reward.name),
  )
  const [redeemPoints, setRedeemPoints] = useState<number | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const enteredPoints = redeemPoints === '' ? 0 : asNumber(redeemPoints)
  const remaining = points - enteredPoints
  const pointsError =
    redeemPoints === ''
      ? ''
      : enteredPoints > points
        ? `Enter no more than ${formatNumber(points)} points.`
        : enteredPoints < minimum
          ? `Enter at least ${formatNumber(minimum)} points.`
          : ''
  const canRedeem =
    redeemPoints !== '' && enteredPoints >= minimum && enteredPoints <= points && points >= minimum
  const selectedMethod = getRewardMethodById(methodId)

  async function confirmRedeem() {
    if (!selectedMethod) {
      setErrorMessage('Select a reward method to continue.')
      return
    }
    setSubmitting(true)
    setErrorMessage('')
    try {
      await rewardService.redeem({
        rewardId: reward.id,
        rewardName: selectedMethod.name,
        rewardPoints: asNumber(redeemPoints),
        paymentMethod: selectedMethod.apiValue,
        remark: selectedMethod.name,
      })
      onSubmitted(selectedMethod.name)
      onClose()
    } catch (error) {
      setErrorMessage(error instanceof ApiRequestError ? error.message : 'Unable to submit this request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent title="Request this reward" description="Choose a payout method and points before you submit.">
        {errorMessage ? (
          <p className="mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="grid gap-4">
          <dl className="grid gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Catalog item</dt>
              <dd className="font-medium text-ink">{reward.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Current balance</dt>
              <dd className="font-medium text-ink">{formatNumber(points)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Remaining balance</dt>
              <dd className="font-medium text-ink">{formatNumber(remaining)}</dd>
            </div>
            {selectedMethod ? (
              <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
                <dt className="text-muted">Payout method</dt>
                <dd className="flex items-center gap-2 font-medium text-ink">
                  <RewardMethodMark method={selectedMethod} size="sm" />
                  {selectedMethod.name}
                </dd>
              </div>
            ) : null}
          </dl>

          <Field label="Reward method" htmlFor="reward-method">
            <RewardMethodSelect
              id="reward-method"
              value={methodId}
              onValueChange={setMethodId}
              disabled={submitting}
            />
          </Field>

          <Field
            label="Points to redeem"
            htmlFor="redeem-points"
            hint={`Minimum: ${formatNumber(minimum)}`}
            error={pointsError || undefined}
          >
            <NumericInput
              id="redeem-points"
              integer
              maxDigits={8}
              value={redeemPoints}
              onValueChange={(value) => setRedeemPoints(value === '' ? '' : asNumber(value))}
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
          <Button onClick={() => void confirmRedeem()} disabled={submitting || !canRedeem || !selectedMethod}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
