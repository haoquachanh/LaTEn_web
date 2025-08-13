// Định nghĩa interface cho cấu hình template
export interface ExaminationTemplateConfig {
  questionIds?: number[];
  randomize?: boolean;
  showCorrectAnswers?: boolean;
  passingScore?: number;
  categoriesDistribution?: {
    categoryId: number;
    count: number;
  }[];

  // Cấu hình mới cho hiển thị kết quả
  resultDisplay?: {
    showImmediately?: boolean; // Hiển thị kết quả ngay sau khi nộp
    showCorrectAnswers?: boolean; // Hiển thị đáp án đúng hay không
    showExplanation?: boolean; // Hiển thị giải thích đáp án
    showScoreBreakdown?: boolean; // Hiển thị điểm chi tiết từng câu
  };

  // Cấu hình bảo mật khi làm bài
  security?: {
    preventCopy?: boolean; // Ngăn copy-paste
    preventTabSwitch?: boolean; // Phát hiện chuyển tab
    timeoutWarning?: number; // Cảnh báo khi sắp hết giờ (phút)
    shuffleOptions?: boolean; // Xáo trộn thứ tự các lựa chọn
  };

  // Bộ lọc câu hỏi
  questionFilters?: {
    categories?: number[];
    difficultyLevels?: string[];
    types?: string[];
  };
}
