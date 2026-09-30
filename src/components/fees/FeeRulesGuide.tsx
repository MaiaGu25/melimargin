import React from 'react';
import {
  Scale,
  Box,
  Truck,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { CATEGORIES, FIXED_FEE_UNDER_79 } from '@/lib/meli-calculator';

export function FeeRulesGuide() {
  return (
    <div className="space-y-8">
      {/* 1. Golden Rule of R$ 79 */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-zinc-900/60 to-zinc-950 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              A Regra dos R$ 79,00 &quot;O Abismo de Margem&quot;
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Crucial
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Entenda como a mudança de taxa fixa para frete grátis obrigatório afeta seu lucro real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Below R$ 79 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-200">Anúncios Abaixo de R$ 79,00</span>
              <span className="font-mono text-xs font-bold text-amber-400">Preço &lt; R$ 79</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Taxa Fixa Obrigatória:</strong> R$ {FIXED_FEE_UNDER_79.toFixed(2)} por unidade vendida.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Frete Mercado Envios:</strong> O comprador paga o frete integralmente na finalização da compra.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Comissão de Venda:</strong> Aplicada normalmente (11% a 19%).</span>
              </li>
            </ul>
          </div>

          {/* Above R$ 79 */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300">Anúncios a Partir de R$ 79,00</span>
              <span className="font-mono text-xs font-bold text-emerald-400">Preço ≥ R$ 79</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Taxa Fixa:</strong> R$ 0,00 (Isento da tarifa fixa de R$ 6,50).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Frete Grátis Obrigatório:</strong> Faturado integralmente do vendedor na tabela oficial.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Desconto MercadoLíder:</strong> Vendedores com reputação verde recebem até 50% de desconto no custo do frete.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The Danger Gap */}
        <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 p-3.5 text-xs text-amber-200/90 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <span>Atenção à faixa entre R$ 78,00 e R$ 89,00:</span>
          </div>
          <p className="leading-relaxed text-zinc-300">
            Se você vende um produto a R$ 78,90 (sem frete grátis, taxa fixa R$ 6,50) e decide aumentar para R$ 79,90, você ativará o frete grátis obrigatório (custo mínimo de R$ 10,45 com desconto Líder). <strong>Você aumentou R$ 1,00 no preço mas absorveu R$ 3,95 a mais em custos</strong>, diminuindo seu lucro no bolso!
          </p>
        </div>
      </div>

      {/* 2. Official Commission Rates Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Tabela de Tarifas por Categoria Mercado Livre
              </h3>
              <p className="text-xs text-zinc-400">
                Comparativo oficial de comissões praticadas no Clássico e no Premium
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Clássico (Comissão)</th>
                <th className="py-3 px-4">Premium (Comissão + Parcelamento)</th>
                <th className="py-3 px-4">Taxa Média Devolução</th>
                <th className="py-3 px-4">Recomendação Estratégica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {Object.values(CATEGORIES).map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-900/50">
                  <td className="py-3 px-4 font-semibold text-zinc-200">{cat.name}</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-300">
                    {(cat.classicoRate * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {(cat.premiumRate * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {(cat.defaultReturnRate * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-[11px] text-zinc-400">
                    {cat.id === 'moda'
                      ? 'Embutir margem de devolução de 8% e trabalhar fotos fiéis de medidas.'
                      : cat.id === 'informatica' || cat.id === 'eletronicos'
                      ? 'Usar Premium em tickets > R$ 150 para viabilizar parcelamento sem juros.'
                      : 'Otimizar embalagem para reduzir cubagem no Mercado Envios FULL.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. FULL Prolonged Storage & Dimensional Weight (Cubagem) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prolonged Storage Rules */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Box className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100">Armazenagem Prolongada no FULL</h4>
              <p className="text-[11px] text-zinc-400">Custos diários após o período de carência</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="font-bold text-emerald-400 block">Até 60 dias no FULL</span>
                <span className="text-[11px] text-zinc-400">Giro normal e saudável</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Grátis (R$ 0,00)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="font-bold text-amber-400 block">61 a 120 dias no armazém</span>
                <span className="text-[11px] text-zinc-400">Estoque lento</span>
              </div>
              <span className="font-mono font-bold text-amber-400">
                R$ 0,08 / unid / dia
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="font-bold text-orange-400 block">121 a 180 dias no armazém</span>
                <span className="text-[11px] text-zinc-400">Estoque parado com risco</span>
              </div>
              <span className="font-mono font-bold text-orange-400">
                R$ 0,18 / unid / dia
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/20 border border-red-500/30">
              <div>
                <span className="font-bold text-red-400 block">Mais de 180 dias no armazém</span>
                <span className="text-[11px] text-red-300">Penalidade máxima de ocupação</span>
              </div>
              <span className="font-mono font-bold text-red-400">
                R$ 0,38 / unid / dia
              </span>
            </div>
          </div>
        </div>

        {/* Cubagem Formula */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100">Armadilha da Cubagem Volumétrica</h4>
              <p className="text-[11px] text-zinc-400">Como o Mercado Livre mede o peso faturável</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
            <div className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">
              Fórmula Oficial Mercado Envios
            </div>
            <div className="font-mono text-base font-extrabold text-amber-400 bg-zinc-900 p-2 rounded-lg border border-zinc-800 inline-block">
              Peso Cubado (kg) = (C × L × A em cm) / 6000
            </div>
            <p className="text-xs text-zinc-400 text-left pt-1">
              O Mercado Livre cobra sempre pelo <strong>MAIOR valor</strong> entre o peso físico na balança e o peso cubado calculado pelas dimensões da embalagem exterior.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 space-y-2 text-xs">
            <div className="font-bold text-zinc-200">Exemplo Prático:</div>
            <p className="text-zinc-400">
              Um fone de ouvido pesa apenas <strong className="text-zinc-200">350 gramas</strong>. No entanto, se sua caixa mede 28cm × 24cm × 20cm:
            </p>
            <div className="font-mono text-[11px] text-amber-300 bg-zinc-900 p-2 rounded border border-zinc-800">
              (28 × 24 × 20) / 6000 = 2,24 kg!
            </div>
            <p className="text-zinc-400 text-[11px]">
              O Mercado Livre cobrará a faixa de <strong>2 a 5 kg</strong> (R$ 19,95 com 50% de desconto) em vez de cobrar a faixa de 300 a 500g (R$ 11,45). Uma diferença oculta de <strong>R$ 8,50 por unidade vendida</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
