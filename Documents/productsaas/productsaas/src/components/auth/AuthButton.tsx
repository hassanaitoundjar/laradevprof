import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'social'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export function AuthButton({
  variant = 'primary',
  loading = false,
  icon,
  children,
  className,
  disabled,
  onClick,
  type = 'button',
}: AuthButtonProps) {
  const baseClasses = "w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    secondary: "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500",
    social: "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500 shadow-sm hover:shadow-md"
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(baseClasses, variants[variant], className)}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="w-5 h-5">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}
