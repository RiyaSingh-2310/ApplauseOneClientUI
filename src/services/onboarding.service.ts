import type { AnswersResponse, OnboardingAnswerInput, OnboardingStepGroup, QuestionsResponse } from '@/types/api'
import { flattenQuestions } from '@/lib/apiMap'
import { apiRequest } from './http'

export const onboardingService = {
  getQuestions(stepNo?: number) {
    const suffix = stepNo != null ? `?step_no=${stepNo}` : ''
    return apiRequest<QuestionsResponse | OnboardingStepGroup[]>(`/questions${suffix}`, { auth: false }).then((data) => {
      const steps = Array.isArray(data) ? data : data.steps ?? []
      return { steps, questions: flattenQuestions(steps) }
    })
  },
  getAnswers() {
    return apiRequest<AnswersResponse>('/onboarding/answers')
  },
  saveAnswers(answers: OnboardingAnswerInput[]) {
    return apiRequest<AnswersResponse>('/onboarding/answers', {
      method: 'POST',
      body: { answers },
    })
  },
}
