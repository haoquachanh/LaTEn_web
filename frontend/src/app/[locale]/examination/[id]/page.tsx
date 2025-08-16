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
    <div className="min-h-screen bg-base-100">
      <div className="py-8">
        <div className="container mx-auto px-4">
          <ExaminationDetail id={params.id} />
        </div>
      </div>
    </div>
  );
}
