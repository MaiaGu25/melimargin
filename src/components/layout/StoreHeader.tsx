'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Calendar,
  Zap,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { STORE_INFO } from '@/data/mock-meli';

interface StoreHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function StoreHeader({ title, subtitle, children }: StoreHeaderProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('Outubro 2026 (Mês Atual)');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('há 3 minutos');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('agora mesmo');
    }, 900);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-5 md:p-6 mb-8 shadow-xl">
      {/* Background glow decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Left Info: Title & Store Identity */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-400/20">
              <Zap className="h-3 w-3" />
              Conta Conectada
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-xs font-mono text-zinc-400">CNPJ: {STORE_INFO.cnpj}</span>
            <span className="text-zinc-500 text-xs">•</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{STORE_INFO.medal}</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100">
            {title || STORE_INFO.name}
          </h1>

          <p className="text-sm text-zinc-400 max-w-2xl">
            {subtitle || 'Inteligência de margem líquida real, cálculo de mordida tarifária e monitoramento de cubagem e devoluções.'}
          </p>

          {/* Mercado Livre Official Reputation Thermometer bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] text-zinc-400 font-medium">Reputação ML:</span>
              {/* 5-step ML thermometer with green 5th step active */}
              <div className="flex items-center gap-1">
                <div className="h-2 w-3.5 rounded-xs bg-red-900/40" title="Vermelho" />
                <div className="h-2 w-3.5 rounded-xs bg-amber-900/40" title="Laranja" />
                <div className="h-2 w-3.5 rounded-xs bg-yellow-900/40" title="Amarelo" />
                <div className="h-2 w-3.5 rounded-xs bg-lime-900/40" title="Verde Claro" />
                <div className="h-2.5 w-5 rounded-xs bg-emerald-500 shadow-sm shadow-emerald-500/50" title="Verde Escuro (Nível Máximo)" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400">Excelente</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-950/60 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Reclamações: <strong className="text-zinc-200">0.45%</strong></span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-950/60 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl">
              <Box className="h-3 w-3 text-amber-400" />
              <span>Envios FULL: <strong className="text-zinc-200">78%</strong></span>
            </div>
          </div>
        </div>

        {/* Right Controls: Period filter & Sync */}
        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
          <div className="flex items-center gap-2">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none rounded-xl bg-zinc-900 border border-zinc-700/80 px-3.5 py-2 pr-8 text-xs font-semibold text-zinc-200 hover:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-inner"
              >
                <option value="Outubro 2026 (Mês Atual)">Outubro 2026 (Mês Atual)</option>
                <option value="Setembro 2026 (Mês Anterior)">Setembro 2026 (Mês Anterior)</option>
                <option value="Últimos 30 Dias (Rolante)">Últimos 30 Dias (Rolante)</option>
                <option value="3º Trimestre 2026">3º Trimestre 2026</option>
              </select>
              <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            </div>

            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-600 active:scale-95 transition-all shadow-inner disabled:opacity-50"
              title="Sincronizar com Mercado Livre"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Atualizar'}</span>
            </button>
          </div>

          <div className="text-[11px] text-zinc-400">
            Sincronizado via Mercado Livre API <span className="text-zinc-300 font-medium">{lastSyncTime}</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
