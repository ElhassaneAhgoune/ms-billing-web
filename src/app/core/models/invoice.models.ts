export interface VisaInvoiceDetailDto {
  id?: string;
  billingPeriod?: string;
  invoiceDate?: string;
  invoiceAccount?: string;
  name?: string;
  invoiceId?: string;
  subInvoice?: string;
  currentOrPrevious?: string;
  entityType?: string;
  entityId?: string;
  numidMap?: string;
  entityName?: string;
  settlementId?: string;
  description?: string;
  futureUse?: string;
  ntwk?: string;
  billingLine?: string;
  type?: string;
  rateType?: string;
  units?: number;
  rateCur?: string;
  rate?: number;
  foreignExchangeRate?: number;
  billingCurrency?: string;
  total?: number;
  taxType?: string;
  tax?: number;
  taxRate?: number;
  taxCurrency?: string;
  taxableAmountTaxCurrency?: number;
  taxTaxCurrency?: number;
}

export interface MastercardInvoiceDetailDto {
  id?: string;
  billingDate?: string;
  invoiceNumber?: string;
  activityIca?: string;
  billingEvent?: string;
  tierEvent?: string;
  eventDescription?: string;
  quantity?: number;
  amount?: number;
  chargeUsd?: number;
  currency?: string;
  chargeAmountLocal?: number;
  collectionMethod?: string;
  geographicIndicator?: string;
  serviceCode?: string;
  uomCode?: string;
  fromCountry?: string;
  toCountry?: string;
  product?: string;
  invoiceIca?: string;
  billableIca?: string;
  parentIca?: string;
  rate?: number;
  taxAmountLocal?: number;
  taxAmountUsd?: number;
  hierarchyFeeType?: string;
  hierarchyFeeCategory?: string;
  hierarchyFeeSubCategory?: string;
  regulatoryFlag?: string;
  chargeType?: string;
  explanatoryText?: string;
  csvFile?: string;
}

export interface SummaryVisaResponseDto {
  billing_date?: string;
  total_charges_USD?: number;
  currency_distribution?: Record<string, number>;
}

export interface SummaryResponseDto {
  billing_date?: string;
  total_charges_USD?: number;
  currency_distribution?: Record<string, number>;
}

export interface ServiceBreakdownResponseDto {
  serviceCode?: string;
  description?: string;
  totalAmount?: number;
}

export interface CsvFileParams {
  csvName?: string;
  network?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface InvoiceQueryParams {
  page?: number;
  size?: number;
}

export interface VisaInvoiceQueryParams extends InvoiceQueryParams {
  billingPeriod?: string;
  invoiceId?: string;
  csvName?: string;
}

export interface MastercardInvoiceQueryParams extends InvoiceQueryParams {
  startDate?: string;
  endDate?: string;
  invoiceNumber?: string;
  csvName?: string;
}

export interface ConnexionFollowUpQueryParams extends InvoiceQueryParams {
  userName?: string;
  startDate?: string;
  endDate?: string;
  action?: string;
}

export interface UsersListQueryParams extends InvoiceQueryParams {
  userName?: string;
}