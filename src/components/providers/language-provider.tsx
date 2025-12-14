"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.dealDigest": "DealDigest",
    "nav.tradePlans": "Trade Plans",
    "nav.microResearch": "Micro Research",
    "nav.pricing": "Pricing",
    "nav.community": "Community",
    "nav.login": "Login",
    "nav.signOut": "Sign Out",
    "nav.startFree": "Start Free",
    
    // Hero Section
    "hero.badge": "Smart investment assistant for Vietnamese investors",
    "hero.title": "Understand the Market<br />Secure Your Position",
    "hero.subtitle":
      "In-depth financial analysis platform, your trusted companion supporting you on your sustainable investment journey.",
    "hero.ctaPrimary": "Start Free",
    "hero.ctaSecondary": "View Sample Report",
    "hero.trustedBy": "Trusted by 1000+ investors",
    "hero.investorsCount": "investors trust us",
    "tradePlans.preview.heading": "Your Trade Plans",
    "tradePlans.preview.description": "Quick view of your most recently updated trade plans.",
    "tradePlans.preview.empty": "No trade plans yet. Create one to get started.",
    "tradePlans.preview.viewAll": "View All",
    "tradePlans.search.placeholder": "Search by name or ticker...",
    "tradePlans.filters.strategy": "Strategy Type",
    "tradePlans.filters.status": "Status",
    "tradePlans.filters.market": "Market",
    "tradePlans.filters.risk": "Risk Level",
    "tradePlans.filters.created": "Created",
    "tradePlans.filters.updated": "Updated",
    "tradePlans.list.title": "Structured Trade Plan Library",
    "tradePlans.list.caption":
      "Search and filter every plan you have saved. Use filters to jump between draft, active, or closed ideas.",
    "tradePlans.detail.thesis": "Investment Thesis",
    "tradePlans.detail.notes": "Notes",
    "tradePlans.detail.meta": "Plan Metadata",
    "tradePlans.detail.entry": "Entry",
    "tradePlans.detail.target": "Target",
    "tradePlans.detail.stop": "Stop-loss",
    "tradePlans.detail.status": "Status",
    "tradePlans.detail.actions": "Actions",
    "tradePlans.detail.markClosed": "Mark as Closed",
    "tradePlans.detail.duplicate": "Duplicate",
    "tradePlans.detail.edit": "Edit Plan",
    "tradePlans.detail.delete": "Delete",
    "tradePlans.detail.updated": "Last updated",
    "tradePlans.form.marketPlaceholder": "Stocks / Crypto / ETF / Forex",
    "tradePlans.form.strategyPlaceholder": "Breakout, Swing, Trend Follow...",
    "tradePlans.form.thesisLabel": "Investment Thesis",
    "tradePlans.form.notesLabel": "Notes",
    "tradePlans.form.riskLabel": "Risk Level",
    
    // Value Proposition
    "valueProp.riskAnalysis.title": "3-minute risk-based analysis",
    "valueProp.riskAnalysis.description": "Get comprehensive company analysis in a standardized 1-page format, focusing on risk assessment and decision frameworks.",
    "valueProp.riskAlerts.title": "Data-driven risk alerts",
    "valueProp.riskAlerts.description": "Receive real-time alerts on risk score changes, financial warnings, and market events that could impact your investments.",
    "valueProp.decisionFrameworks.title": "Decision frameworks — not buy/sell tips",
    "valueProp.decisionFrameworks.description": "We provide analytical tools and frameworks to help you make informed decisions, not investment advice or stock recommendations.",
    
    // Features Section
    "features.title": "Platform Features",
    "features.dealDigest.title": "DealDigest",
    "features.dealDigest.description": "Standardized 1-page company analysis with business overview, financial health, growth catalysts, risk factors, and actionable checklists.",
    "features.tradePlan.title": "TradePlan Builder",
    "features.tradePlan.description": "Trading journal, entry/exit planning, risk-reward calculator, position sizing, and performance analytics.",
    "features.microResearch.title": "Micro Research",
    "features.microResearch.description": "Short company research notes published 3-4 times per week, filterable by industry and market cap.",
    
    // Pricing Section
    "pricing.title": "Pricing",
    "pricing.comparison.title": "Feature Comparison",
  },
  vi: {
    // Navigation
    "nav.home": "Trang chủ",
    "nav.dashboard": "Dashboard",
    "nav.dealDigest": "DealDigest",
    "nav.tradePlans": "Trade Plans",
    "nav.microResearch": "Micro Research",
    "nav.pricing": "Pricing",
    "nav.community": "Cộng đồng",
    "nav.login": "Đăng nhập",
    "nav.signOut": "Đăng xuất",
    "nav.startFree": "Bắt đầu miễn phí",
    
    // Hero Section
    "hero.badge": "Trợ lý đầu tư thông minh cho người Việt",
    "hero.title": "Thấu hiểu thị trường<br />Vững vàng vị thế",
    "hero.subtitle":
      "Nền tảng phân tích tài chính chuyên sâu, người bạn đồng hành tin cậy hỗ trợ bạn trên chặng đường đầu tư bền vững.",
    "hero.ctaPrimary": "Bắt đầu miễn phí",
    "hero.ctaSecondary": "Xem báo cáo mẫu",
    "hero.trustedBy": "Được tin dùng bởi 1000+ nhà đầu tư",
    "hero.investorsCount": "nhà đầu tư tin dùng",
    "tradePlans.preview.heading": "Trade Plans của bạn",
    "tradePlans.preview.description": "Xem nhanh các kế hoạch vừa cập nhật gần nhất.",
    "tradePlans.preview.empty": "Chưa có kế hoạch nào. Tạo mới để bắt đầu.",
    "tradePlans.preview.viewAll": "Xem tất cả",
    "tradePlans.search.placeholder": "Tìm theo tên hoặc mã cổ phiếu...",
    "tradePlans.filters.strategy": "Loại chiến lược",
    "tradePlans.filters.status": "Trạng thái",
    "tradePlans.filters.market": "Thị trường",
    "tradePlans.filters.risk": "Mức rủi ro",
    "tradePlans.filters.created": "Ngày tạo",
    "tradePlans.filters.updated": "Ngày cập nhật",
    "tradePlans.list.title": "Thư viện Trade Plan có cấu trúc",
    "tradePlans.list.caption":
      "Tìm kiếm và lọc toàn bộ kế hoạch đã lưu. Dùng bộ lọc để chuyển nhanh giữa Draft, Active hoặc Closed.",
    "tradePlans.detail.thesis": "Luận điểm đầu tư",
    "tradePlans.detail.notes": "Ghi chú",
    "tradePlans.detail.meta": "Thông tin kế hoạch",
    "tradePlans.detail.entry": "Điểm vào",
    "tradePlans.detail.target": "Mục tiêu",
    "tradePlans.detail.stop": "Cắt lỗ",
    "tradePlans.detail.status": "Trạng thái",
    "tradePlans.detail.actions": "Tác vụ",
    "tradePlans.detail.markClosed": "Đánh dấu Closed",
    "tradePlans.detail.duplicate": "Nhân bản",
    "tradePlans.detail.edit": "Chỉnh sửa",
    "tradePlans.detail.delete": "Xóa",
    "tradePlans.detail.updated": "Cập nhật lần cuối",
    "tradePlans.form.marketPlaceholder": "Cổ phiếu / Crypto / ETF / Forex",
    "tradePlans.form.strategyPlaceholder": "Breakout, Swing, Trend Follow...",
    "tradePlans.form.thesisLabel": "Luận điểm đầu tư",
    "tradePlans.form.notesLabel": "Ghi chú",
    "tradePlans.form.riskLabel": "Mức rủi ro",
    
    // Value Proposition
    "valueProp.riskAnalysis.title": "Phân tích rủi ro 3 phút",
    "valueProp.riskAnalysis.description": "Nhận phân tích công ty toàn diện trong định dạng 1 trang chuẩn hóa, tập trung vào đánh giá rủi ro và khung quyết định.",
    "valueProp.riskAlerts.title": "Cảnh báo rủi ro dựa trên dữ liệu",
    "valueProp.riskAlerts.description": "Nhận cảnh báo thời gian thực về thay đổi điểm rủi ro, cảnh báo tài chính và sự kiện thị trường có thể ảnh hưởng đến khoản đầu tư của bạn.",
    "valueProp.decisionFrameworks.title": "Khung quyết định — không phải lời khuyên mua/bán",
    "valueProp.decisionFrameworks.description": "Chúng tôi cung cấp công cụ và khung phân tích để giúp bạn đưa ra quyết định sáng suốt, không phải lời khuyên đầu tư hay khuyến nghị cổ phiếu.",
    
    // Features Section
    "features.title": "Tính năng Nền tảng",
    "features.dealDigest.title": "DealDigest",
    "features.dealDigest.description": "Phân tích công ty chuẩn hóa 1 trang với tổng quan kinh doanh, sức khỏe tài chính, động lực tăng trưởng, yếu tố rủi ro và danh sách kiểm tra hành động.",
    "features.tradePlan.title": "TradePlan Builder",
    "features.tradePlan.description": "Nhật ký giao dịch, lập kế hoạch vào/ra, máy tính rủi ro-lợi nhuận, quy mô vị thế và phân tích hiệu suất.",
    "features.microResearch.title": "Micro Research",
    "features.microResearch.description": "Ghi chú nghiên cứu công ty ngắn được xuất bản 3-4 lần mỗi tuần, có thể lọc theo ngành và vốn hóa thị trường.",
    
    // Pricing Section
    "pricing.title": "Bảng Giá",
    "pricing.comparison.title": "So sánh Tính năng",
  },
} as const;

type Language = "vi" | "en";

type TranslationKey = keyof (typeof translations)["en"];

interface LanguageContextValue {
  language: Language;
  setLanguage: (_language: Language) => void;
  t: (_key: TranslationKey, _fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "vi",
  setLanguage: () => undefined,
  t: (key) => translations.en[key],
});

const STORAGE_KEY = "hawkeye-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "vi" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (lang: Language) => setLanguageState(lang),
      t: (key: TranslationKey, fallback?: string) => {
        const table = translations[language];
        return table?.[key] ?? translations.en[key] ?? fallback ?? key;
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const languageOptions: { value: Language; label: string }[] = [
  { value: "vi", label: "VI" },
  { value: "en", label: "EN" },
];

export type { TranslationKey };

