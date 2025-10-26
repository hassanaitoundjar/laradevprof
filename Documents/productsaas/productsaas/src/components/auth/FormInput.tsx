import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white",
              icon && "pl-10",
              error && "border-red-300 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

FormInput.displayName = 'FormInput'
