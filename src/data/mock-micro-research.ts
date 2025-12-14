export interface MicroResearchItem {
  id: string;
  title: string;
  ticker: string | null;
  companyName: string | null;
  sector: string | null;
  industry: string | null;
  marketCap: string | null;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
}

export const mockMicroResearch: MicroResearchItem[] = [
  {
    id: "1",
    title: "FPT ký hợp đồng 50 triệu USD với khách hàng Nhật Bản",
    ticker: "FPT",
    companyName: "FPT Corporation",
    sector: "Technology",
    industry: "Software",
    marketCap: "Large (20,000 - 50,000 tỷ VND)",
    excerpt: "FPT vừa công bố hợp đồng outsourcing lớn với tập đoàn công nghệ Nhật Bản, dự kiến tăng doanh thu 2024 thêm 8%...",
    content: "FPT Corporation (FPT) vừa ký kết hợp đồng cung cấp dịch vụ IT outsourcing trị giá 50 triệu USD với một tập đoàn công nghệ hàng đầu Nhật Bản. Hợp đồng có thời hạn 3 năm và sẽ bắt đầu triển khai từ quý 2/2024.\n\nĐây là một trong những hợp đồng lớn nhất của FPT tại thị trường Nhật Bản, củng cố vị thế của công ty trong lĩnh vực nearshore outsourcing. Dự kiến hợp đồng này sẽ đóng góp khoảng 8% vào tổng doanh thu của FPT trong năm 2024.\n\nPhân tích:\n- Tăng trưởng doanh thu ổn định từ thị trường quốc tế\n- Tỷ suất lợi nhuận từ outsourcing cao hơn thị trường nội địa\n- Rủi ro: Phụ thuộc vào một số khách hàng lớn",
    tags: ["Technology", "Outsourcing", "Japan"],
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "VCB công bố lợi nhuận quý 4 tăng 12%",
    ticker: "VCB",
    companyName: "Vietcombank",
    sector: "Banking",
    industry: "Commercial Banks",
    marketCap: "Mega (> 50,000 tỷ VND)",
    excerpt: "Vietcombank báo cáo lợi nhuận quý 4/2023 đạt 8.500 tỷ đồng, tăng 12% so với cùng kỳ năm trước...",
    content: "Vietcombank (VCB) vừa công bố kết quả kinh doanh quý 4/2023 với lợi nhuận sau thuế đạt 8.500 tỷ đồng, tăng 12% so với cùng kỳ năm 2022. Tổng lợi nhuận cả năm 2023 đạt 32.000 tỷ đồng.\n\nĐiểm nổi bật:\n- Tăng trưởng tín dụng 15% trong năm 2023\n- Tỷ lệ NPL giảm xuống 0.8% (thấp nhất ngành)\n- ROE đạt 22.5%, cao hơn mức trung bình ngành\n- Cổ tức dự kiến 25% (cao hơn năm trước)\n\nTriển vọng 2024:\n- Ngân hàng dự kiến tăng trưởng tín dụng 12-15%\n- Tập trung vào cho vay bất động sản và doanh nghiệp vừa và nhỏ\n- Mở rộng dịch vụ số và fintech",
    tags: ["Banking", "Earnings", "Dividend"],
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Thị trường bất động sản: Dấu hiệu phục hồi từ quý 1/2024",
    ticker: null,
    companyName: null,
    sector: "Real Estate",
    industry: "Real Estate Development",
    marketCap: null,
    excerpt: "Số liệu từ Hiệp hội Bất động sản cho thấy giao dịch nhà ở tăng 18% trong quý 1/2024 so với quý trước...",
    content: "Theo báo cáo mới nhất từ Hiệp hội Bất động sản Việt Nam, thị trường bất động sản đang có dấu hiệu phục hồi rõ rệt trong quý 1/2024.\n\nSố liệu chính:\n- Giao dịch nhà ở tăng 18% so với quý 4/2023\n- Giá nhà ở trung tâm TP.HCM và Hà Nội ổn định\n- Nguồn cung mới tăng 25% so với cùng kỳ\n\nPhân tích:\n- Chính sách hỗ trợ của Chính phủ bắt đầu có hiệu quả\n- Lãi suất cho vay giảm tạo điều kiện cho người mua nhà\n- Rủi ro: Nợ xấu bất động sản vẫn ở mức cao\n\nCác cổ phiếu có thể hưởng lợi: VIC, VHM, VRE, NVL",
    tags: ["Real Estate", "Market Analysis", "Recovery"],
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    title: "HPG: Giá thép phục hồi hỗ trợ lợi nhuận",
    ticker: "HPG",
    companyName: "Hoa Phat Group",
    sector: "Steel",
    industry: "Steel Production",
    marketCap: "Large (20,000 - 50,000 tỷ VND)",
    excerpt: "Giá thép xây dựng tăng 5% trong tháng 3, hỗ trợ biên lợi nhuận của Hoa Phat Group...",
    content: "Giá thép xây dựng trong nước đã tăng 5% trong tháng 3/2024, đạt mức 14.500 VNĐ/kg. Đây là mức tăng đầu tiên sau 6 tháng giảm liên tiếp.\n\nNguyên nhân:\n- Nhu cầu xây dựng tăng trở lại sau Tết Nguyên Đán\n- Giá nguyên liệu đầu vào (quặng sắt, than cốc) tăng\n- Chính sách kích thích đầu tư công của Chính phủ\n\nTác động đến HPG:\n- Biên lợi nhuận gộp dự kiến cải thiện từ 12% lên 15%\n- Sản lượng tiêu thụ tăng 10% so với quý trước\n- Lợi nhuận quý 1/2024 có thể tăng 20-25% so với quý 4/2023",
    tags: ["Steel", "Commodities", "Earnings"],
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    title: "VNM công bố kế hoạch mở rộng sang thị trường Đông Nam Á",
    ticker: "VNM",
    companyName: "Vinamilk",
    sector: "Consumer Goods",
    industry: "Fast Moving Consumer Goods",
    marketCap: "Large (20,000 - 50,000 tỷ VND)",
    excerpt: "Vinamilk sẽ đầu tư 500 triệu USD để mở rộng sản xuất và phân phối tại các thị trường Campuchia, Lào, Myanmar...",
    content: "Vinamilk (VNM) vừa công bố kế hoạch đầu tư 500 triệu USD trong 3 năm tới để mở rộng hoạt động tại thị trường Đông Nam Á.\n\nKế hoạch bao gồm:\n- Xây dựng nhà máy sản xuất tại Campuchia (100 triệu USD)\n- Mở rộng mạng lưới phân phối tại Lào và Myanmar\n- Phát triển sản phẩm phù hợp với thị hiếu địa phương\n\nTriển vọng:\n- Doanh thu từ thị trường quốc tế dự kiến tăng từ 15% lên 25% tổng doanh thu\n- Thị trường Đông Nam Á có tiềm năng lớn với dân số trẻ và thu nhập tăng\n- Rủi ro: Cạnh tranh với các thương hiệu địa phương và quốc tế",
    tags: ["FMCG", "Expansion", "Southeast Asia"],
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

