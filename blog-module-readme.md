# Hướng dẫn sử dụng Blog/Post Module

## Cài đặt

### 1. Cài đặt dependencies

```bash
# Cài đặt TinyMCE React và các dependencies liên quan
npm install @tinymce/tinymce-react tinymce

# Hoặc dùng file package.json đã cung cấp
npm install --save $(cat blog-extensions.json | jq -r '.dependencies | to_entries | map("\(.key)@\(.value)") | join(" ")')
```

### 2. Cấu hình TinyMCE API key

Đăng ký API key miễn phí tại: https://www.tiny.cloud/

Sau đó cập nhật lại apiKey trong file `frontend/src/components/Editor/RichTextEditor.tsx`:

```tsx
<Editor
  apiKey="your-api-key-from-tiny-cloud" 
  ...
/>
```

## Các chức năng chính

### 1. Trang danh sách bài viết
- Path: `/community/posts`
- Hiển thị danh sách bài viết với phân trang
- Hỗ trợ lọc theo tag

### 2. Trang chi tiết bài viết
- Path: `/community/posts/[id]`
- Hiển thị nội dung đầy đủ của bài viết (fullContent)
- Hỗ trợ xem và thêm bình luận, trả lời

### 3. Trang tạo/chỉnh sửa bài viết
- Path: `/community/posts/create` (tạo mới)
- Path: `/community/posts/edit/[id]` (chỉnh sửa)
- Tích hợp rich text editor (TinyMCE)
- Hỗ trợ thêm tag, ảnh bìa
- Xem trước bài viết trước khi đăng

## Cấu trúc API

### Backend API
- `POST /api/posts`: Tạo bài viết mới
- `GET /api/posts`: Lấy danh sách bài viết
- `GET /api/posts/:id`: Lấy chi tiết bài viết
- `PUT /api/posts/:id`: Cập nhật bài viết
- `DELETE /api/posts/:id`: Xóa bài viết
- `POST /api/posts/:id/comments`: Thêm bình luận
- `POST /api/comments/:id/replies`: Thêm trả lời cho bình luận

### Frontend API (middleware)
- `POST /api/posts`: Proxy tạo bài viết mới
- `GET /api/posts`: Proxy lấy danh sách bài viết
- `GET /api/posts/:id`: Proxy lấy chi tiết bài viết
- `PUT /api/posts/:id`: Proxy cập nhật bài viết

## Cấu trúc dữ liệu

### Post entity
```typescript
{
  id: number;
  title: string;
  content: string; // Nội dung ngắn cho trang danh sách
  fullContent: string; // Nội dung đầy đủ với HTML
  imageUrl: string; // URL ảnh bìa
  type: PostType; // 'regular' | 'question'
  likes: number;
  views: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  author: User;
  tags: PostTag[];
  comments: Comment[];
}
```

## Các lưu ý quan trọng

1. **Xử lý hình ảnh**: Cần triển khai logic upload hình ảnh trong RichTextEditor.tsx
2. **Bảo mật**: Luôn kiểm tra quyền người dùng trước khi cho phép sửa/xóa bài viết
3. **SEO**: Có thể bổ sung metadata cho trang chi tiết bài viết
4. **Hiệu suất**: Sử dụng kỹ thuật phân trang cho comments và related posts