'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { ProductItem } from '@/types';
import { calculateProductFinancials, formatBRL } from '@/lib/meli-calculator';

interface BleedingSkusCardProps {
  products: ProductItem[];
  onOpenFixModal?: (product: ProductItem) => void;
}

export function BleedingSkusCard({ products, onOpenFixModal }: BleedingSkusCardProps) {
  const bleedingList = products
    .filter((p) => calculateProductFinancials(p).status === 'bleeding')
    .slice(0, 3);

  if (bleedingList.length === 0) return null;

  return (
    <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-950/20 via-zinc-900/60 to-zinc-950 p-6 backdrop-blur-md space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              Auditoria Prioritária: SKUs em Sangria Ativa
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                Ação Imediata
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Produtos que estão gerando prejuízo real a cada venda realizada.
            </p>
          </div>
        </div>

        <Link
          href="/products?status=bleeding"
          className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
        >
          <span>Ver todos os produtos</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bleedingList.map((product) => {
          const fin = calculateProductFinancials(product);
          return (
            <div
              key={product.id}
              className="rounded-xl border border-red-500/20 bg-zinc-950/80 p-4 space-y-3 flex flex-col justify-between hover:border-red-500/40 transition-colors shadow-lg shadow-red-950/20"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    {product.sku}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {product.monthlyUnits} un/mês
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-zinc-200 line-clamp-2">
                  {product.title}
                </h4>

                <div className="rounded-lg bg-red-950/30 border border-red-500/20 p-2 text-[11px] text-red-300/90 leading-relaxed">
                  {product.alertReason || 'Margem negativa decorrente de frete ou cubagem excessiva.'}
                </div>
              </div>

              <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Preço Atual:</span>
                  <span className="font-bold text-zinc-200">{formatBRL(product.currentPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Prejuízo Mensal:</span>
                  <span className="font-extrabold text-red-400">{formatBRL(fin.monthlyProfit)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Preço Ideal (Margem 15%):</span>
                  <span className="font-bold text-emerald-400">{formatBRL(fin.suggestedHealthyPrice)}</span>
                </div>

                <div className="pt-1 flex gap-2">
                  <Link
                    href={`/simulator?cost=${product.costPrice}&category=${product.category}&modality=${product.modality}&logistics=${product.logistics}&weight=${product.weightGrams}&price=${product.currentPrice}&sku=${product.sku}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-amber-400/50 text-[11px] font-bold text-zinc-200 hover:text-amber-400 transition-all"
                  >
                    <Wrench className="h-3 w-3" />
                    <span>Simular Preço</span>
                  </Link>
                  {onOpenFixModal && (
                    <button
                      onClick={() => onOpenFixModal(product)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 transition-all"
                      title="Corrigir Preço Imediatamente"
                    >
                      Corrigir
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
