import { getSession } from '@/lib/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/components/admin';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.id) {
    redirect('/admin/login');
  }

  const adminClient = createAdminClient();

  const { data: user } = await adminClient
    .from('users')
    .select('*')
    .eq('id', session.id)
    .single();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase mb-2'>
          Edit Akun
        </h1>
        <p className='text-text-secondary font-[var(--font-label-technical)] text-[var(--font-size-label-technical)]'>
          Kelola informasi akun dan ubah password Anda
        </p>
      </div>

      {/* Profile Form */}
      <ProfileClient userId={session.id} initialUser={user} />
    </div>
  );
}
