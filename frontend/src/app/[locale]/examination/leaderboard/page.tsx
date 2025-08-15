import { Metadata } from 'next';
import LeaderboardContent from '@/components/Examination/Leaderboard/LeaderboardContent';

export const metadata: Metadata = {
  title: 'Examination Leaderboard | LaTEn',
  description: 'View top scores and rankings on language examinations',
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto p-4">
      <LeaderboardContent />
    </div>
  );
}