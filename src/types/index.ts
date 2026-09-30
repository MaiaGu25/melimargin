export type Modality = 'classico' | 'premium';
export type LogisticsType = 'full' | 'coleta' | 'agencia' | 'flex';
export type ProductStatus = 'healthy' | 'warning' | 'bleeding';
export type CategoryKey = 
  | 'eletronicos'
  | 'informatica'
  | 'casa_cozinha'
  | 'automotivo'
  | 'moda'
  | 'beleza';

export interface CategoryInfo {
  id: CategoryKey;
  name: string;
  classicoRate: number; // e.g. 0.12
  premiumRate: number;  // e.g. 0.17
  defaultReturnRate: number; // e.g. 0.035
}

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  category: CategoryKey;
  modality: Modality;
  logistics: LogisticsType;
  currentPrice: number;
  costPrice: number; // CMV
  monthlyUnits: number;
  weightGrams: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };
  packagingCost: number;
  taxRate: number; // e.g. 0.065 (6.5%)
  returnRate: number; // e.g. 0.04 (4%)
  storageDaysFull?: number; // Days in FULL warehouse
  // Diagnostic note explaining issues (e.g. cubagem increase, high return rate)
  alertReason?: string;
}

export interface ProductFinancials {
  product: ProductItem;
  commissionRate: number;
  commissionAmount: number;
  fixedFee: number;
  shippingFee: number;
  taxAmount: number;
  storageFee: number;
  totalMeliFees: number;
  totalCosts: number;
  netProfitUnit: number;
  marginPercent: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  status: ProductStatus;
  suggestedHealthyPrice: number;
  suggestedMarginPercent: number;
}

export interface KpiSummary {
  grossMonthlyRevenue: number;
  previousMonthRevenue: number;
  realNetProfit: number;
  previousMonthProfit: number;
  realNetMarginPercent: number;
  meliFeesTake: number;
  meliFeesTakePercent: number;
  totalShippingPaid: number;
  estimatedTaxes: number;
  taxPercent: number;
  bleedingSkuCount: number;
  warningSkuCount: number;
  healthySkuCount: number;
  totalUnitsSold: number;
  averageTicket: number;
  totalBleedingLossMonthly: number;
}

export interface PricingSimulationInput {
  costPrice: number;
  category: CategoryKey;
  modality: Modality;
  logistics: LogisticsType;
  salePrice: number;
  targetMarginPercent: number;
  calculationMode: 'target_margin' | 'target_price';
  taxRatePercent: number;
  packagingCost: number;
  weightGrams: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };
  storageDaysFull: number;
  sellerReputationDiscount: number; // e.g. 0.5 for 50% discount on ML shipping
}

export interface PricingSimulationResult {
  recommendedPrice: number;
  salePriceUsed: number;
  commissionPercent: number;
  commissionAmount: number;
  fixedFee: number;
  isFreeShippingObligatory: boolean;
  shippingFee: number;
  storageFee: number;
  taxAmount: number;
  costPrice: number;
  packagingCost: number;
  totalDeductions: number;
  netProfit: number;
  marginPercent: number;
  markupPercent: number;
  status: ProductStatus;
  breakdown: {
    costPercent: number;
    commissionPercent: number;
    shippingPercent: number;
    taxPercent: number;
    packagingAndStoragePercent: number;
    profitPercent: number;
  };
  sensitivity: {
    label: string;
    price: number;
    netProfit: number;
    marginPercent: number;
    diffPercent: number;
  }[];
}

export interface ReturnImpactInputs {
  monthlyRevenue: number;
  monthlyUnits: number;
  averageTicket: number;
  returnRatePercent: number;
  reverseShippingCostAverage: number;
  damagedGoodsRatePercent: number; // percentage of returns that are damaged/unusable
  averageProductCost: number;
}

export interface ReturnImpactResults {
  returnedUnitsMonthly: number;
  reverseShippingTotal: number;
  damagedGoodsLossTotal: number;
  totalReturnLossMonthly: number;
  impactOnMarginPoints: number; // e.g. reduces net margin by 3.2%
  annualizedLoss: number;
  breakEvenReturnRateThreshold: number; // above this %, entire profit is wiped out
}
