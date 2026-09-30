'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, Sparkles } from 'lucide-react';
import { ReturnImpactCalculator } from '@/components/fees/ReturnImpactCalculator';
import { FeeRulesGuide } from '@/components/fees/FeeRulesGuide';

export default function FeesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 -ml-1 rounded-lg"
              title="Voltar ao Painel"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Scale className="h-3 w-3" />
              Inteligência Regulatória & Logística
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
            Taxas Mercado Livre & Simulador de Devoluções
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Guia completo de comissões, regra dos R$ 79,00, cubagem volumétrica e calculadora de corrosão de margem por devoluções e frete reverso.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/simulator"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/15 hover:brightness-110 transition-all active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simular Preço Unitário</span>
          </Link>
        </div>
      </div>

      {/* 1. Return & Reverse Logistics Financial Impact Calculator */}
      <ReturnImpactCalculator />

      {/* 2. Comprehensive Fee Rules Guide */}
      <FeeRulesGuide />
    </main>
  );
}
