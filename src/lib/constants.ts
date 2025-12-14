export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: "Free",
    price: 0,
    reportsPerMonth: 1,
    dealDigestAccess: "limited",
    tradePlanFeatures: "basic",
    microResearchAccess: "1 VN30 per quarter",
    riskAlerts: false,
    prioritySupport: false,
  },
  PLUS: {
    name: "Plus",
    price: 249000,
    priceYearly: 2490000,
    reportsPerMonth: 5,
    dealDigestAccess: "full",
    tradePlanFeatures: "standard",
    microResearchAccess: "full library",
    riskAlerts: true,
    prioritySupport: false,
  },
  PRO: {
    name: "Pro",
    price: 499000,
    priceYearly: 4990000,
    reportsPerMonth: "unlimited",
    dealDigestAccess: "full",
    tradePlanFeatures: "advanced",
    microResearchAccess: "full + 1-2 requests/quarter",
    riskAlerts: true,
    prioritySupport: true,
  },
} as const;

export const VIETNAM_INDUSTRIES = {
  "Real Estate": {
    "Residential Real Estate": [],
    "Commercial Real Estate": [],
    "Real Estate Development": [],
  },
  Banking: {
    "Commercial Banks": [],
    "Investment Banks": [],
  },
  Securities: {
    "Securities Trading": [],
    "Securities Services": [],
  },
  Insurance: {
    "Life Insurance": [],
    "Non-Life Insurance": [],
  },
  Chemicals: {
    "Basic Chemicals": [],
    "Specialty Chemicals": [],
  },
  Steel: {
    "Steel Production": [],
    "Steel Trading": [],
  },
  "Construction Materials": {
    "Cement": [],
    "Construction Materials": [],
  },
  "Oil & Gas": {
    "Oil Exploration": [],
    "Oil Refining": [],
    "Gas Distribution": [],
  },
  "Energy / Electricity": {
    "Power Generation": [],
    "Power Distribution": [],
    "Renewable Energy": [],
  },
  "Consumer Goods": {
    "Fast Moving Consumer Goods": [],
    "Consumer Durables": [],
  },
  Technology: {
    "Software": [],
    "IT Services": [],
    "Hardware": [],
  },
  Retail: {
    "Retail Chains": [],
    "E-commerce": [],
  },
  Healthcare: {
    "Pharmaceuticals": [],
    "Medical Services": [],
    "Medical Equipment": [],
  },
  Logistics: {
    "Shipping": [],
    "Warehousing": [],
    "Freight Forwarding": [],
  },
  "Food & Beverage": {
    "Food Processing": [],
    "Beverages": [],
    "Restaurants": [],
  },
  "Industrial Manufacturing": {
    "Machinery": [],
    "Industrial Equipment": [],
  },
  Telecommunications: {
    "Telecom Services": [],
    "Telecom Equipment": [],
  },
  "Household Goods": {
    "Home Appliances": [],
    "Furniture": [],
  },
  "Automotive & Components": {
    "Automotive Manufacturing": [],
    "Auto Parts": [],
  },
  Rubber: {
    "Rubber Production": [],
    "Rubber Products": [],
  },
  Fisheries: {
    "Fishing": [],
    "Aquaculture": [],
    "Seafood Processing": [],
  },
  "Textiles & Garments": {
    "Textile Manufacturing": [],
    "Garment Production": [],
  },
  Fertilizers: {
    "Fertilizer Production": [],
  },
  Infrastructure: {
    "Infrastructure Development": [],
    "Public Works": [],
  },
  "Media & Entertainment": {
    "Broadcasting": [],
    "Publishing": [],
    "Entertainment": [],
  },
} as const;

export const MARKET_CAP_RANGES = [
  "Micro (< 1,000 tỷ VND)",
  "Small (1,000 - 5,000 tỷ VND)",
  "Mid (5,000 - 20,000 tỷ VND)",
  "Large (20,000 - 50,000 tỷ VND)",
  "Mega (> 50,000 tỷ VND)",
] as const;

export const VN30_TICKERS = [
  "VCB", "VIC", "VHM", "VRE", "MSN", "HPG", "VNM", "TCB", "CTG", "BID",
  "VPB", "MBB", "ACB", "TPB", "STB", "VJC", "FPT", "MWG", "VGC", "GAS",
  "PLX", "POW", "SSI", "VCI", "VSH", "VHC", "VPB", "HDB", "SHB", "EIB"
] as const;

