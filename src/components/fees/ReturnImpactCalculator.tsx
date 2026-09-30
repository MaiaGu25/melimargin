'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Truck,
  PackageX,
} from 'lucide-react';
import { ReturnImpactInputs } from '@/types';
import { calculateReturnImpact, formatBRL } from '@/lib/meli-calculator';

export function ReturnImpactCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(184500);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(1283);
  const [returnRatePercent, setReturnRatePercent] = useState<number>(4.2);
  const [reverseShippingCostAverage, setReverseShippingCostAverage] = useState<number>(24.50);
  const [damagedGoodsRatePercent, setDamagedGoodsRatePercent] = useState<number>(18.0);
  const [averageProductCost, setAverageProductCost] = useState<number>(68.00);

  const inputs: ReturnImpactInputs = {
    monthlyRevenue,
    monthlyUnits,
    averageTicket: monthlyUnits > 0 ? monthlyRevenue / monthlyUnits : 0,
    returnRatePercent,
    reverseShippingCostAverage,
    damagedGoodsRatePercent,
    averageProductCost,
  };

  const results = calculateReturnImpact(inputs);

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <RotateCcw className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">
              Calculadora de Impacto de Devoluções & Frete Reverso
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Descubra quanto dinheiro sua conta perde silenciosamente com devoluções, fretes reversos e itens danificados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400">
            Perda Mensal: -{formatBRL(results.totalReturnLossMonthly)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Sliders and fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Faturamento Mensal da Loja
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">R$</span>
                <input
                  type="number"
                  step="1000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Volume de Unidades Vendidas
              </label>
              <input
                type="number"
                step="10"
                value={monthlyUnits}
                onChange={(e) => setMonthlyUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Interactive Return Rate Slider */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">
                Taxa Média de Devoluções (%):
              </span>
              <span className={`font-mono font-bold text-sm ${returnRatePercent > 5 ? 'text-red-400' : 'text-amber-400'}`}>
                {returnRatePercent.toFixed(1)}% ({results.returnedUnitsMonthly} unidades devolvidas/mês)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.1"
              value={returnRatePercent}
              onChange={(e) => setReturnRatePercent(parseFloat(e.target.value) || 0)}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-400"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>1% (Eletrônicos Simples)</span>
              <span>4.5% (Média Geral Mercado Livre)</span>
              <span>10%+ (Moda & Calçados)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Frete Reverso Médio por Devolução
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">R$</span>
                <input
                  type="number"
                  step="0.50"
                  value={reverseShippingCostAverage}
                  onChange={(e) => setReverseShippingCostAverage(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Custo Médio Unitário de Produto (CMV)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">R$</span>
                <input
                  type="number"
                  step="1.00"
                  value={averageProductCost}
                  onChange={(e) => setAverageProductCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Damaged Goods Percentage */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">
                Taxa de Avaria / Perda Total dos Devolvidos (%):
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {damagedGoodsRatePercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={damagedGoodsRatePercent}
              onChange={(e) => setDamagedGoodsRatePercent(parseInt(e.target.value) || 0)}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-[10px] text-zinc-400">
              Percentual de produtos que voltam violados, com embalagem destruída ou peças faltantes e não podem ser revendidos como novos.
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-red-500/30 bg-gradient-to-b from-red-950/20 via-zinc-950 to-zinc-950 p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Impacto Financeiro Apurado
              </span>
              <div className="text-3xl font-black text-red-400">
                -{formatBRL(results.totalReturnLossMonthly)}
              </div>
              <span className="text-xs text-zinc-400 block">
                Perda mensal acumulada com devoluções
              </span>
            </div>

            <div className="space-y-2.5 border-t border-zinc-800 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-zinc-500" />
                  Custo com Frete Reverso:
                </span>
                <span className="font-bold text-zinc-200">
                  {formatBRL(results.reverseShippingTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <PackageX className="h-3.5 w-3.5 text-zinc-500" />
                  Perda em Produtos Inutilizados:
                </span>
                <span className="font-bold text-zinc-200">
                  {formatBRL(results.damagedGoodsLossTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-2 font-semibold">
                <span className="text-zinc-300">Corrosão da Margem Líquida:</span>
                <span className="text-red-400 font-bold">
                  -{results.impactOnMarginPoints.toFixed(1)}% na margem
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Projeção Anualizada:</span>
                <span className="text-red-400 font-extrabold">
                  -{formatBRL(results.annualizedLoss)} / ano
                </span>
              </div>
            </div>

            {/* Break-even warning */}
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Ponto Crítico de Quebra (Break-even):</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Se a taxa de devolução da sua loja atingir <strong className="text-zinc-200">{results.breakEvenReturnRateThreshold}%</strong>, todo o lucro líquido da operação será consumido pelas perdas logísticas e avarias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
