import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-900 bg-zinc-950 py-10 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-zinc-300 text-sm tracking-tight">
                Meli<span className="text-amber-400">Margin</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">Plataforma de Inteligência Financeira para Sellers Mercado Livre</span>
            </div>
            <p className="text-zinc-500 text-[11px] max-w-2xl">
              Cálculos em conformidade com as regras vigentes do Mercado Livre Brasil: Regra dos R$ 79,00 (taxa fixa vs frete grátis obrigatório), tabelas de cubagem volumétrica e descontos por reputação MercadoLíder.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/simulator" className="text-zinc-400 hover:text-amber-400 transition-colors">
              Simulador
            </Link>
            <Link href="/products" className="text-zinc-400 hover:text-amber-400 transition-colors">
              Auditoria SKUs
            </Link>
            <Link href="/fees" className="text-zinc-400 hover:text-amber-400 transition-colors">
              Taxas & Regras
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-900 text-[11px] text-zinc-600 gap-2">
          <span>
            © {new Date().getFullYear()} MeliMargin Intelligence. Dados simulados com algoritmos de alta fidelidade ML.
          </span>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Simulador de Auditoria & Proteção de Margem</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
