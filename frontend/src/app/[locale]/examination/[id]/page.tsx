import { Metadata } from 'next';
import ExaminationDetail from '@/components/Examination/ExaminationDetail';

export const metadata: Metadata = {
  title: 'Examination | LaTEn',
  description: 'Take a language examination',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ExaminationPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <ExaminationDetail id={params.id} />
    </div>
  );
}
