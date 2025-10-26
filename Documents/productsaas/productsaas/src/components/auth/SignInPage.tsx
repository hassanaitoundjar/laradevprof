import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { FormInput } from './FormInput'
import { AuthButton } from './AuthButton'
import { Alert } from './Alert'
import { useAuth } from '../../contexts/AuthContext'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true)
    setAlert(null)

    try {
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to sign in'
        })
      } else {
        setAlert({
          type: 'success',
          message: 'Welcome back!'
        })
        setTimeout(() => {
          navigate('/')
        }, 1000)
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
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Alert
          type={alert?.type || 'info'}
          message={alert?.message || ''}
          show={!!alert}
          onClose={() => setAlert(null)}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" loading={loading}>
          Sign In
        </AuthButton>


        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-600"
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up
          </Link>
        </motion.p>
      </form>
    </AuthLayout>
  )
}
