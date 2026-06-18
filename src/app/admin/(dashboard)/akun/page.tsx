import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/components/admin';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  console.log('Session:', session);
  console.log('Session User ID:', session?.user?.id);

  const adminClient = createAdminClient();

  // Test: select all columns like auth.ts does
  const { data: user, error: userError } = await adminClient
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  console.log('User from DB:', user);
  console.log('DB Error:', userError);

  // Also test: query by username instead
  const { data: userByUsername } = await adminClient
    .from('users')
    .select('*')
    .eq('username', session.user.username)
    .single();

  console.log('User by username:', userByUsername);

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
      <ProfileClient userId={session.user.id} initialUser={user} />
    </div>
  );
}
