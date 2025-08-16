'use client';

import ExaminationTake from '@/components/Examination/ExaminationTake';

// Metadata phải được định nghĩa trong file layout.tsx hoặc một file riêng không có 'use client'
// hoặc sử dụng một phương pháp khác để đặt tiêu đề trang

interface PageProps {
  params: {
    id: string;
  };
}

export default function TakeExaminationPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-4 px-2">
      <ExaminationTake id={params.id} />
    </div>
  );
}
