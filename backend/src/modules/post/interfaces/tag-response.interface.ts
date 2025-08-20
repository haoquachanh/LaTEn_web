export interface TagResponse {
  id: number;
  name: string;
  description?: string;
  postCount?: number;
}

export interface PaginatedTagsResponse {
  items: TagResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
