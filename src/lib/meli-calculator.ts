import {
  CategoryKey,
  CategoryInfo,
  Modality,
  LogisticsType,
  ProductItem,
  ProductFinancials,
  ProductStatus,
  PricingSimulationInput,
  PricingSimulationResult,
  ReturnImpactInputs,
  ReturnImpactResults,
} from '@/types';

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  eletronicos: {
    id: 'eletronicos',
    name: 'Eletrônicos & Áudio',
    classicoRate: 0.12,
    premiumRate: 0.17,
    defaultReturnRate: 0.045,
  },
  informatica: {
    id: 'informatica',
    name: 'Informática & Periféricos',
    classicoRate: 0.115,
    premiumRate: 0.165,
    defaultReturnRate: 0.038,
  },
  casa_cozinha: {
    id: 'casa_cozinha',
    name: 'Casa, Móveis & Decoração',
    classicoRate: 0.135,
    premiumRate: 0.185,
    defaultReturnRate: 0.032,
  },
  automotivo: {
    id: 'automotivo',
    name: 'Acessórios para Veículos',
    classicoRate: 0.125,
    premiumRate: 0.175,
    defaultReturnRate: 0.04,
  },
  moda: {
    id: 'moda',
    name: 'Moda, Bolsas & Calçados',
    classicoRate: 0.14,
    premiumRate: 0.19,
    defaultReturnRate: 0.085, // Higher returns due to sizing
  },
  beleza: {
    id: 'beleza',
    name: 'Beleza & Cuidados Pessoais',
    classicoRate: 0.13,
    premiumRate: 0.18,
    defaultReturnRate: 0.025,
  },
};

export const FIXED_FEE_UNDER_79 = 6.50; // Taxa fixa ML para anúncios abaixo de R$ 79,00
export const FREE_SHIPPING_THRESHOLD = 79.00; // Limiar de frete grátis obrigatório

/**
 * Calculates dimensional weight (peso cubado): (C x L x A) / 6000
 */
export function calculateCubedWeight(lengthCm: number, widthCm: number, heightCm: number): number {
  return (lengthCm * widthCm * heightCm) / 6000;
}

/**
 * Calculates effective chargeable weight (in kg)
 */
export function getBillableWeightKg(
  weightGrams: number,
  dimensions?: { length: number; width: number; height: number }
): number {
  const physicalKg = Math.max(0.05, weightGrams / 1000);
  if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height) {
    return physicalKg;
  }
  const cubedKg = calculateCubedWeight(dimensions.length, dimensions.width, dimensions.height);
  return Math.max(physicalKg, cubedKg);
}

/**
 * Calculates estimated Mercado Envios shipping fee for products >= R$ 79
 * with seller reputation discount (default 50% discount for MercadoLíder)
 */
export function calculateShippingFee(
  price: number,
  weightGrams: number,
  dimensions?: { length: number; width: number; height: number },
  logistics: LogisticsType = 'full',
  reputationDiscount: number = 0.50
): number {
  if (price < FREE_SHIPPING_THRESHOLD) {
    return 0; // Below R$ 79, buyer pays shipping, seller pays fixed fee
  }

  const billableKg = getBillableWeightKg(weightGrams, dimensions);
  let baseFee = 20.90;

  if (billableKg <= 0.3) {
    baseFee = 20.90;
  } else if (billableKg <= 0.5) {
    baseFee = 22.90;
  } else if (billableKg <= 1.0) {
    baseFee = 25.90;
  } else if (billableKg <= 2.0) {
    baseFee = 29.90;
  } else if (billableKg <= 5.0) {
    baseFee = 39.90;
  } else if (billableKg <= 9.0) {
    baseFee = 56.90;
  } else if (billableKg <= 13.0) {
    baseFee = 72.90;
  } else if (billableKg <= 17.0) {
    baseFee = 88.90;
  } else {
    baseFee = 108.90;
  }

  // Slight logistic discount or adjustment: FULL has optimized operations
  const logisticsFactor = logistics === 'full' ? 0.95 : logistics === 'flex' ? 0.85 : 1.0;
  const sellerFinalCost = baseFee * (1 - reputationDiscount) * logisticsFactor;
  return Math.round(sellerFinalCost * 100) / 100;
}

