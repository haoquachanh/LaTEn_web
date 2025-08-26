export interface PostResponse {
  id: number;
  title: string;
  content: string;
  fullContent?: string;
  imageUrl?: string;
  type: string;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    fullname: string;
    username: string;
    email: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
  commentCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface PostDetailResponse extends PostResponse {
  isLikedByCurrentUser?: boolean;
  comments: Array<{
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: number;
      fullname: string;
      username: string;
      email: string;
    };
    replies?: Array<{
      id: number;
      content: string;
      createdAt: Date;
      author: {
        id: number;
        fullname: string;
        username: string;
        email: string;
      };
    }>;
  }>;
}
