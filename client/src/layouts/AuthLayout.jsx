import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Sparkles, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function AuthLayout({
  children,
  title,
  subtitle,
  image = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
  quote = 'Every recipe tells a story of heritage, fire, and culinary passion.',
  quoteAuthor = 'Chef Vikram Oberoi',
}) {
  return (
    <div className="min-h-screen w-full flex bg-canvas text-charcoal">
      {/* ── Left Section: Gastronomy Editorial & Photography (Desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-charcoal select-none">
        {/* Background Image */}
        <img
          src={image}
          alt="Gastronomy presentation"
          className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Ambient Warm Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-canvas/10" />

        {/* Content Container */}
        <div className="relative z-10 w-full h-full p-12 lg:p-16 flex flex-col justify-between text-white">
          {/* Brand Mark */}
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center text-white shadow-md shadow-terracotta/30 group-hover:bg-terracotta-400 transition-colors">
              <Utensils className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-white block leading-none">
                FoodHub<span className="text-terracotta-400">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-200">
                Haute Gastronomy
              </span>
            </div>
          </Link>

          {/* Editorial Marketing Statement */}
          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-300" />
              <span>Curated Fine Dining & Kitchen Dispatches</span>
            </div>

            <h2 className="font-display text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white">
              Discover authentic regional flavours, curated with distinction.
            </h2>

            <blockquote className="border-l-2 border-terracotta-400 pl-4 py-1 text-sm text-stone-200 italic leading-relaxed">
              "{quote}"
              <span className="block not-italic text-xs text-stone-400 font-semibold mt-1">
                — {quoteAuthor}
              </span>
            </blockquote>
          </div>

          {/* Bottom Security / Trust Badges */}
          <div className="flex items-center justify-between text-xs text-stone-300 pt-6 border-t border-white/15">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>End-to-End Encrypted Authentication</span>
            </span>
            <span>8 Premier Culinary Cities</span>
          </div>
        </div>
      </div>

      {/* ── Right Section: Clean Authentication Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
        {/* Mobile Brand Header */}
        <div className="flex items-center justify-between lg:hidden pb-6 border-b border-neutralBorder">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-500 flex items-center justify-center text-white">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="font-display text-xl font-bold text-charcoal">
              FoodHub<span className="text-terracotta-500">.</span>
            </span>
          </Link>
        </div>

        {/* Center Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-charcoal-secondary mt-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-charcoal-muted pt-6 border-t border-neutralBorder-light">
          © {CURRENT_YEAR} FoodHub Technologies Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}

