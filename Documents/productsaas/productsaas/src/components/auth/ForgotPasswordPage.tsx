import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { FormInput } from './FormInput'
import { AuthButton } from './AuthButton'
import { Alert } from './Alert'
import { useAuth } from '../../contexts/AuthContext'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  
  const { resetPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setAlert(null)

    try {
      const { error } = await resetPassword(data.email)
      
      if (error) {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to send reset email'
        })
      } else {
        setAlert({
          type: 'success',
          message: 'Password reset email sent! Check your inbox for further instructions.'
        })
        setEmailSent(true)
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    const email = getValues('email')
    if (email) {
      await onSubmit({ email })
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Alert
          type={alert?.type || 'info'}
          message={alert?.message || ''}
          show={!!alert}
          onClose={() => setAlert(null)}
        />

        {!emailSent ? (
          <>
            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <AuthButton type="submit" loading={loading}>
              Send Reset Link
            </AuthButton>
          </>
        ) : (
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
              <Mail className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-slate-900">Check Your Email</h3>
              <p className="text-slate-600">
                We've sent a password reset link to your email address.
              </p>
            </motion.div>

            <AuthButton
              type="button"
              variant="secondary"
              onClick={handleResendEmail}
              loading={loading}
            >
              Resend Email
            </AuthButton>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <Link
            to="/signin"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </motion.div>
      </form>
    </AuthLayout>
  )
}
