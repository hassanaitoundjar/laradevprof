import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { FormInput } from './FormInput'
import { AuthButton } from './AuthButton'
import { Alert } from './Alert'
import { useAuth } from '../../contexts/AuthContext'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      setAlert({
        type: 'error',
        message: 'Invalid or expired reset link. Please request a new one.'
      })
    }
  }, [searchParams])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true)
    setAlert(null)

    try {
      const { error } = await updatePassword(data.password)
      
      if (error) {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to update password'
        })
      } else {
        setAlert({
          type: 'success',
          message: 'Password updated successfully!'
        })
        setIsSuccess(true)
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
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

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Updated"
        subtitle="Your password has been successfully updated"
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-slate-600">
              You can now sign in with your new password.
            </p>
          </motion.div>

          <AuthButton onClick={() => navigate('/signin')}>
            Continue to Sign In
          </AuthButton>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Alert
          type={alert?.type || 'info'}
          message={alert?.message || ''}
          show={!!alert}
          onClose={() => setAlert(null)}
        />

        <div className="relative">
          <FormInput
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            icon={<Lock size={20} />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <FormInput
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your new password"
            icon={<Lock size={20} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <AuthButton type="submit" loading={loading}>
          Update Password
        </AuthButton>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-slate-600"
        >
          Remember your password?{' '}
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </form>
    </AuthLayout>
  )
}
