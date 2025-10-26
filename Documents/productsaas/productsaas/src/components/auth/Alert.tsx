import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  show: boolean
  onClose?: () => void
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600'
  }
}

export function Alert({ type, message, show, onClose }: AlertProps) {
  const config = alertConfig[type]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'p-4 rounded-lg border flex items-center gap-3 mb-4',
            config.bgColor,
            config.borderColor
          )}
        >
          <Icon className={cn('w-5 h-5 flex-shrink-0', config.iconColor)} />
          <p className={cn('text-sm font-medium flex-1', config.textColor)}>
            {message}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className={cn('text-sm font-medium hover:underline', config.textColor)}
            >
              Dismiss
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