/**
 * Calculates FULL prolonged storage fee per unit
 */
export function calculateStorageFee(storageDaysFull: number = 0, weightGrams: number = 500): number {
  if (storageDaysFull <= 60) return 0;
  const factor = weightGrams > 2000 ? 1.5 : 1.0;
  if (storageDaysFull <= 120) {
    return Math.round(0.08 * (storageDaysFull - 60) * factor * 100) / 100;
  } else if (storageDaysFull <= 180) {
    return Math.round((0.08 * 60 + 0.18 * (storageDaysFull - 120)) * factor * 100) / 100;
  } else {
    return Math.round((0.08 * 60 + 0.18 * 60 + 0.38 * (storageDaysFull - 180)) * factor * 100) / 100;
  }
}

/**
 * Calculates detailed unit financials for a product
 */
export function calculateProductFinancials(product: ProductItem): ProductFinancials {
  const categoryInfo = CATEGORIES[product.category] || CATEGORIES.eletronicos;
  const commissionRate = product.modality === 'premium' 
    ? categoryInfo.premiumRate 
    : categoryInfo.classicoRate;

  const price = product.currentPrice;
  const commissionAmount = Math.round(price * commissionRate * 100) / 100;
  const fixedFee = price < FREE_SHIPPING_THRESHOLD ? FIXED_FEE_UNDER_79 : 0;
  const shippingFee = calculateShippingFee(
    price,
    product.weightGrams,
    product.dimensionsCm,
    product.logistics,
    0.50
  );
  const storageFee = product.logistics === 'full' 
    ? calculateStorageFee(product.storageDaysFull || 0, product.weightGrams)
    : 0;

  const taxAmount = Math.round(price * product.taxRate * 100) / 100;
  const totalMeliFees = Math.round((commissionAmount + fixedFee + shippingFee + storageFee) * 100) / 100;
  const totalCosts = Math.round((product.costPrice + totalMeliFees + taxAmount + product.packagingCost) * 100) / 100;
  const netProfitUnit = Math.round((price - totalCosts) * 100) / 100;
  const marginPercent = price > 0 ? Math.round((netProfitUnit / price) * 1000) / 10 : 0;

  let status: ProductStatus = 'healthy';
  if (marginPercent < 5) {
    status = 'bleeding';
  } else if (marginPercent < 14) {
    status = 'warning';
  }

  const monthlyRevenue = Math.round(price * product.monthlyUnits * 100) / 100;
  const monthlyProfit = Math.round(netProfitUnit * product.monthlyUnits * 100) / 100;

  // Calculate suggested healthy price (target 15% margin)
  const targetMargin = 0.15;
  const suggestedHealthyPrice = solvePriceForTargetMargin(
    product.costPrice,
    categoryInfo.id,
    product.modality,
    product.logistics,
    product.taxRate,
    targetMargin,
    product.packagingCost,
    product.weightGrams,
    product.dimensionsCm
  );

  return {
    product,
    commissionRate,
    commissionAmount,
    fixedFee,
    shippingFee,
    storageFee,
    taxAmount,
    totalMeliFees,
    totalCosts,
    netProfitUnit,
    marginPercent,
    monthlyRevenue,
    monthlyProfit,
    status,
    suggestedHealthyPrice,
    suggestedMarginPercent: 15.0,
  };
}

/**
 * Solves for the exact selling price required to hit target margin M (e.g. 0.15)
 */
export function solvePriceForTargetMargin(
  costPrice: number,
  category: CategoryKey,
  modality: Modality,
  logistics: LogisticsType,
  taxRate: number,
  targetMargin: number,
  packagingCost: number = 2.0,
  weightGrams: number = 500,
  dimensions?: { length: number; width: number; height: number }
): number {
  const cat = CATEGORIES[category] || CATEGORIES.eletronicos;
  const commissionRate = modality === 'premium' ? cat.premiumRate : cat.classicoRate;
  
  // Denominator: 1 - commission - tax - targetMargin
  const denominator = 1 - commissionRate - taxRate - targetMargin;
  if (denominator <= 0) return 999.0; // Math protection

  // Hypothesis A: Price >= 79 (Seller pays shipping, no fixed fee)
  const shippingAtTarget = calculateShippingFee(100, weightGrams, dimensions, logistics, 0.50);
  const priceWithShipping = (costPrice + shippingAtTarget + packagingCost) / denominator;

  if (priceWithShipping >= FREE_SHIPPING_THRESHOLD) {
    return Math.round(priceWithShipping * 100) / 100;
  }

  // Hypothesis B: Price < 79 (Seller pays fixed fee of 6.50, no shipping)
  const priceWithFixedFee = (costPrice + FIXED_FEE_UNDER_79 + packagingCost) / denominator;
  
  if (priceWithFixedFee < FREE_SHIPPING_THRESHOLD) {
    return Math.round(priceWithFixedFee * 100) / 100;
  }

  // Edge case: Falls in the discontinuity gap [70 - 85], bump to 79.90
  return 79.90;
}

