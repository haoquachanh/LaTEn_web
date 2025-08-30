import React, { useState } from 'react';

const IconX: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import { toast } from 'react-hot-toast';
import { qandaService } from '@/services/api/qanda.service';

interface AnswerFormProps {
  questionId: number;
  questionTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ questionId, questionTitle, isOpen, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung câu trả lời');
      return;
    }

    setIsSubmitting(true);
    try {
      await qandaService.addAnswer(questionId, { content: content.trim() });
      toast.success('Đã trả lời câu hỏi thành công!');
      setContent('');
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Failed to submit answer:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi câu trả lời. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-lg">Trả lời câu hỏi</h3>
            <p className="text-sm text-base-content/70 mt-1 line-clamp-2">{questionTitle}</p>
          </div>
          <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost" disabled={isSubmitting}>
            <IconX size={20} />
          </button>
        </div>

        {/* Answer Content */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Nội dung câu trả lời</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-40 resize-none"
            placeholder="Nhập câu trả lời của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          <label className="label">
            <span className="label-text-alt text-base-content/70">{content.length} ký tự</span>
          </label>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-ghost" disabled={isSubmitting}>
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi câu trả lời'}
          </button>
        </div>
      </div>
    </div>
  );
};
