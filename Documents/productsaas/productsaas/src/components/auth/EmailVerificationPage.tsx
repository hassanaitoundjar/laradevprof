import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { FormInput } from './FormInput'
import { AuthButton } from './AuthButton'
import { Alert } from './Alert'
import { useAuth } from '../../contexts/AuthContext'

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ResendFormData = z.infer<typeof resendSchema>

export function EmailVerificationPage() {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  
  const { resendVerification } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  })

  const onResend = async (data: ResendFormData) => {
    setLoading(true)
    setAlert(null)

    try {
      const { error } = await resendVerification(data.email)
      
      if (error) {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to resend verification email'
        })
      } else {
        setAlert({
          type: 'success',
          message: 'Verification email sent! Please check your inbox.'
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

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent you a verification link"
    >
      <div className="space-y-6">
        <Alert
          type={alert?.type || 'info'}
          message={alert?.message || ''}
          show={!!alert}
          onClose={() => setAlert(null)}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto"
        >
          <Mail className="w-8 h-8 text-blue-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Check Your Email</h3>
            <p className="text-slate-600">
              We've sent a verification link to your email address. Click the link to verify your account and complete the signup process.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
            <p className="font-medium mb-2">Didn't receive the email?</p>
            <ul className="space-y-1 text-left">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes for the email to arrive</li>
            </ul>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Need to resend?</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onResend)} className="space-y-4">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email to resend"
              icon={<Mail size={20} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <AuthButton
              type="submit"
              variant="secondary"
              loading={loading}
              icon={<RefreshCw size={20} />}
            >
              Resend Verification Email
            </AuthButton>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center space-x-4 text-sm"
        >
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Back to Sign In
          </Link>
          <span className="text-slate-400">•</span>
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign Up Again
          </Link>
        </motion.div>
      </div>
    </AuthLayout>
  )
}
