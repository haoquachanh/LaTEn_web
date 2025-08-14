'use client';

import { Metadata } from 'next';
import ExaminationTake from '@/components/Examination/ExaminationTake';

export const metadata: Metadata = {
  title: 'Take Examination | LaTEn',
  description: 'Taking a language examination',
};

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
