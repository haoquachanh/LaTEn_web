import { Metadata } from 'next';
import ExaminationListPage from '@/components/Examination/ExaminationListPage';

export const metadata: Metadata = {
  title: 'All Examinations | LaTEn',
  description: 'Browse all available language examinations',
};

export default function ExaminationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Language Examinations</h1>
      <ExaminationListPage />
    </div>
  );
}
