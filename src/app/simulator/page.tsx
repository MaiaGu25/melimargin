'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PricingSimulator } from '@/components/simulator/PricingSimulator';
import { Calculator, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CategoryKey, Modality, LogisticsType } from '@/types';

function SimulatorContent() {
  const searchParams = useSearchParams();

  const cost = searchParams.get('cost') ? parseFloat(searchParams.get('cost')!) : undefined;
  const price = searchParams.get('price') ? parseFloat(searchParams.get('price')!) : undefined;
  const category = (searchParams.get('category') as CategoryKey) || undefined;
  const modality = (searchParams.get('modality') as Modality) || undefined;
  const logistics = (searchParams.get('logistics') as LogisticsType) || undefined;
  const weight = searchParams.get('weight') ? parseInt(searchParams.get('weight')!) : undefined;
  const targetMargin = searchParams.get('targetMargin')
    ? parseFloat(searchParams.get('targetMargin')!)
    : undefined;
  const sku = searchParams.get('sku');

  return (
    <div className="space-y-6">
      {/* Title & Context */}
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-400/20">
              <Calculator className="h-3 w-3" />
              Simulador Interativo ML
            </span>
            {sku && (
              <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Simulando: {sku}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
            Simulador de Precificação & Proteção de Margem
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Simule o preço de venda exato para cobrir comissões (11-19%), frete obrigatório Mercado Envios (≥ R$ 79), taxa fixa (&lt; R$ 79), cubagem e imposto Simples Nacional.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/fees"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Regras de Tarifação</span>
          </Link>
        </div>
      </div>

      {/* Pricing Simulator Component */}
      <PricingSimulator
        initialValues={{
          costPrice: cost,
          salePrice: price,
          category,
          modality,
          logistics,
          weightGrams: weight,
          targetMarginPercent: targetMargin,
          calculationMode: price && !targetMargin ? 'target_price' : 'target_margin',
        }}
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px] text-zinc-400 text-xs">
          Carregando simulador de inteligência...
        </div>
      }>
        <SimulatorContent />
      </Suspense>
    </main>
  );
}
