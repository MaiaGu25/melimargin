'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { ProductItem } from '@/types';
import { calculateProductFinancials, formatBRL } from '@/lib/meli-calculator';

interface CriticalAlertBannerProps {
  products: ProductItem[];
  onQuickFix?: (product: ProductItem) => void;
}

export function CriticalAlertBanner({ products, onQuickFix }: CriticalAlertBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const bleedingProducts = products.filter((p) => {
    const fin = calculateProductFinancials(p);
    return fin.status === 'bleeding';
  });

  if (bleedingProducts.length === 0) return null;

  const totalBleedingLoss = bleedingProducts.reduce((acc, p) => {
    const fin = calculateProductFinancials(p);
    return acc + (fin.monthlyProfit < 0 ? Math.abs(fin.monthlyProfit) : 0);
  }, 0);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950 p-5 shadow-2xl shadow-red-500/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Icon and message */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-xs font-bold text-red-300 uppercase tracking-wide">
                Alerta Crítico de Margem
              </span>
              <span className="text-xs text-zinc-400">
                Sangria estimada: <strong className="text-red-400 font-bold">-{formatBRL(totalBleedingLoss)}/mês</strong>
              </span>
            </div>
            <p className="text-sm font-semibold text-zinc-100">
              ⚠️ <span className="text-red-400 font-bold">{bleedingProducts.length} SKUs identificados operando no prejuízo</span> devido a alterações recentes de cubagem e devoluções.
            </p>
            <p className="text-xs text-zinc-400">
              A cada unidade vendida destes anúncios, sua operação perde dinheiro em vez de lucrar. Reajuste os preços ou revise a embalagem imediatamente.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
          >
            <span>{isExpanded ? 'Ocultar Detalhes' : 'Ver SKUs Afetados'}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          <Link
            href="/products?status=bleeding"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-xs font-bold text-red-200 transition-all shadow-md shadow-red-500/10 active:scale-95"
          >
            <span>Auditar Sangria</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Expandable breakdown drawer */}
      {isExpanded && (
        <div className="mt-5 border-t border-zinc-800/80 pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bleedingProducts.map((p) => {
              const fin = calculateProductFinancials(p);
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-red-500/20 bg-zinc-900/80 p-3.5 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                        {p.sku}
                      </span>
                      <span className="font-semibold text-zinc-400">
                        {p.monthlyUnits} un/mês
                      </span>
                    </div>
                    <h4 className="text-xs font-medium text-zinc-200 line-clamp-1 mt-1">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {p.alertReason || 'Margem negativa após dedução de frete e tarifas Mercado Livre.'}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-500">Lucro Unitário</div>
                      <div className="font-bold text-red-400">
                        {formatBRL(fin.netProfitUnit)} ({fin.marginPercent}%)
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-zinc-500">Preço Sugerido (15%)</div>
                      <div className="font-bold text-emerald-400">
                        {formatBRL(fin.suggestedHealthyPrice)}
                      </div>
                    </div>

                    {onQuickFix ? (
                      <button
                        onClick={() => onQuickFix(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] font-semibold transition-colors"
                        title="Corrigir Preço"
                      >
                        <Wrench className="h-3 w-3" />
                        <span>Corrigir</span>
                      </button>
                    ) : (
                      <Link
                        href={`/simulator?cost=${p.costPrice}&category=${p.category}&modality=${p.modality}&logistics=${p.logistics}&weight=${p.weightGrams}&price=${p.currentPrice}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] font-semibold transition-colors"
                        title="Simular no calculador"
                      >
                        <Wrench className="h-3 w-3" />
                        <span>Simular</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
