'use client';

import React, { useState } from 'react';
import {
  Layers,
  Truck,
  Building,
  Receipt,
  PiggyBank,
} from 'lucide-react';
import { ProductItem } from '@/types';
import { calculateProductFinancials, formatBRL, formatPercent } from '@/lib/meli-calculator';

interface RevenueWaterfallProps {
  products: ProductItem[];
}

export function RevenueWaterfall({ products }: RevenueWaterfallProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Compute aggregated totals
  let grossRevenue = 0;
  let totalCmv = 0;
  let totalCommission = 0;
  let totalShipping = 0;
  let totalFixedAndStorage = 0;
  let totalTaxes = 0;
  let totalNetProfit = 0;

  products.forEach((p) => {
    const fin = calculateProductFinancials(p);
    const units = p.monthlyUnits;
    grossRevenue += fin.monthlyRevenue;
    totalCmv += p.costPrice * units;
    totalCommission += fin.commissionAmount * units;
    totalShipping += fin.shippingFee * units;
    totalFixedAndStorage += (fin.fixedFee + fin.storageFee + p.packagingCost) * units;
    totalTaxes += fin.taxAmount * units;
    totalNetProfit += fin.monthlyProfit;
  });

  const slices = [
    {
      id: 'cmv',
      label: 'Custo do Produto (CMV)',
      amount: totalCmv,
      percent: grossRevenue > 0 ? (totalCmv / grossRevenue) * 100 : 0,
      color: 'bg-zinc-600',
      badgeColor: 'text-zinc-300 border-zinc-700 bg-zinc-800',
      icon: Layers,
      description: 'Custo de aquisição ou fabricação unitária dos produtos vendidos.',
    },
    {
      id: 'commission',
      label: 'Comissão ML (11% a 19%)',
      amount: totalCommission,
      percent: grossRevenue > 0 ? (totalCommission / grossRevenue) * 100 : 0,
      color: 'bg-amber-500',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Building,
      description: 'Tarifa de venda por categoria nas modalidades Clássico e Premium.',
    },
    {
      id: 'shipping',
      label: 'Frete Mercado Envios / FULL',
      amount: totalShipping,
      percent: grossRevenue > 0 ? (totalShipping / grossRevenue) * 100 : 0,
      color: 'bg-orange-500',
      badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      icon: Truck,
      description: 'Frete grátis obrigatório (≥ R$ 79) pago pelo vendedor, com cubagem.',
    },
    {
      id: 'fixed_storage',
      label: 'Taxas Fixas + Embalagem + FULL',
      amount: totalFixedAndStorage,
      percent: grossRevenue > 0 ? (totalFixedAndStorage / grossRevenue) * 100 : 0,
      color: 'bg-indigo-500',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      icon: Receipt,
      description: 'R$ 6,50 em produtos < R$ 79 + embalagens bolha + armazenagem após 60 dias.',
    },
    {
      id: 'tax',
      label: 'Impostos (Simples Nacional)',
      amount: totalTaxes,
      percent: grossRevenue > 0 ? (totalTaxes / grossRevenue) * 100 : 0,
      color: 'bg-cyan-500',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      icon: Receipt,
      description: 'Alíquota média estimada de 6.5% no Anexo I do Simples Nacional.',
    },
    {
      id: 'profit',
      label: 'Lucro Líquido Real Limpo',
      amount: totalNetProfit,
      percent: grossRevenue > 0 ? (totalNetProfit / grossRevenue) * 100 : 0,
      color: 'bg-emerald-500',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: PiggyBank,
      description: 'Sobrou efetivamente no caixa da empresa após TODOS os descontos.',
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-zinc-100">
              Decomposição Visual do Faturamento (Waterfall de Margem)
            </h3>
            <span className="rounded-full bg-zinc-800 border border-zinc-700/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
              100% da Receita Bruta
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Acompanhe para onde vai cada centavo dos <strong>{formatBRL(grossRevenue)}</strong> faturados no mês.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Mordida Mercado Livre Total</span>
            <span className="text-xs font-bold text-amber-400">
              {formatBRL(totalCommission + totalShipping + totalFixedAndStorage)} ({formatPercent(((totalCommission + totalShipping + totalFixedAndStorage) / grossRevenue) * 100)})
            </span>
          </div>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="space-y-2">
        <div className="h-6 w-full rounded-xl overflow-hidden bg-zinc-950 flex p-0.5 border border-zinc-800 shadow-inner">
          {slices.map((slice) => {
            const isHovered = hoveredSlice === slice.id;
            return (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSlice(slice.id)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{ width: `${Math.max(2, slice.percent)}%` }}
                className={`h-full transition-all duration-200 cursor-pointer relative group ${slice.color} ${
                  hoveredSlice && !isHovered ? 'opacity-40' : 'opacity-100'
                } ${isHovered ? 'scale-y-110 z-10 brightness-110' : ''}`}
                title={`${slice.label}: ${formatBRL(slice.amount)} (${formatPercent(slice.percent)})`}
              />
            );
          })}
        </div>

        {/* Legend strip with interactive cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {slices.map((slice) => {
            const isHovered = hoveredSlice === slice.id;
            const Icon = slice.icon;
            return (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSlice(slice.id)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`rounded-xl p-3 border transition-all cursor-pointer ${
                  isHovered
                    ? 'border-amber-400/50 bg-zinc-800 shadow-lg'
                    : 'border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${slice.color}`} />
                  <span className="text-[11px] font-semibold text-zinc-300 truncate">
                    {slice.label.split(' ')[0]} {slice.label.split(' ')[1] || ''}
                  </span>
                </div>

                <div className="text-sm font-extrabold text-zinc-100">
                  {formatBRL(slice.amount)}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                  <span>{formatPercent(slice.percent)}</span>
                  <Icon className="h-3 w-3 text-zinc-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
