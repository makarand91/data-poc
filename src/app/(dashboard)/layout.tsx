import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { getCurrentUserId, } from '@/lib/auth';
import { getUserById } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  const user = getUserById(userId);
  if (!user) redirect('/login');

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar credits={user.credits} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
