'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Receipt,
  Sparkles,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';
import { INITIAL_PRODUCTS, computeKpiSummary } from '@/data/mock-meli';
import { formatBRL, formatPercent } from '@/lib/meli-calculator';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { CriticalAlertBanner } from '@/components/dashboard/CriticalAlertBanner';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { RevenueWaterfall } from '@/components/dashboard/RevenueWaterfall';
import { ModalityComparison } from '@/components/dashboard/ModalityComparison';
import { BleedingSkusCard } from '@/components/dashboard/BleedingSkusCard';
import { PriceFixModal } from '@/components/products/PriceFixModal';
import { ProductItem } from '@/types';

export default function ExecutiveOverviewPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [selectedProductForFix, setSelectedProductForFix] = useState<ProductItem | null>(null);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);

  const kpis = computeKpiSummary(products);

  const handleApplyPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            currentPrice: newPrice,
            alertReason: undefined,
          };
        }
        return p;
      })
    );
  };

  const handleOpenFixModal = (product: ProductItem) => {
    setSelectedProductForFix(product);
    setIsFixModalOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header with Store Identity & Reputation */}
      <StoreHeader />

      {/* 2. Critical Alert Banner for the 3 Bleeding SKUs */}
      <CriticalAlertBanner
        products={products}
        onQuickFix={handleOpenFixModal}
      />

      {/* 3. Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Bruto Mensal */}
        <KpiCard
          title="Faturamento Bruto Mensal"
          value={formatBRL(kpis.grossMonthlyRevenue)}
          subtitle={`${kpis.totalUnitsSold.toLocaleString('pt-BR')} unidades vendidas`}
          trend={{
            value: '+6.4%',
            isPositive: true,
            label: 'vs mês anterior',
          }}
          icon={DollarSign}
          helpText="Total faturado no período antes de comissões, fretes, impostos e custos."
        />

        {/* KPI 2: Lucro Líquido Real */}
        <KpiCard
          title="Lucro Líquido Real"
          value={formatBRL(kpis.realNetProfit)}
          badge={`${formatPercent(kpis.realNetMarginPercent)} margem real`}
          subtitle={`Ticket Médio: ${formatBRL(kpis.averageTicket)}`}
          trend={{
            value: '+9.8%',
            isPositive: true,
            label: 'vs mês anterior',
          }}
          icon={TrendingUp}
          variant="profit"
          helpText="Lucro líquido efetivamente apurado após dedução de CMV, taxas ML, frete Mercado Envios e impostos."
        />

        {/* KPI 3: Mordida de Tarifas */}
        <KpiCard
          title="Mordida de Tarifas ML"
          value={formatBRL(kpis.meliFeesTake)}
          badge={`${formatPercent(kpis.meliFeesTakePercent)} do total`}
          subtitle={`Fretes pagos: ${formatBRL(kpis.totalShippingPaid)}`}
          trend={{
            value: '+1.8%',
            isPositive: false,
            label: 'pressão de frete',
          }}
          icon={Percent}
          variant="warning"
          helpText="Soma de comissões de venda (11-19%), fretes obrigatórios Mercado Envios e taxas fixas de R$ 6,50."
        />

        {/* KPI 4: Impostos Estimados */}
        <KpiCard
          title="Impostos Estimados"
          value={formatBRL(kpis.estimatedTaxes)}
          badge={`${kpis.taxPercent.toFixed(1)}% Simples`}
          subtitle="Anexo I - Comércio"
          trend={{
            value: 'Estável',
            isPositive: true,
            label: 'conforme faixa',
          }}
          icon={Receipt}
          helpText="Estimativa mensal de recolhimento no DAS (Simples Nacional) sobre o faturamento de vendas."
        />
      </div>

      {/* 4. Revenue Waterfall Visual Decomposition */}
      <RevenueWaterfall products={products} />

      {/* 5. Bleeding SKUs Priority Card */}
      <BleedingSkusCard
        products={products}
        onOpenFixModal={handleOpenFixModal}
      />

      {/* 6. Modality & Logistics Performance (Clássico vs Premium, FULL vs Coleta) */}
      <ModalityComparison products={products} />

      {/* 7. Quick Navigation Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Link
          href="/simulator"
          className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md hover:border-amber-400/50 transition-all flex items-center justify-between shadow-lg"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">Simulador Interativo de Preço</span>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-xs text-zinc-400">
              Calcule o preço de venda ideal para atingir sua margem alvo considerando cubagem, frete Mercado Envios e comissões.
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all border border-zinc-800">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/products"
          className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md hover:border-emerald-500/50 transition-all flex items-center justify-between shadow-lg"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">Auditoria Geral de SKUs</span>
              <PackageCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-xs text-zinc-400">
              Acesse a tabela completa com filtros de status (Lucrativo, Atenção, Sangria) e ferramenta de correção rápida.
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all border border-zinc-800">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* Modal for Quick Price Fix */}
      <PriceFixModal
        product={selectedProductForFix}
        isOpen={isFixModalOpen}
        onClose={() => {
          setIsFixModalOpen(false);
          setSelectedProductForFix(null);
        }}
        onApplyPrice={handleApplyPrice}
      />
    </main>
  );
}