/**
 * Runs comprehensive pricing simulation for the simulator page
 */
export function runPricingSimulation(input: PricingSimulationInput): PricingSimulationResult {
  const cat = CATEGORIES[input.category] || CATEGORIES.eletronicos;
  const commissionRate = input.modality === 'premium' ? cat.premiumRate : cat.classicoRate;
  const taxRate = input.taxRatePercent / 100;
  const targetMargin = input.targetMarginPercent / 100;

  let finalPrice = input.salePrice;
  const recommendedPrice = solvePriceForTargetMargin(
    input.costPrice,
    input.category,
    input.modality,
    input.logistics,
    taxRate,
    targetMargin,
    input.packagingCost,
    input.weightGrams,
    input.dimensionsCm
  );

  if (input.calculationMode === 'target_margin') {
    finalPrice = recommendedPrice;
  }

  const commissionAmount = Math.round(finalPrice * commissionRate * 100) / 100;
  const fixedFee = finalPrice < FREE_SHIPPING_THRESHOLD ? FIXED_FEE_UNDER_79 : 0;
  const isFreeShippingObligatory = finalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = calculateShippingFee(
    finalPrice,
    input.weightGrams,
    input.dimensionsCm,
    input.logistics,
    input.sellerReputationDiscount
  );
  const storageFee = input.logistics === 'full' 
    ? calculateStorageFee(input.storageDaysFull, input.weightGrams)
    : 0;

  const taxAmount = Math.round(finalPrice * taxRate * 100) / 100;
  const totalDeductions = Math.round(
    (input.costPrice + commissionAmount + fixedFee + shippingFee + storageFee + taxAmount + input.packagingCost) * 100
  ) / 100;
  const netProfit = Math.round((finalPrice - totalDeductions) * 100) / 100;
  const marginPercent = finalPrice > 0 ? Math.round((netProfit / finalPrice) * 1000) / 10 : 0;
  const markupPercent = input.costPrice > 0 
    ? Math.round(((finalPrice - input.costPrice) / input.costPrice) * 1000) / 10 
    : 0;

  let status: ProductStatus = 'healthy';
  if (marginPercent < 5) status = 'bleeding';
  else if (marginPercent < 14) status = 'warning';

  // Percentage breakdown relative to finalPrice
  const costPct = finalPrice > 0 ? Math.max(0, (input.costPrice / finalPrice) * 100) : 0;
  const commPct = finalPrice > 0 ? ((commissionAmount + fixedFee) / finalPrice) * 100 : 0;
  const shipPct = finalPrice > 0 ? (shippingFee / finalPrice) * 100 : 0;
  const taxPct = finalPrice > 0 ? (taxAmount / finalPrice) * 100 : 0;
  const otherPct = finalPrice > 0 ? ((storageFee + input.packagingCost) / finalPrice) * 100 : 0;
  const profitPct = Math.max(-50, marginPercent);

  // Sensitivity analysis: -10%, -5%, +5%, +10%
  const variations = [-0.10, -0.05, 0, 0.05, 0.10];
  const sensitivity = variations.map((diff) => {
    const testPrice = Math.max(1, Math.round(finalPrice * (1 + diff) * 100) / 100);
    const testComm = testPrice * commissionRate;
    const testFixed = testPrice < FREE_SHIPPING_THRESHOLD ? FIXED_FEE_UNDER_79 : 0;
    const testShip = calculateShippingFee(testPrice, input.weightGrams, input.dimensionsCm, input.logistics, input.sellerReputationDiscount);
    const testTax = testPrice * taxRate;
    const testTotalCosts = input.costPrice + testComm + testFixed + testShip + storageFee + testTax + input.packagingCost;
    const testProfit = Math.round((testPrice - testTotalCosts) * 100) / 100;
    const testMargin = Math.round((testProfit / testPrice) * 1000) / 10;

    let label = 'Atual';
    if (diff === -0.10) label = '-10% (Promoção)';
    else if (diff === -0.05) label = '-5% (Competitivo)';
    else if (diff === 0) label = 'Preço Calculado';
    else if (diff === 0.05) label = '+5% (Margem Extra)';
    else if (diff === 0.10) label = '+10% (Alta Margem)';

    return {
      label,
      price: testPrice,
      netProfit: testProfit,
      marginPercent: testMargin,
      diffPercent: diff * 100,
    };
  });

  return {
    recommendedPrice,
    salePriceUsed: finalPrice,
    commissionPercent: Math.round(commissionRate * 1000) / 10,
    commissionAmount,
    fixedFee,
    isFreeShippingObligatory,
    shippingFee,
    storageFee,
    taxAmount,
    costPrice: input.costPrice,
    packagingCost: input.packagingCost,
    totalDeductions,
    netProfit,
    marginPercent,
    markupPercent,
    status,
    breakdown: {
      costPercent: Math.round(costPct * 10) / 10,
      commissionPercent: Math.round(commPct * 10) / 10,
      shippingPercent: Math.round(shipPct * 10) / 10,
      taxPercent: Math.round(taxPct * 10) / 10,
      packagingAndStoragePercent: Math.round(otherPct * 10) / 10,
      profitPercent: Math.round(profitPct * 10) / 10,
    },
    sensitivity,
  };
}

