import { Metadata } from 'next';
import ExaminationContent from '@/components/Examination/Examination';
import ExamPageScrollControl from './scrollControl';

export const metadata: Metadata = {
  title: 'All Examinations | LaTEn',
  description: 'Browse all available language examinations',
};

export default function ExaminationsPage() {
  return (
    <>
      <ExamPageScrollControl />
      <div className="min-h-screen bg-base-100 flex flex-col examination-page">
        <div className="pt-5 pb-8 flex-grow overflow-hidden">
          <div className="container mx-auto px-4 h-full overflow-hidden">
            <ExaminationContent />
          </div>
        </div>
      </div>
    </>
  );
}
