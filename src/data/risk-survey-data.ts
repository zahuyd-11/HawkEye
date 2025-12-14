/**
 * Risk Appetite Survey Questions and Scoring Logic
 * Total Score Range: 10 - 40 points
 */

export interface SurveyQuestion {
  id: string;
  question: string;
  description?: string;
  options: Array<{
    label: string;
    value: string;
    score: number;
    description?: string;
  }>;
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "age",
    question: "Bạn ở độ tuổi nào?",
    description: "Tuổi tác ảnh hưởng đến khả năng chấp nhận rủi ro",
    options: [
      { label: "Dưới 30 tuổi", value: "under_30", score: 4, description: "Thời gian dài để phục hồi từ rủi ro" },
      { label: "30 - 45 tuổi", value: "30_45", score: 3, description: "Thời gian trung bình, cân bằng rủi ro" },
      { label: "45 - 60 tuổi", value: "45_60", score: 2, description: "Cần bảo toàn vốn nhiều hơn" },
      { label: "Trên 60 tuổi", value: "over_60", score: 1, description: "Ưu tiên bảo toàn vốn" },
    ],
  },
  {
    id: "investment_goal",
    question: "Mục tiêu đầu tư chính của bạn là gì?",
    description: "Mục tiêu quyết định chiến lược phù hợp",
    options: [
      { label: "Lợi nhuận nhanh", value: "quick_profit", score: 4, description: "Tìm kiếm cơ hội ngắn hạn" },
      { label: "Tăng trưởng dài hạn", value: "growth", score: 3, description: "Xây dựng tài sản theo thời gian" },
      { label: "Thu nhập/Cổ tức", value: "income", score: 2, description: "Tạo dòng tiền đều đặn" },
      { label: "Bảo toàn vốn", value: "preservation", score: 1, description: "Giữ vốn an toàn là ưu tiên" },
    ],
  },
  {
    id: "market_crash",
    question: "Nếu danh mục của bạn giảm 20% trong 1 tuần, bạn sẽ làm gì?",
    description: "Phản ứng với biến động thị trường",
    options: [
      { label: "Mua thêm (Cơ hội tích lũy)", value: "buy_more", score: 4, description: "Chấp nhận rủi ro cao" },
      { label: "Giữ nguyên (Chờ phục hồi)", value: "hold", score: 3, description: "Kiên nhẫn, chấp nhận rủi ro trung bình" },
      { label: "Bán một nửa (Cắt lỗ một phần)", value: "sell_half", score: 2, description: "Thận trọng, giảm rủi ro" },
      { label: "Bán hết (Thoát khỏi thị trường)", value: "sell_all", score: 1, description: "Không chấp nhận rủi ro" },
    ],
  },
  {
    id: "experience",
    question: "Kinh nghiệm đầu tư của bạn?",
    description: "Kinh nghiệm ảnh hưởng đến khả năng quản lý rủi ro",
    options: [
      { label: "Trên 3 năm", value: "expert", score: 4, description: "Hiểu rõ thị trường và rủi ro" },
      { label: "1 - 3 năm", value: "intermediate", score: 3, description: "Có kinh nghiệm cơ bản" },
      { label: "Dưới 1 năm", value: "beginner", score: 2, description: "Đang học hỏi" },
      { label: "Mới bắt đầu", value: "newbie", score: 1, description: "Cần hướng dẫn chi tiết" },
    ],
  },
  {
    id: "capital_source",
    question: "Nguồn vốn đầu tư của bạn?",
    description: "Nguồn vốn quyết định mức độ áp lực",
    options: [
      { label: "Tiền nhàn rỗi / Không áp lực", value: "idle_money", score: 4, description: "Có thể chấp nhận rủi ro cao" },
      { label: "Tiết kiệm từ lương", value: "salary", score: 3, description: "Áp lực trung bình" },
      { label: "Tiết kiệm ngắn hạn", value: "short_term", score: 2, description: "Cần thận trọng hơn" },
      { label: "Vay mượn / Margin", value: "loan", score: 1, description: "Rủi ro rất cao, không khuyến nghị" },
    ],
  },
  {
    id: "time_horizon",
    question: "Thời gian đầu tư dự kiến?",
    description: "Thời gian càng dài, khả năng chấp nhận rủi ro càng cao",
    options: [
      { label: "Trên 5 năm", value: "long_term", score: 4, description: "Có thể đầu tư tăng trưởng mạnh" },
      { label: "3 - 5 năm", value: "medium_term", score: 3, description: "Cân bằng tăng trưởng và ổn định" },
      { label: "1 - 3 năm", value: "short_term", score: 2, description: "Cần thận trọng hơn" },
      { label: "Dưới 1 năm", value: "very_short", score: 1, description: "Ưu tiên bảo toàn vốn" },
    ],
  },
  {
    id: "loss_tolerance",
    question: "Bạn có thể chấp nhận mất bao nhiêu % vốn trong 1 năm?",
    description: "Khả năng chịu đựng thua lỗ",
    options: [
      { label: "Trên 20%", value: "high_tolerance", score: 4, description: "Chấp nhận rủi ro cao" },
      { label: "10 - 20%", value: "medium_high", score: 3, description: "Chấp nhận rủi ro trung bình-cao" },
      { label: "5 - 10%", value: "medium", score: 2, description: "Chấp nhận rủi ro trung bình" },
      { label: "Dưới 5%", value: "low_tolerance", score: 1, description: "Rủi ro thấp, bảo toàn vốn" },
    ],
  },
  {
    id: "portfolio_size",
    question: "Quy mô danh mục đầu tư dự kiến?",
    description: "Quy mô ảnh hưởng đến chiến lược phân bổ",
    options: [
      { label: "Trên 5 tỷ VND", value: "large", score: 4, description: "Có thể đa dạng hóa mạnh" },
      { label: "1 - 5 tỷ VND", value: "medium_large", score: 3, description: "Đa dạng hóa tốt" },
      { label: "100 triệu - 1 tỷ VND", value: "medium", score: 2, description: "Tập trung vào cổ phiếu chính" },
      { label: "Dưới 100 triệu VND", value: "small", score: 1, description: "Tập trung vào cổ phiếu bluechip" },
    ],
  },
  {
    id: "market_volatility",
    question: "Bạn cảm thấy thế nào về biến động giá cổ phiếu?",
    description: "Thái độ với biến động thị trường",
    options: [
      { label: "Thoải mái, đây là cơ hội", value: "comfortable", score: 4, description: "Chấp nhận biến động cao" },
      { label: "Chấp nhận được nếu có lý do", value: "acceptable", score: 3, description: "Chấp nhận biến động trung bình" },
      { label: "Hơi lo lắng nhưng vẫn đầu tư", value: "worried", score: 2, description: "Thích ổn định hơn" },
      { label: "Rất lo lắng, muốn tránh biến động", value: "very_worried", score: 1, description: "Ưu tiên ổn định" },
    ],
  },
  {
    id: "investment_knowledge",
    question: "Mức độ hiểu biết về đầu tư chứng khoán?",
    description: "Kiến thức ảnh hưởng đến khả năng quản lý rủi ro",
    options: [
      { label: "Rất am hiểu (Đọc báo cáo tài chính)", value: "expert", score: 4, description: "Có thể tự phân tích" },
      { label: "Khá hiểu (Biết P/E, P/B cơ bản)", value: "good", score: 3, description: "Có kiến thức cơ bản" },
      { label: "Hiểu ít (Chỉ biết mua/bán)", value: "basic", score: 2, description: "Cần hướng dẫn nhiều" },
      { label: "Mới tìm hiểu", value: "beginner", score: 1, description: "Cần hướng dẫn chi tiết" },
    ],
  },
];

/**
 * Calculate total score from answers
 */
export function calculateSurveyScore(answers: Record<string, string>): number {
  let totalScore = 0;

  surveyQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer) {
      const option = question.options.find((opt) => opt.value === answer);
      if (option) {
        totalScore += option.score;
      }
    }
  });

  return totalScore;
}

/**
 * Get question by ID
 */
export function getQuestionById(id: string): SurveyQuestion | undefined {
  return surveyQuestions.find((q) => q.id === id);
}

