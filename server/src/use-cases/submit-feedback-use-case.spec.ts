import { SubmitFeedbackUseCase } from "./submit-feedback-use-case"

const createFeedbackSpy = jest.fn()
const sendMailSpy = jest.fn()

const submitFeedback = new SubmitFeedbackUseCase(
  { create: createFeedbackSpy },
  { sendMail: sendMailSpy }      
)

describe('Submit feedback', () => {
  it('should be able to submit a feedback', async () => {
    await expect(submitFeedback.execute({
      type: 'BUG',
      comment: 'Some example...',
      screenshot: 'data:image/png;base64,ajsnajsnajs'
    })).resolves.not.toThrow()

    expect(createFeedbackSpy).toHaveBeenCalled()
  })

  it('should not be able to submit feedback without type', async () => {
    await expect(submitFeedback.execute({
      type: '',
      comment: 'Some example...',
      screenshot: 'data:image/png;base64,ajsnajsnajs'
    })).rejects.toThrow()

    expect(sendMailSpy).toHaveBeenCalled()
  })

  it('should not be able to submit feedback without comment', async () => {
    await expect(submitFeedback.execute({
      type: 'BUG',
      comment: '',
      screenshot: 'data:image/png;base64,ajsnajsnajs'
    })).rejects.toThrow()
  })

  it('should not be able to submit feedback with an invalid screenshot', async () => {
    await expect(submitFeedback.execute({
      type: 'BUG',
      comment: 'Some example...',
      screenshot: 'teste.jpg'
    })).rejects.toThrow()
  })
})