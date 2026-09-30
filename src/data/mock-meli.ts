import { ProductItem, KpiSummary } from '@/types';
import { calculateProductFinancials } from '@/lib/meli-calculator';

export const INITIAL_PRODUCTS: ProductItem[] = [
  // 1. Bleeding SKU 1 - Re-cubagem surpresa no FULL
  {
    id: 'sku-001',
    sku: 'AUD-NC-700',
    title: 'Headphone Bluetooth ANC Over-Ear com Cancelamento Ativo de Ruído',
    category: 'eletronicos',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 89.90,
    costPrice: 58.00,
    monthlyUnits: 140,
    weightGrams: 350,
    dimensionsCm: {
      length: 28,
      width: 24,
      height: 20, // Cubagem alta: (28x24x20)/6000 = 2.24 kg billable!
    },
    packagingCost: 3.50,
    taxRate: 0.065,
    returnRate: 0.045,
    storageDaysFull: 35,
    alertReason: 'Cubagem volumétrica aferida pelo FULL subiu de 400g para 2.24kg. Frete saltou de R$ 10,90 para R$ 19,95, gerando prejuízo por unidade.',
  },
  // 2. Bleeding SKU 2 - Alta devolução e frete pesado
  {
    id: 'sku-002',
    sku: 'FRY-AIR-55L',
    title: 'Fritadeira Elétrica Sem Óleo Air Fryer 5.5L Inox Digital Touch',
    category: 'casa_cozinha',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 299.00,
    costPrice: 205.00,
    monthlyUnits: 85,
    weightGrams: 5200,
    dimensionsCm: {
      length: 36,
      width: 34,
      height: 38,
    },
    packagingCost: 8.00,
    taxRate: 0.065,
    returnRate: 0.092, // 9.2% de devolução
    storageDaysFull: 45,
    alertReason: 'Taxa de devoluções em 9.2% (avarias na gaveta) + comissão Premium (18.5%) + frete pesado devoraram todo o lucro líquido.',
  },
  // 3. Bleeding SKU 3 - Preço preso abaixo de R$ 79 com taxa fixa de R$ 6,50
  {
    id: 'sku-003',
    sku: 'KIT-ORG-ACR',
    title: 'Kit 6 Organizadores Acrílico Geladeira e Despensa Multiuso',
    category: 'casa_cozinha',
    modality: 'classico',
    logistics: 'coleta',
    currentPrice: 74.90,
    costPrice: 52.00,
    monthlyUnits: 210,
    weightGrams: 1400,
    dimensionsCm: {
      length: 30,
      width: 20,
      height: 15,
    },
    packagingCost: 5.50, // Embalagem reforçada bolha
    taxRate: 0.065,
    returnRate: 0.038,
    alertReason: 'Preço abaixo de R$ 79 sofre taxa fixa de R$ 6,50 somada ao custo de embalagem reforçada anti-quebra (R$ 5,50), tornando a venda deficitária.',
  },
  // 4. Healthy SKU
  {
    id: 'sku-004',
    sku: 'SMW-AMO-01',
    title: 'Smartwatch AMOLED Relógio Inteligente Ultra GPS Prova D\'Água IP68',
    category: 'eletronicos',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 199.90,
    costPrice: 88.00,
    monthlyUnits: 260,
    weightGrams: 180,
    dimensionsCm: {
      length: 12,
      width: 10,
      height: 6,
    },
    packagingCost: 2.00,
    taxRate: 0.065,
    returnRate: 0.028,
    storageDaysFull: 18,
  },
  // 5. Healthy SKU
  {
    id: 'sku-005',
    sku: 'TEC-MEC-RGB',
    title: 'Teclado Mecânico Gamer RGB Hot-Swap Switch Blue Anti-Ghosting',
    category: 'informatica',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 219.90,
    costPrice: 95.00,
    monthlyUnits: 195,
    weightGrams: 850,
    dimensionsCm: {
      length: 42,
      width: 14,
      height: 5,
    },
    packagingCost: 3.00,
    taxRate: 0.065,
    returnRate: 0.032,
    storageDaysFull: 22,
  },
  // 6. Healthy SKU
  {
    id: 'sku-006',
    sku: 'CAM-WIFI-360',
    title: 'Câmera Segurança Wi-Fi 360 Full HD Visão Noturna Áudio Bidirecional',
    category: 'eletronicos',
    modality: 'classico',
    logistics: 'full',
    currentPrice: 139.90,
    costPrice: 62.00,
    monthlyUnits: 240,
    weightGrams: 320,
    dimensionsCm: {
      length: 15,
      width: 12,
      height: 10,
    },
    packagingCost: 2.50,
    taxRate: 0.065,
    returnRate: 0.035,
    storageDaysFull: 15,
  },
  // 7. Healthy SKU
  {
    id: 'sku-007',
    sku: 'SUP-ART-GAS',
    title: 'Suporte Articulado Monitor Duplo a Gás de 17 a 32 Pol Mesa VESA',
    category: 'informatica',
    modality: 'classico',
    logistics: 'coleta',
    currentPrice: 249.00,
    costPrice: 118.00,
    monthlyUnits: 120,
    weightGrams: 3800,
    dimensionsCm: {
      length: 45,
      width: 30,
      height: 12,
    },
    packagingCost: 4.00,
    taxRate: 0.065,
    returnRate: 0.021,
  },
  // 8. Warning SKU
  {
    id: 'sku-008',
    sku: 'MOC-EXE-IMP',
    title: 'Mochila Executiva Impermeável Anti-Furto com Trava USB Notebook 15.6',
    category: 'moda',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 169.90,
    costPrice: 94.00,
    monthlyUnits: 150,
    weightGrams: 950,
    dimensionsCm: {
      length: 45,
      width: 32,
      height: 18,
    },
    packagingCost: 3.50,
    taxRate: 0.065,
    returnRate: 0.078,
    storageDaysFull: 72, // Entrando em armazenagem cobrada
    alertReason: 'Taxa de armazenagem FULL após 60 dias e comissão de Moda (19%) comprimiram a margem para 8.9%.',
  },
  // 9. Warning SKU
  {
    id: 'sku-009',
    sku: 'CJ-PAN-CER',
    title: 'Jogo de Panelas Cerâmica Antiaderente 5 Peças Fundo Triplo Indução',
    category: 'casa_cozinha',
    modality: 'classico',
    logistics: 'full',
    currentPrice: 389.00,
    costPrice: 245.00,
    monthlyUnits: 65,
    weightGrams: 6200,
    dimensionsCm: {
      length: 52,
      width: 34,
      height: 24,
    },
    packagingCost: 10.00,
    taxRate: 0.065,
    returnRate: 0.042,
    storageDaysFull: 40,
    alertReason: 'Custo de embalagem de segurança e frete volumoso deixam margem em 10.8%. Necessita repasse de R$ 25.',
  },
  // 10. Healthy SKU
  {
    id: 'sku-010',
    sku: 'PAR-LED-H7',
    title: 'Par Lâmpadas Ultra LED H7 6000K Super Branca Shocklight 10000lm',
    category: 'automotivo',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 94.90,
    costPrice: 38.00,
    monthlyUnits: 175,
    weightGrams: 280,
    dimensionsCm: {
      length: 14,
      width: 11,
      height: 6,
    },
    packagingCost: 1.80,
    taxRate: 0.065,
    returnRate: 0.024,
    storageDaysFull: 12,
  },
  // 11. Healthy SKU
  {
    id: 'sku-011',
    sku: 'SER-ACID-HIAL',
    title: 'Sérum Facial Ácido Hialurônico Puro + Vitamina C Concentrada 30ml',
    category: 'beleza',
    modality: 'classico',
    logistics: 'full',
    currentPrice: 68.00,
    costPrice: 24.00,
    monthlyUnits: 280,
    weightGrams: 110,
    dimensionsCm: {
      length: 10,
      width: 5,
      height: 5,
    },
    packagingCost: 1.50,
    taxRate: 0.065,
    returnRate: 0.015,
    storageDaysFull: 14,
  },
  // 12. Healthy SKU
  {
    id: 'sku-012',
    sku: 'CAR-GAN-65W',
    title: 'Carregador Turbo 65W GaN USB-C 3 Portas Compatível Notebook e Celular',
    category: 'eletronicos',
    modality: 'premium',
    logistics: 'full',
    currentPrice: 149.90,
    costPrice: 66.00,
    monthlyUnits: 210,
    weightGrams: 190,
    dimensionsCm: {
      length: 11,
      width: 9,
      height: 4,
    },
    packagingCost: 2.00,
    taxRate: 0.065,
    returnRate: 0.022,
    storageDaysFull: 20,
  },
];

