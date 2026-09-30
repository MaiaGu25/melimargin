'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductTable } from '@/components/products/ProductTable';
import { INITIAL_PRODUCTS } from '@/data/mock-meli';
import { PackageSearch, ArrowLeft, Plus } from 'lucide-react';
import { ProductStatus } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') as ProductStatus | null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <PackageSearch className="h-3 w-3" />
              Auditoria de Catálogo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
            Auditoria de SKUs & Margem por Produto
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Monitore o lucro real e a mordida de tarifas de cada anúncio. Identifique produtos em sangria e reajuste preços com 1 clique para restaurar a margem saudável de 15%.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/simulator"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/15 hover:brightness-110 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Simular Novo SKU</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Table */}
      <ProductTable
        initialProducts={INITIAL_PRODUCTS}
        defaultStatusFilter={statusParam || 'all'}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px] text-zinc-400 text-xs">
          Carregando catálogo de produtos e margens...
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </main>
  );
}
