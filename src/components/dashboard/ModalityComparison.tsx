'use client';

import React from 'react';
import {
  Zap,
  Star,
  Box,
  Truck,
} from 'lucide-react';
import { ProductItem } from '@/types';
import { calculateProductFinancials, formatBRL, formatPercent } from '@/lib/meli-calculator';

interface ModalityComparisonProps {
  products: ProductItem[];
}

export function ModalityComparison({ products }: ModalityComparisonProps) {
  // Aggregate by modality
  let classicoRev = 0;
  let classicoProfit = 0;
  let classicoUnits = 0;

  let premiumRev = 0;
  let premiumProfit = 0;
  let premiumUnits = 0;

  // Aggregate by logistics
  let fullRev = 0;
  let fullProfit = 0;
  let fullUnits = 0;

  let normalRev = 0;
  let normalProfit = 0;
  let normalUnits = 0;

  products.forEach((p) => {
    const fin = calculateProductFinancials(p);
    if (p.modality === 'classico') {
      classicoRev += fin.monthlyRevenue;
      classicoProfit += fin.monthlyProfit;
      classicoUnits += p.monthlyUnits;
    } else {
      premiumRev += fin.monthlyRevenue;
      premiumProfit += fin.monthlyProfit;
      premiumUnits += p.monthlyUnits;
    }

    if (p.logistics === 'full') {
      fullRev += fin.monthlyRevenue;
      fullProfit += fin.monthlyProfit;
      fullUnits += p.monthlyUnits;
    } else {
      normalRev += fin.monthlyRevenue;
      normalProfit += fin.monthlyProfit;
      normalUnits += p.monthlyUnits;
    }
  });

  const totalRev = classicoRev + premiumRev;
  const classicoMargin = classicoRev > 0 ? (classicoProfit / classicoRev) * 100 : 0;
  const premiumMargin = premiumRev > 0 ? (premiumProfit / premiumRev) * 100 : 0;

  const fullMargin = fullRev > 0 ? (fullProfit / fullRev) * 100 : 0;
  const normalMargin = normalRev > 0 ? (normalProfit / normalRev) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Modalidades de Anúncio (Clássico vs Premium) */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100">Clássico vs Premium</h4>
              <p className="text-[11px] text-zinc-400">Rentabilidade por modalidade de exposição</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50">
            Comissão 11-14% vs 16-19%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Clássico */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">Clássico</span>
              <span className="text-[11px] text-zinc-400">
                {formatPercent((classicoRev / totalRev) * 100)} da receita
              </span>
            </div>
            <div className="text-lg font-black text-zinc-100">
              {formatBRL(classicoRev)}
            </div>
            <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Margem Real:</span>
              <span className="font-bold text-emerald-400">{formatPercent(classicoMargin)}</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {classicoUnits} vendas/mês • Sem juros no comprador
            </div>
          </div>

          {/* Premium */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Premium
              </span>
              <span className="text-[11px] text-amber-400/80 font-semibold">
                {formatPercent((premiumRev / totalRev) * 100)} da receita
              </span>
            </div>
            <div className="text-lg font-black text-amber-200">
              {formatBRL(premiumRev)}
            </div>
            <div className="border-t border-amber-500/20 pt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Margem Real:</span>
              <span className="font-bold text-emerald-400">{formatPercent(premiumMargin)}</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {premiumUnits} vendas/mês • Até 10-12x s/ juros
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>💡 Dica MeliMargin: Anúncios Premium convertem 2.4x mais no app, absorvendo a comissão maior se o ticket for superior a R$ 120.</span>
        </div>
      </div>

      {/* Card 2: Logística e Envios (FULL vs Normal/Coleta) */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Box className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100">Mercado Envios FULL vs Coleta</h4>
              <p className="text-[11px] text-zinc-400">Eficiência de frete e custos operacionais</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            FULL 78% Share
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* FULL */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <Box className="h-3 w-3 text-emerald-400" />
                Envios FULL
              </span>
              <span className="text-[11px] text-emerald-400/80 font-semibold">
                {formatPercent((fullRev / totalRev) * 100)} da receita
              </span>
            </div>
            <div className="text-lg font-black text-emerald-200">
              {formatBRL(fullRev)}
            </div>
            <div className="border-t border-emerald-500/20 pt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Margem Real:</span>
              <span className="font-bold text-emerald-400">{formatPercent(fullMargin)}</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {fullUnits} vendas/mês • Selo &quot;Chegará Amanhã&quot;
            </div>
          </div>

          {/* Coleta / Agência */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300 flex items-center gap-1">
                <Truck className="h-3 w-3 text-zinc-400" />
                Coleta / Normal
              </span>
              <span className="text-[11px] text-zinc-400">
                {formatPercent((normalRev / totalRev) * 100)} da receita
              </span>
            </div>
            <div className="text-lg font-black text-zinc-100">
              {formatBRL(normalRev)}
            </div>
            <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Margem Real:</span>
              <span className="font-bold text-emerald-400">{formatPercent(normalMargin)}</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {normalUnits} vendas/mês • Embalagem própria
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>📦 Alerta FULL: Monitore o giro de estoque para evitar a taxa diária de armazenagem cobrada a partir de 60 dias no armazém.</span>
        </div>
      </div>
    </div>
  );
}
