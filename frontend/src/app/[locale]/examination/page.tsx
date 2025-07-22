import { Metadata } from 'next';
import ExaminationContent from '@/components/Examination/Examination';

export const metadata: Metadata = {
  title: 'All Examinations | LaTEn',
  description: 'Browse all available language examinations',
};

export default function ExaminationsPage() {
  return <ExaminationContent />;
}
