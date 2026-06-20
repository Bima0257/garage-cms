import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { settingsSchema } from '@/lib/validations/settings';
import { requireAuth } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request) {
  try {
    if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json();
    const validated = settingsSchema.parse(body);

    const adminClient = createAdminClient();

    const { data: existing } = (await adminClient
      .from('abouts')
      .select('id')
      .limit(1)
      .single()) as { data: { id: number } | null; error: unknown };

    let error;
    if (existing) {
      const result = await adminClient
        .from('abouts')
        .update(validated as never)
        .eq('id', existing.id)
        .select();
      error = result.error;
    } else {
      const result = await adminClient
        .from('abouts')
        .insert([validated] as never)
        .select();
      error = result.error;
    }

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/tentang');
    revalidatePath('/kontak');
    revalidatePath('/admin/pengaturan');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 },
    );
  }
}
