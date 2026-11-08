import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button, Input, Select } from '@/components/ui';
import { registerSchema } from '@/validations/auth.schema';
import { register as registerApi } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { INDIAN_CITIES } from '@/lib/utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();
  const { success } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'customer',
      city: 'Bhopal',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await registerApi(values);
      const { user, accessToken } = response;

      handleAuthSuccess({ user, accessToken });
      success('Account Created', `Welcome to FoodHub, ${user.name.split(' ')[0]}!`);

      // Route to relevant portal
      navigate(user.role === 'owner' ? '/owner' : '/', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Unable to complete registration. Please check your details.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join FoodHub as a diner or register your restaurant to receive live dining orders."
      image="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85"
      quote="Cooking is an art, but dining is an experience."
      quoteAuthor="Massimo Bottura"
    >
      {/* ── Server Error Banner ── */}
      {serverError && (
        <div
          role="alert"
          className="mb-6 p-3.5 bg-culinary-nonvegBg border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-culinary-nonveg font-medium"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* ── Registration Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Role Selector Cards */}
        <div>
          <label className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider block mb-2">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('role', 'customer')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                selectedRole === 'customer'
                  ? 'border-terracotta-500 bg-terracotta-50/50 shadow-warm-xs'
                  : 'border-neutralBorder bg-surface hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag
                  className={`w-4 h-4 ${
                    selectedRole === 'customer' ? 'text-terracotta-600' : 'text-charcoal-muted'
                  }`}
                />
                <span className="text-xs font-bold text-charcoal">Customer</span>
              </div>
              <span className="text-[11px] text-charcoal-muted leading-tight">
                Order meals & write reviews
              </span>
            </button>

            <button
              type="button"
              onClick={() => setValue('role', 'owner')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                selectedRole === 'owner'
                  ? 'border-terracotta-500 bg-terracotta-50/50 shadow-warm-xs'
                  : 'border-neutralBorder bg-surface hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed
                  className={`w-4 h-4 ${
                    selectedRole === 'owner' ? 'text-terracotta-600' : 'text-charcoal-muted'
                  }`}
                />
                <span className="text-xs font-bold text-charcoal">Restaurant Owner</span>
              </div>
              <span className="text-[11px] text-charcoal-muted leading-tight">
                Manage menus & kitchen orders
              </span>
            </button>
          </div>
          {errors.role && (
            <p className="text-xs text-culinary-nonveg mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
          required
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 6 characters"
          hint="Must be at least 6 characters"
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

        {/* City Selection */}
        <Select
          label="Primary City"
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.city?.message}
          {...register('city')}
        >
          {INDIAN_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-4"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      {/* ── Login Switcher ── */}
      <div className="mt-8 pt-6 border-t border-neutralBorder-light text-center">
        <p className="text-sm text-charcoal-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

