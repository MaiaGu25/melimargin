'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Box,
  Star,
  Wrench,
  Download,
} from 'lucide-react';
import { ProductItem, ProductStatus, Modality, LogisticsType, CategoryKey } from '@/types';
import {
  calculateProductFinancials,
  CATEGORIES,
  formatBRL,
  formatPercent,
} from '@/lib/meli-calculator';
import { PriceFixModal } from './PriceFixModal';

interface ProductTableProps {
  initialProducts: ProductItem[];
  defaultStatusFilter?: ProductStatus | 'all';
}

export function ProductTable({
  initialProducts,
  defaultStatusFilter = 'all',
}: ProductTableProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>(defaultStatusFilter);
  const [modalityFilter, setModalityFilter] = useState<Modality | 'all'>('all');
  const [logisticsFilter, setLogisticsFilter] = useState<LogisticsType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | 'all'>('all');
  const [sortField, setSortField] = useState<'margin' | 'profit' | 'units' | 'price' | 'revenue'>('margin');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [selectedProductForFix, setSelectedProductForFix] = useState<ProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute financials for all products
  const productFinancialsList = useMemo(() => {
    return products.map((p) => calculateProductFinancials(p));
  }, [products]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    return productFinancialsList
      .filter((fin) => {
        const p = fin.product;
        // Search query
        if (
          searchQuery &&
          !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && fin.status !== statusFilter) {
          return false;
        }

        // Modality filter
        if (modalityFilter !== 'all' && p.modality !== modalityFilter) {
          return false;
        }

        // Logistics filter
        if (logisticsFilter !== 'all' && p.logistics !== logisticsFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && p.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        switch (sortField) {
          case 'margin':
            valA = a.marginPercent;
            valB = b.marginPercent;
            break;
          case 'profit':
            valA = a.monthlyProfit;
            valB = b.monthlyProfit;
            break;
          case 'units':
            valA = a.product.monthlyUnits;
            valB = b.product.monthlyUnits;
            break;
          case 'price':
            valA = a.product.currentPrice;
            valB = b.product.currentPrice;
            break;
          case 'revenue':
            valA = a.monthlyRevenue;
            valB = b.monthlyRevenue;
            break;
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [
    productFinancialsList,
    searchQuery,
    statusFilter,
    modalityFilter,
    logisticsFilter,
    categoryFilter,
    sortField,
    sortOrder,
  ]);

  // Handle price update from modal
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

    setToastMessage(`Preço do SKU atualizado para ${formatBRL(newPrice)} com sucesso! Margem normalizada.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenFix = (product: ProductItem) => {
    setSelectedProductForFix(product);
    setIsModalOpen(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Título', 'Categoria', 'Modalidade', 'Logística', 'Preço Venda', 'CMV', 'Taxas ML', 'Lucro Unitário', 'Margem %', 'Vendas/Mês', 'Resultado Mensal', 'Status'];
    const rows = filteredAndSorted.map((fin) => [
      fin.product.sku,
      `"${fin.product.title.replace(/"/g, '""')}"`,
      CATEGORIES[fin.product.category].name,
      fin.product.modality,
      fin.product.logistics,
      fin.product.currentPrice.toFixed(2),
      fin.product.costPrice.toFixed(2),
      fin.totalMeliFees.toFixed(2),
      fin.netProfitUnit.toFixed(2),
      fin.marginPercent.toFixed(1),
      fin.product.monthlyUnits,
      fin.monthlyProfit.toFixed(2),
      fin.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `melimargin_skus_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated banner counters
  const totalAudited = filteredAndSorted.length;
  const totalRevenue = filteredAndSorted.reduce((acc, f) => acc + f.monthlyRevenue, 0);
  const totalProfit = filteredAndSorted.reduce((acc, f) => acc + f.monthlyProfit, 0);
  const bleedingCount = filteredAndSorted.filter((f) => f.status === 'bleeding').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-zinc-900 p-4 text-xs font-semibold text-emerald-300 shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Mini Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-md">
          <span className="text-[11px] text-zinc-400 font-medium">SKUs Filtrados</span>
          <div className="text-xl font-extrabold text-zinc-100">{totalAudited} produtos</div>
          <span className="text-[10px] text-zinc-500">de {products.length} no catálogo</span>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-md">
          <span className="text-[11px] text-zinc-400 font-medium">Receita do Filtro</span>
          <div className="text-xl font-extrabold text-zinc-100">{formatBRL(totalRevenue)}</div>
          <span className="text-[10px] text-zinc-500">faturamento mensal</span>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-md">
          <span className="text-[11px] text-zinc-400 font-medium">Lucro Líquido Real</span>
          <div className={`text-xl font-extrabold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatBRL(totalProfit)}
          </div>
          <span className="text-[10px] text-zinc-500">
            {totalRevenue > 0 ? formatPercent((totalProfit / totalRevenue) * 100) : '0%'} margem média
          </span>
        </div>

        <div className={`rounded-xl border p-4 backdrop-blur-md ${
          bleedingCount > 0 ? 'border-red-500/40 bg-red-950/20' : 'border-zinc-800 bg-zinc-900/60'
        }`}>
          <span className="text-[11px] text-zinc-400 font-medium">Sangria Detectada</span>
          <div className={`text-xl font-extrabold ${bleedingCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {bleedingCount} SKUs em prejuízo
          </div>
          <span className="text-[10px] text-zinc-400">
            {bleedingCount > 0 ? 'Exigem reajuste urgente' : 'Nenhuma perda ativa'}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por SKU ou título do produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/60">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-zinc-100 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setStatusFilter('healthy')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'healthy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Lucrativos</span>
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-amber-400'
              }`}
            >
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span>Margem Baixa</span>
            </button>
            <button
              onClick={() => setStatusFilter('bleeding')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'bleeding'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                  : 'text-zinc-400 hover:text-red-400'
              }`}
            >
              <AlertOctagon className="h-3 w-3 text-red-400" />
              <span>Prejuízo / Sangria</span>
            </button>
          </div>

          {/* Modality Filter */}
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value as Modality | 'all')}
            className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas Modalidades</option>
            <option value="classico">Apenas Clássico</option>
            <option value="premium">Apenas Premium</option>
          </select>

          {/* Logistics Filter */}
          <select
            value={logisticsFilter}
            onChange={(e) => setLogisticsFilter(e.target.value as LogisticsType | 'all')}
            className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Toda Logística</option>
            <option value="full">Mercado Envios FULL</option>
            <option value="coleta">Coleta / Agência</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryKey | 'all')}
            className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Categorias</option>
            {Object.values(CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main SKU Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">SKU / Produto</th>
                <th className="py-3.5 px-3">
                  <button
                    onClick={() => {
                      if (sortField === 'price') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortField('price'); setSortOrder('asc'); }
                    }}
                    className="flex items-center gap-1 hover:text-zinc-200"
                  >
                    <span>Preço Atual</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">
                  <button
                    onClick={() => {
                      if (sortField === 'units') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortField('units'); setSortOrder('desc'); }
                    }}
                    className="flex items-center gap-1 hover:text-zinc-200"
                  >
                    <span>Vendas/mês</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">Custo (CMV)</th>
                <th className="py-3.5 px-3">Taxas ML Totais</th>
                <th className="py-3.5 px-3">
                  <button
                    onClick={() => {
                      if (sortField === 'margin') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortField('margin'); setSortOrder('asc'); }
                    }}
                    className="flex items-center gap-1 hover:text-zinc-200"
                  >
                    <span>Lucro Unitário / Margem</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">
                  <button
                    onClick={() => {
                      if (sortField === 'profit') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortField('profit'); setSortOrder('asc'); }
                    }}
                    className="flex items-center gap-1 hover:text-zinc-200"
                  >
                    <span>Resultado Mensal</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Ação Rápida</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((fin) => {
                  const p = fin.product;
                  const isBleeding = fin.status === 'bleeding';
                  const isWarning = fin.status === 'warning';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-zinc-800/40 transition-colors ${
                        isBleeding ? 'bg-red-950/10' : ''
                      }`}
                    >
                      {/* SKU & Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded text-[10px] border border-amber-500/20">
                              {p.sku}
                            </span>

                            {p.modality === 'premium' ? (
                              <span className="inline-flex items-center gap-0.5 rounded bg-amber-400/10 px-1.5 py-0.2 text-[10px] font-semibold text-amber-300">
                                <Star className="h-2.5 w-2.5 fill-amber-400" />
                                Premium
                              </span>
                            ) : (
                              <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-400">
                                Clássico
                              </span>
                            )}

                            {p.logistics === 'full' ? (
                              <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400">
                                <Box className="h-2.5 w-2.5" />
                                FULL
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-400">
                                Coleta
                              </span>
                            )}
                          </div>

                          <div className="font-medium text-zinc-200 line-clamp-1" title={p.title}>
                            {p.title}
                          </div>

                          <div className="text-[10px] text-zinc-400">
                            {CATEGORIES[p.category].name} • {(p.weightGrams / 1000).toFixed(2)}kg
                          </div>

                          {p.alertReason && (
                            <div className="text-[10px] text-red-300 font-medium line-clamp-1 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20">
                              ⚠️ {p.alertReason}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Preço de Venda */}
                      <td className="py-3.5 px-3 font-bold text-zinc-100">
                        {formatBRL(p.currentPrice)}
                      </td>

                      {/* Vendas/Mês */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-zinc-200">{p.monthlyUnits} un</div>
                        <div className="text-[10px] text-zinc-400">{formatBRL(fin.monthlyRevenue)}</div>
                      </td>

                      {/* CMV */}
                      <td className="py-3.5 px-3 text-zinc-300 font-medium">
                        {formatBRL(p.costPrice)}
                      </td>

                      {/* Taxas ML */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-zinc-300">
                          {formatBRL(fin.totalMeliFees)}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Comissão {formatBRL(fin.commissionAmount)}
                          {fin.shippingFee > 0 && ` + Frete ${formatBRL(fin.shippingFee)}`}
                          {fin.fixedFee > 0 && ` + Fixo ${formatBRL(fin.fixedFee)}`}
                        </div>
                      </td>

                      {/* Lucro Unitário / Margem */}
                      <td className="py-3.5 px-3">
                        <div className={`font-bold ${fin.netProfitUnit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatBRL(fin.netProfitUnit)}
                        </div>
                        <div className={`text-[11px] font-extrabold ${
                          fin.marginPercent >= 15 ? 'text-emerald-400' : fin.marginPercent >= 5 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {formatPercent(fin.marginPercent)}
                        </div>
                      </td>

                      {/* Impacto Mensal */}
                      <td className="py-3.5 px-3">
                        <div className={`font-black text-sm ${fin.monthlyProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatBRL(fin.monthlyProfit)}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {fin.monthlyProfit >= 0 ? 'lucro líquido' : 'sangria acumulada'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        {isBleeding ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-bold text-red-300 uppercase animate-pulse">
                            <AlertOctagon className="h-3 w-3" />
                            Sangria
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                            <AlertTriangle className="h-3 w-3" />
                            Alerta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                            <CheckCircle2 className="h-3 w-3" />
                            Saudável
                          </span>
                        )}
                      </td>

                      {/* Quick Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenFix(p)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                            isBleeding
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700'
                          }`}
                        >
                          <Wrench className="h-3 w-3" />
                          <span>Corrigir Preço</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Price Fix Modal */}
      <PriceFixModal
        product={selectedProductForFix}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProductForFix(null);
        }}
        onApplyPrice={handleApplyPrice}
      />
    </div>
  );
}