/**
 * Calculates the severe financial erosion of returns and reverse logistics
 */
export function calculateReturnImpact(inputs: ReturnImpactInputs): ReturnImpactResults {
  const returnRate = inputs.returnRatePercent / 100;
  const returnedUnitsMonthly = Math.round(inputs.monthlyUnits * returnRate);
  
  // Total reverse shipping cost charged to seller
  const reverseShippingTotal = Math.round(returnedUnitsMonthly * inputs.reverseShippingCostAverage * 100) / 100;
  
  // Damaged goods loss (fraction of returned items that cannot be sold as new)
  const damagedUnits = Math.round(returnedUnitsMonthly * (inputs.damagedGoodsRatePercent / 100));
  const damagedGoodsLossTotal = Math.round(damagedUnits * inputs.averageProductCost * 100) / 100;
  
  const totalReturnLossMonthly = Math.round((reverseShippingTotal + damagedGoodsLossTotal) * 100) / 100;
  
  // Impact on margin in percentage points
  const impactOnMarginPoints = inputs.monthlyRevenue > 0 
    ? Math.round((totalReturnLossMonthly / inputs.monthlyRevenue) * 1000) / 10
    : 0;
    
  const annualizedLoss = Math.round(totalReturnLossMonthly * 12 * 100) / 100;
  
  // Break-even return rate threshold: at what return rate does total return loss equal total profit?
  // Assume base net profit before return loss is ~15% of revenue
  const estimatedGrossProfit = inputs.monthlyRevenue * 0.15;
  const costPerReturnUnit = inputs.reverseShippingCostAverage + (inputs.averageProductCost * (inputs.damagedGoodsRatePercent / 100));
  const maxAcceptableReturns = costPerReturnUnit > 0 ? estimatedGrossProfit / costPerReturnUnit : 0;
  const breakEvenReturnRateThreshold = inputs.monthlyUnits > 0 
    ? Math.min(25, Math.round((maxAcceptableReturns / inputs.monthlyUnits) * 1000) / 10)
    : 8.5;

  return {
    returnedUnitsMonthly,
    reverseShippingTotal,
    damagedGoodsLossTotal,
    totalReturnLossMonthly,
    impactOnMarginPoints,
    annualizedLoss,
    breakEvenReturnRateThreshold,
  };
}

/**
 * Formats a number to Brazilian Real (R$)
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a percentage number (e.g. 15.4%)
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`;
}
