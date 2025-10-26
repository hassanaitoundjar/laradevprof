import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { FormInput } from "./FormInput";
import { AuthButton } from "./AuthButton";
import { Alert } from "./Alert";
import { useAuth } from "../../contexts/AuthContext";

const signUpSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setAlert(null);

    try {
      // Default role is 'seller' - admins can change this in database later
      const { error } = await signUp(data.email, data.password, data.username, 'seller');
      
      if (error) {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to create account'
        });
      } else {
        setAlert({
          type: 'success',
          message: 'Account created! Please check your email to verify your account.'
        });
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your journey with us today"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Alert
          type={alert?.type || "info"}
          message={alert?.message || ""}
          show={!!alert}
          onClose={() => setAlert(null)}
        />

        <FormInput
          label="Username"
          type="text"
          placeholder="Enter your username"
          icon={<User size={20} />}
          error={errors.username?.message}
          {...register("username")}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          error={errors.email?.message}
          {...register("email")}
        />


        <div className="relative">
          <FormInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            icon={<Lock size={20} />}
            error={errors.password?.message}
            {...register("password")}
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
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            icon={<Lock size={20} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
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
          Create Account
        </AuthButton>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-600"
        >
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </form>
    </AuthLayout>
  );
}
