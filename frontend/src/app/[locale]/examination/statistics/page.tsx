import { Metadata } from 'next';
import StatisticsContent from '@/components/Examination/Statistics/StatisticsContent';

export const metadata: Metadata = {
  title: 'My Examination Statistics | LaTEn',
  description: 'View your personal examination statistics and progress',
};

export default function StatisticsPage() {
  return (
    <div className="container mx-auto p-4">
      <StatisticsContent />
    </div>
  );
}
