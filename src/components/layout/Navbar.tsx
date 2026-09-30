'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  Calculator,
  PackageSearch,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Visão Executiva',
    icon: TrendingUp,
    badge: null,
  },
  {
    href: '/simulator',
    label: 'Simulador de Preço',
    icon: Calculator,
    badge: 'Pro',
  },
  {
    href: '/products',
    label: 'Auditoria de SKUs',
    icon: PackageSearch,
    badge: '3 Alertas',
    badgeAlert: true,
  },
  {
    href: '/fees',
    label: 'Taxas & Devoluções',
    icon: Scale,
    badge: 'FULL',
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-black text-zinc-950 text-xl tracking-tighter">M</span>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-zinc-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-lg text-zinc-100">
                    Meli<span className="text-amber-400">Margin</span>
                  </span>
                  <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                    INTELLIGENCE
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Mercado Livre Margin Guard
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-800/90 text-amber-400 shadow-inner'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                          item.badgeAlert
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action & Account Badge */}
          <div className="flex items-center gap-3">
            {/* Quick Action Simulator */}
            <Link
              href="/simulator"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/15 hover:brightness-110 transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simular Preço</span>
            </Link>

            {/* Store & Reputation pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-800">
              <div className="flex flex-col text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-semibold text-zinc-200">EletroPro Mega</span>
                  <div className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" title="Termômetro Verde Escuro" />
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px] text-zinc-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Líder Platinum</span>
                </div>
              </div>

              <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-amber-400 font-bold text-xs shadow-inner">
                EP
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-zinc-800/60 text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
