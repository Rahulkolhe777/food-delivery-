import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserCheck, Store } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button, Input } from '@/components/ui';
import { loginSchema } from '@/validations/auth.schema';
import { login as loginApi } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAuthSuccess } = useAuth();
  const { success } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Pre-fill demo accounts for effortless testing
  const setDemoCredentials = (role) => {
    setServerError(null);
    if (role === 'customer') {
      setValue('email', 'customer@foodhub.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'owner@foodhub.com');
      setValue('password', 'password123');
    }
  };

  const onSubmit = async (values) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await loginApi(values);
      const { user, accessToken } = response;

      handleAuthSuccess({ user, accessToken });
      success(`Welcome back, ${user.name.split(' ')[0]}`, 'Logged in successfully.');

      // Route based on role or original intended location
      const destination =
        location.state?.from?.pathname || (user.role === 'owner' ? '/owner' : '/');
      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Unable to sign in. Please check your credentials.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to order from premier restaurants or manage your culinary kitchen."
      image="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85"
      quote="Good food is the foundation of genuine happiness."
      quoteAuthor="Auguste Escoffier"
    >
      {/* ── Demo Credentials Bar ── */}
      <div className="mb-6 p-3.5 bg-surface border border-neutralBorder rounded-xl shadow-warm-xs">
        <p className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider mb-2">
          Instant Demo Access:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials('customer')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-subtle hover:bg-surface-hover text-charcoal-secondary border border-neutralBorder transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Customer Demo</span>
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('owner')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-subtle hover:bg-surface-hover text-charcoal-secondary border border-neutralBorder transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Restaurant Owner Demo</span>
          </button>
        </div>
      </div>

      {/* ── Server Error Notification ── */}
      {serverError && (
        <div
          role="alert"
          className="mb-6 p-3.5 bg-culinary-nonvegBg border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-culinary-nonveg font-medium"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* ── Login Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-charcoal-muted hover:text-charcoal transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* ── Register Switcher ── */}
      <div className="mt-8 pt-6 border-t border-neutralBorder-light text-center">
        <p className="text-sm text-charcoal-secondary">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

