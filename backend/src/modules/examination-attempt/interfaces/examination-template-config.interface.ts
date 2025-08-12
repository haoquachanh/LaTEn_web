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
}
