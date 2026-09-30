'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Truck,
  AlertTriangle,
  RotateCcw,
  Copy,
  ShieldCheck,
} from 'lucide-react';
import {
  CategoryKey,
  Modality,
  LogisticsType,
  PricingSimulationInput,
} from '@/types';
import {
  CATEGORIES,
  runPricingSimulation,
  calculateCubedWeight,
  getBillableWeightKg,
  formatBRL,
  formatPercent,
  FIXED_FEE_UNDER_79,
  FREE_SHIPPING_THRESHOLD,
} from '@/lib/meli-calculator';

interface PricingSimulatorProps {
  initialValues?: Partial<PricingSimulationInput>;
}

export function PricingSimulator({ initialValues }: PricingSimulatorProps) {
  const [costPrice, setCostPrice] = useState<number>(initialValues?.costPrice ?? 65.0);
  const [category, setCategory] = useState<CategoryKey>(initialValues?.category ?? 'eletronicos');
  const [modality, setModality] = useState<Modality>(initialValues?.modality ?? 'premium');
  const [logistics, setLogistics] = useState<LogisticsType>(initialValues?.logistics ?? 'full');
  const [calculationMode, setCalculationMode] = useState<'target_margin' | 'target_price'>(
    initialValues?.calculationMode ?? 'target_margin'
  );
  const [salePrice, setSalePrice] = useState<number>(initialValues?.salePrice ?? 149.9);
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(
    initialValues?.targetMarginPercent ?? 16.0
  );
  const [taxRatePercent, setTaxRatePercent] = useState<number>(
    initialValues?.taxRatePercent ?? 6.5
  );
  const [packagingCost, setPackagingCost] = useState<number>(
    initialValues?.packagingCost ?? 2.5
  );
  const [weightGrams, setWeightGrams] = useState<number>(initialValues?.weightGrams ?? 450);
  const [dimensions, setDimensions] = useState({
    length: initialValues?.dimensionsCm?.length ?? 20,
    width: initialValues?.dimensionsCm?.width ?? 15,
    height: initialValues?.dimensionsCm?.height ?? 8,
  });
  const [storageDaysFull, setStorageDaysFull] = useState<number>(
    initialValues?.storageDaysFull ?? 20
  );
  const [reputationDiscount, setReputationDiscount] = useState<number>(0.5); // 50% discount MercadoLíder
  const [copied, setCopied] = useState(false);

  // Compute live simulation
  const simulationInput: PricingSimulationInput = {
    costPrice,
    category,
    modality,
    logistics,
    salePrice,
    targetMarginPercent,
    calculationMode,
    taxRatePercent,
    packagingCost,
    weightGrams,
    dimensionsCm: dimensions,
    storageDaysFull,
    sellerReputationDiscount: reputationDiscount,
  };

  const result = runPricingSimulation(simulationInput);

  // Cubagem calculations
  const cubedWeightKg = calculateCubedWeight(dimensions.length, dimensions.width, dimensions.height);
  const billableWeightKg = getBillableWeightKg(weightGrams, dimensions);
  const isCubageHigher = cubedWeightKg > weightGrams / 1000;

  const handleCopySummary = () => {
    const summaryText = `📊 Simulação MeliMargin
Produto Categoria: ${CATEGORIES[category].name}
Preço Venda: ${formatBRL(result.salePriceUsed)}
Custo Unitário: ${formatBRL(costPrice)}
Comissão ML (${result.commissionPercent}%): ${formatBRL(result.commissionAmount)}
Frete Mercado Envios: ${formatBRL(result.shippingFee)}
Taxa Fixa (< R$ 79): ${formatBRL(result.fixedFee)}
Imposto Simples (${taxRatePercent}%): ${formatBRL(result.taxAmount)}
Lucro Líquido Real: ${formatBRL(result.netProfit)}
Margem Real: ${result.marginPercent}%`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCostPrice(65.0);
    setCategory('eletronicos');
    setModality('premium');
    setLogistics('full');
    setCalculationMode('target_margin');
    setTargetMarginPercent(16.0);
    setTaxRatePercent(6.5);
    setPackagingCost(2.5);
    setWeightGrams(450);
    setDimensions({ length: 20, width: 15, height: 8 });
    setStorageDaysFull(20);
    setReputationDiscount(0.5);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input Form (7 cols on desktop) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Mode Switcher */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Modo de Cálculo
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Restaurar Padrões</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            <button
              type="button"
              onClick={() => setCalculationMode('target_margin')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                calculationMode === 'target_margin'
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fixar Margem Alvo (%)</span>
            </button>

            <button
              type="button"
              onClick={() => setCalculationMode('target_price')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                calculationMode === 'target_price'
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Fixar Preço de Venda (R$)</span>
            </button>
          </div>
        </div>

        {/* Financial Core Inputs */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-5">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 text-xs">1</span>
            Custos Unitários & Alvo Financeiro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cost Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Preço de Custo (CMV)</span>
                <span className="text-[11px] text-zinc-500">Nota Fiscal / Compra</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm font-bold text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Target Margin OR Target Sale Price */}
            {calculationMode === 'target_margin' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span>Margem Líquida Alvo</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">Recomendado ≥ 15%</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">%</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    value={targetMarginPercent}
                    onChange={(e) => setTargetMarginPercent(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span>Preço de Venda a Simular</span>
                  <span className="text-[11px] text-amber-400 font-semibold">Anúncio ML</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">R$</span>
                  <input
                    type="number"
                    step="0.10"
                    min="1"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Imposto Simples Nacional */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Alíquota de Imposto (Simples)</span>
                <span className="text-[11px] text-zinc-500">Anexo I</span>
              </label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">%</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Embalagem & Insumos */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Custo de Embalagem / Insumos</span>
                <span className="text-[11px] text-zinc-500">Caixa, bolha, fita</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">R$</span>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm font-bold text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mercado Livre Configuration: Category, Modality & Logistics */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-5">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 text-xs">2</span>
            Regras de Tarifação Mercado Livre
          </h3>

          <div className="space-y-4">
            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Categoria do Produto
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-400"
              >
                {Object.values(CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (Clássico {cat.classicoRate * 100}% | Premium {cat.premiumRate * 100}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Modalidade */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Modalidade de Anúncio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModality('classico')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    modality === 'classico'
                      ? 'border-amber-400 bg-amber-400/10 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Clássico</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      {CATEGORIES[category].classicoRate * 100}%
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Sem parcelamento s/ juros embutido
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModality('premium')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    modality === 'premium'
                      ? 'border-amber-400 bg-amber-400/10 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400">Premium</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      {CATEGORIES[category].premiumRate * 100}%
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Até 10-12x sem juros (maior conversão)
                  </div>
                </button>
              </div>
            </div>

            {/* Logística */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Modalidade Logística
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'full', label: 'Envios FULL', desc: 'Armazém ML' },
                  { id: 'coleta', label: 'Coleta / Agência', desc: 'Próprio' },
                  { id: 'flex', label: 'Envios Flex', desc: 'Entrega rápida' },
                ].map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setLogistics(log.id as LogisticsType)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      logistics === log.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{log.label}</div>
                    <div className="text-[10px] text-zinc-500">{log.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desconto Reputação MercadoLíder */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-zinc-300 font-medium">Desconto Frete MercadoLíder:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReputationDiscount(0.5)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    reputationDiscount === 0.5
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  50% (Platinum/Gold)
                </button>
                <button
                  type="button"
                  onClick={() => setReputationDiscount(0.0)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    reputationDiscount === 0
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  0% (Sem Reputação)
                </button>
              </div>
            </div>

            {/* FULL Storage Days (if full selected) */}
            {logistics === 'full' && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Dias Médios no FULL (Giro de Estoque):</span>
                  <span className="font-mono font-bold text-zinc-200">{storageDaysFull} dias</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={storageDaysFull}
                  onChange={(e) => setStorageDaysFull(parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span className="text-emerald-400">Até 60 dias (Grátis)</span>
                  <span className="text-amber-400">61-120 dias (R$ 0,08/dia)</span>
                  <span className="text-red-400">&gt; 120 dias (R$ 0,18/dia)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Peso & Cubagem Volumétrica */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 text-xs">3</span>
              Peso Real & Cubagem Volumétrica
            </h3>
            {isCubageHigher && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                <AlertTriangle className="h-3 w-3" />
                Cobrado por Cubagem
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Peso Físico (g)</label>
              <input
                type="number"
                min="50"
                step="50"
                value={weightGrams}
                onChange={(e) => setWeightGrams(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Comprimento (cm)</label>
              <input
                type="number"
                min="1"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 1 })}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Largura (cm)</label>
              <input
                type="number"
                min="1"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 1 })}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Altura (cm)</label>
              <input
                type="number"
                min="1"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 1 })}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-100"
              />
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-zinc-400">Peso Físico: <strong>{(weightGrams / 1000).toFixed(2)} kg</strong></span>
              <span className="text-zinc-500 mx-2">•</span>
              <span className="text-zinc-400">Peso Cubado (C×L×A / 6000): <strong>{cubedWeightKg.toFixed(2)} kg</strong></span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block">Peso Faturável</span>
              <span className="font-extrabold text-amber-400">{billableWeightKg.toFixed(2)} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Results Card & Visual Stack (5 cols on desktop) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Main Recommendation Result Card */}
        <div className={`rounded-2xl border p-6 backdrop-blur-xl transition-all shadow-2xl ${
          result.status === 'healthy'
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-zinc-900/90 to-zinc-950 shadow-emerald-500/10'
            : result.status === 'warning'
            ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/30 via-zinc-900/90 to-zinc-950 shadow-amber-500/10'
            : 'border-red-500/40 bg-gradient-to-b from-red-950/30 via-zinc-900/90 to-zinc-950 shadow-red-500/10'
        }`}>
          {/* Status Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`flex h-2.5 w-2.5 rounded-full ${
                result.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : result.status === 'warning' ? 'bg-amber-400' : 'bg-red-400 animate-ping'
              }`} />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {result.status === 'healthy' ? 'Margem Saudável' : result.status === 'warning' ? 'Margem sob Atenção' : 'Operação com Sangria'}
              </span>
            </div>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
              title="Copiar Resumo"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Recommended Price Display */}
          <div className="space-y-1 mb-6">
            <span className="text-xs text-zinc-400">
              {calculationMode === 'target_margin' ? 'Preço de Venda Recomendado' : 'Preço de Venda Avaliado'}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-100">
                {formatBRL(result.salePriceUsed)}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                (Markup: {result.markupPercent}%)
              </span>
            </div>
            {result.salePriceUsed < FREE_SHIPPING_THRESHOLD ? (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 mt-1">
                <span>⚠️ Preço &lt; R$ 79:</span>
                <span className="text-amber-400 font-bold">Taxa fixa ML R$ {FIXED_FEE_UNDER_79.toFixed(2)}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-400 mt-1">
                <Truck className="h-3 w-3" />
                <span>Frete Grátis Obrigatório (Vendedor): <strong>{formatBRL(result.shippingFee)}</strong></span>
              </div>
            )}
          </div>

          {/* Unit Profit and Real Net Margin Metrics */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-6">
            <div>
              <span className="text-[11px] text-zinc-500 block">Lucro Líquido Real</span>
              <span className={`text-xl font-black ${result.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatBRL(result.netProfit)}
              </span>
              <span className="text-[10px] text-zinc-500 block">por unidade vendida</span>
            </div>

            <div className="border-l border-zinc-800 pl-3">
              <span className="text-[11px] text-zinc-500 block">Margem Líquida %</span>
              <span className={`text-xl font-black ${result.marginPercent >= 15 ? 'text-emerald-400' : result.marginPercent >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                {formatPercent(result.marginPercent)}
              </span>
              <span className="text-[10px] text-zinc-500 block">do faturamento</span>
            </div>
          </div>

          {/* Stack Bar Visual Decomposition */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">Decomposição do Preço</span>
              <span className="text-[11px] text-zinc-500">100% da Venda</span>
            </div>

            <div className="h-4 w-full rounded-lg overflow-hidden bg-zinc-950 flex border border-zinc-800">
              <div
                style={{ width: `${Math.max(1, result.breakdown.costPercent)}%` }}
                className="h-full bg-zinc-600"
                title={`Custo: ${result.breakdown.costPercent}%`}
              />
              <div
                style={{ width: `${Math.max(1, result.breakdown.commissionPercent)}%` }}
                className="h-full bg-amber-500"
                title={`Comissão: ${result.breakdown.commissionPercent}%`}
              />
              <div
                style={{ width: `${Math.max(1, result.breakdown.shippingPercent)}%` }}
                className="h-full bg-orange-500"
                title={`Frete: ${result.breakdown.shippingPercent}%`}
              />
              <div
                style={{ width: `${Math.max(1, result.breakdown.taxPercent)}%` }}
                className="h-full bg-cyan-500"
                title={`Imposto: ${result.breakdown.taxPercent}%`}
              />
              {result.breakdown.profitPercent > 0 && (
                <div
                  style={{ width: `${Math.max(1, result.breakdown.profitPercent)}%` }}
                  className="h-full bg-emerald-500"
                  title={`Lucro: ${result.breakdown.profitPercent}%`}
                />
              )}
            </div>

            {/* Detailed Row Items */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  Custo Mercadoria (CMV)
                </span>
                <span className="font-semibold text-zinc-200">{formatBRL(costPrice)} ({result.breakdown.costPercent}%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Comissão ML ({result.commissionPercent}%)
                </span>
                <span className="font-semibold text-zinc-200">{formatBRL(result.commissionAmount)}</span>
              </div>

              {result.fixedFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-600" />
                    Taxa Fixa ML (&lt; R$ 79)
                  </span>
                  <span className="font-semibold text-zinc-200">{formatBRL(result.fixedFee)}</span>
                </div>
              )}

              {result.shippingFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    Frete Mercado Envios (50% Desc.)
                  </span>
                  <span className="font-semibold text-zinc-200">{formatBRL(result.shippingFee)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  Impostos Simples ({taxRatePercent}%)
                </span>
                <span className="font-semibold text-zinc-200">{formatBRL(result.taxAmount)}</span>
              </div>

              {result.storageFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Armazenagem FULL ({storageDaysFull}d)
                  </span>
                  <span className="font-semibold text-zinc-200">{formatBRL(result.storageFee)}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-zinc-800 pt-2 font-bold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Lucro Líquido Limpo
                </span>
                <span className="text-emerald-400">{formatBRL(result.netProfit)} ({result.breakdown.profitPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Sensitivity Table */}
          <div className="border-t border-zinc-800/80 pt-4 space-y-2">
            <span className="text-xs font-bold text-zinc-300 block">
              Sensibilidade de Preço & Elasticidade
            </span>
            <div className="space-y-1.5">
              {result.sensitivity.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                    s.diffPercent === 0
                      ? 'bg-zinc-800 border border-amber-400/40 text-amber-300 font-bold'
                      : 'bg-zinc-950/60 text-zinc-400 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="truncate w-32">{s.label}</span>
                  <span className="font-mono text-zinc-200">{formatBRL(s.price)}</span>
                  <span className={s.netProfit >= 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {formatBRL(s.netProfit)}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">{formatPercent(s.marginPercent)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
