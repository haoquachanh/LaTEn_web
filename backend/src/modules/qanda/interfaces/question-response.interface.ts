export interface AuthorResponse {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

export interface TagResponse {
  id: number;
  name: string;
}

export interface AnswerResponse {
  id: number;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorResponse;
}

export interface QuestionResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  isAnswered: boolean;
  acceptedAnswerId?: number;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorResponse;
  tags: TagResponse[];
  answerCount: number;
  topAnswer?: AnswerResponse | null;
}

export interface QuestionDetailResponse extends QuestionResponse {
  answers: AnswerResponse[];
}
