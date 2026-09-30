'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Calculator,
} from 'lucide-react';
import { ProductItem } from '@/types';
import {
  calculateProductFinancials,
  solvePriceForTargetMargin,
  formatBRL,
  formatPercent,
} from '@/lib/meli-calculator';

interface PriceFixModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyPrice: (productId: string, newPrice: number) => void;
}

export function PriceFixModal({
  product,
  isOpen,
  onClose,
  onApplyPrice,
}: PriceFixModalProps) {
  const [targetMargin, setTargetMargin] = useState<number>(15);
  const [customPriceOverride, setCustomPriceOverride] = useState<number | null>(null);

  if (!isOpen || !product) return null;

  const currentFin = calculateProductFinancials(product);

  const calculatedSuggestedPrice = solvePriceForTargetMargin(
    product.costPrice,
    product.category,
    product.modality,
    product.logistics,
    product.taxRate,
    targetMargin / 100,
    product.packagingCost,
    product.weightGrams,
    product.dimensionsCm
  );

  const effectivePrice = customPriceOverride ?? calculatedSuggestedPrice;

  const handleMarginChange = (val: number) => {
    setTargetMargin(val);
    setCustomPriceOverride(null);
  };

  const simulatedProduct: ProductItem = {
    ...product,
    currentPrice: effectivePrice,
  };
  const simulatedFin = calculateProductFinancials(simulatedProduct);
  const monthlyProfitDiff = simulatedFin.monthlyProfit - currentFin.monthlyProfit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {product.sku}
              </span>
              <span className="text-xs text-zinc-400">Auditoria & Correção de Preço</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 line-clamp-1">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Diagnosis Pill */}
        {product.alertReason && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <span className="font-semibold text-red-200">Diagnóstico da Sangria: </span>
              {product.alertReason}
            </div>
          </div>
        )}

        {/* Interactive Margin Target Control */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              Margem Líquida Alvo Desejada:
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {targetMargin}%
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="30"
            step="0.5"
            value={targetMargin}
            onChange={(e) => handleMarginChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>5% (Mínima)</span>
            <span>15% (Saudável Recomendada)</span>
            <span>30% (Alta Margem)</span>
          </div>
        </div>

        {/* Before vs After Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current State */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
            <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
              <span>Situação Atual</span>
              <span className="text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded text-[10px]">
                {currentFin.status === 'bleeding' ? 'Prejuízo' : 'Alerta'}
              </span>
            </div>

            <div>
              <div className="text-[11px] text-zinc-500">Preço de Venda</div>
              <div className="text-xl font-black text-zinc-200">{formatBRL(product.currentPrice)}</div>
            </div>

            <div className="space-y-1.5 border-t border-zinc-800/80 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Lucro Unitário:</span>
                <span className={currentFin.netProfitUnit < 0 ? 'text-red-400 font-bold' : 'text-zinc-200 font-medium'}>
                  {formatBRL(currentFin.netProfitUnit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Margem Real:</span>
                <span className={currentFin.marginPercent < 5 ? 'text-red-400 font-bold' : 'text-zinc-200 font-medium'}>
                  {formatPercent(currentFin.marginPercent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Resultado Mensal:</span>
                <span className={currentFin.monthlyProfit < 0 ? 'text-red-400 font-bold' : 'text-zinc-200 font-medium'}>
                  {formatBRL(currentFin.monthlyProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested State */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/15 p-4 space-y-3 shadow-lg shadow-emerald-500/5">
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Preço Corrigido
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                Saudável
              </span>
            </div>

            <div>
              <div className="text-[11px] text-zinc-400">Novo Preço Recomendado</div>
              <div className="text-xl font-black text-emerald-400">{formatBRL(effectivePrice)}</div>
            </div>

            <div className="space-y-1.5 border-t border-emerald-500/20 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-300">Lucro Unitário:</span>
                <span className="text-emerald-400 font-bold">
                  {formatBRL(simulatedFin.netProfitUnit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Margem Real:</span>
                <span className="text-emerald-400 font-bold">
                  {formatPercent(simulatedFin.marginPercent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Resultado Mensal:</span>
                <span className="text-emerald-400 font-extrabold">
                  {formatBRL(simulatedFin.monthlyProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Positive delta highlight */}
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center justify-between text-xs">
          <span className="text-zinc-300">
            Impacto no Caixa Mensal:
          </span>
          <span className="font-extrabold text-emerald-400 text-sm">
            +{formatBRL(monthlyProfitDiff)} adicionais / mês
          </span>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/simulator?cost=${product.costPrice}&category=${product.category}&modality=${product.modality}&logistics=${product.logistics}&weight=${product.weightGrams}&price=${effectivePrice}&targetMargin=${targetMargin}&sku=${product.sku}`}
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Abrir no Simulador Completo</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onApplyPrice(product.id, effectivePrice);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Aplicar Novo Preço ({formatBRL(effectivePrice)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