/**
 * Calculates aggregated KPIs across all products
 */
export function computeKpiSummary(products: ProductItem[]): KpiSummary {
  const financials = products.map(calculateProductFinancials);

  let grossMonthlyRevenue = 0;
  let realNetProfit = 0;
  let meliCommissionTotal = 0;
  let fixedFeeTotal = 0;
  let totalShippingPaid = 0;
  let storageFeesTotal = 0;
  let estimatedTaxes = 0;
  let totalUnitsSold = 0;
  let totalBleedingLossMonthly = 0;

  let bleedingSkuCount = 0;
  let warningSkuCount = 0;
  let healthySkuCount = 0;

  for (const f of financials) {
    const units = f.product.monthlyUnits;
    grossMonthlyRevenue += f.monthlyRevenue;
    realNetProfit += f.monthlyProfit;
    meliCommissionTotal += f.commissionAmount * units;
    fixedFeeTotal += f.fixedFee * units;
    totalShippingPaid += f.shippingFee * units;
    storageFeesTotal += f.storageFee * units;
    estimatedTaxes += f.taxAmount * units;
    totalUnitsSold += units;

    if (f.status === 'bleeding') {
      bleedingSkuCount++;
      if (f.monthlyProfit < 0) {
        totalBleedingLossMonthly += Math.abs(f.monthlyProfit);
      }
    } else if (f.status === 'warning') {
      warningSkuCount++;
    } else {
      healthySkuCount++;
    }
  }

  const meliFeesTake = meliCommissionTotal + fixedFeeTotal + totalShippingPaid + storageFeesTotal;
  const meliFeesTakePercent = grossMonthlyRevenue > 0 
    ? Math.round((meliFeesTake / grossMonthlyRevenue) * 1000) / 10 
    : 0;

  const realNetMarginPercent = grossMonthlyRevenue > 0
    ? Math.round((realNetProfit / grossMonthlyRevenue) * 1000) / 10
    : 0;

  const taxPercent = grossMonthlyRevenue > 0
    ? Math.round((estimatedTaxes / grossMonthlyRevenue) * 1000) / 10
    : 0;

  const averageTicket = totalUnitsSold > 0
    ? Math.round((grossMonthlyRevenue / totalUnitsSold) * 100) / 100
    : 0;

  return {
    grossMonthlyRevenue: Math.round(grossMonthlyRevenue * 100) / 100,
    previousMonthRevenue: Math.round(grossMonthlyRevenue * 0.94 * 100) / 100, // +6.4% growth
    realNetProfit: Math.round(realNetProfit * 100) / 100,
    previousMonthProfit: Math.round(realNetProfit * 0.91 * 100) / 100, // +9.8%
    realNetMarginPercent,
    meliFeesTake: Math.round(meliFeesTake * 100) / 100,
    meliFeesTakePercent,
    totalShippingPaid: Math.round(totalShippingPaid * 100) / 100,
    estimatedTaxes: Math.round(estimatedTaxes * 100) / 100,
    taxPercent,
    bleedingSkuCount,
    warningSkuCount,
    healthySkuCount,
    totalUnitsSold,
    averageTicket,
    totalBleedingLossMonthly: Math.round(totalBleedingLossMonthly * 100) / 100,
  };
}

export const STORE_INFO = {
  name: 'EletroPro Mega Store',
  cnpj: '38.412.984/0001-92',
  medal: 'MercadoLíder Platinum',
  reputationColor: 'emerald',
  reputationScore: 'Termômetro Verde Escuro (Nível Máximo)',
  cancelRate: '0.38% (Meta < 1.0%)',
  lateShippingRate: '1.1% (Meta < 4.0%)',
  claimsRate: '0.45% (Meta < 1.0%)',
  fullSharePercent: 78, // 78% of sales via FULL
  activeAdsCount: 148,
  simulatedMonth: 'Outubro de 2026',
};
