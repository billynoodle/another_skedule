import { supabase } from './client';
import { log, error } from '../../utils/logger';
import { TagPattern } from '../../types/tagPattern';

export async function getTagPatterns(documentId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error: err } = await supabase
      .from('tag_patterns')
      .select('*')
      .eq('document_id', documentId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (err) throw err;
    log('TagPatternsService', 'Retrieved patterns', { count: data?.length });
    return data;
  } catch (err) {
    error('TagPatternsService', 'Failed to get patterns', err);
    throw err;
  }
}

export async function createTagPattern(documentId: string, pattern: Omit<TagPattern, 'id' | 'documentId'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Normalize prefix to uppercase
    const normalizedPrefix = pattern.prefix.trim().toUpperCase();

    const { data, error: err } = await supabase
      .from('tag_patterns')
      .insert({
        document_id: documentId,
        prefix: normalizedPrefix,
        description: pattern.description,
        schedule_table: pattern.scheduleTable,
        user_id: user.id
      })
      .select()
      .single();

    if (err) {
      if (err.code === '23505') {
        throw new Error(`Pattern with prefix "${normalizedPrefix}" already exists for this document`);
      }
      throw err;
    }

    log('TagPatternsService', 'Created pattern', { id: data?.id });
    return data;
  } catch (err) {
    error('TagPatternsService', 'Failed to create pattern', err);
    throw err;
  }
}

export async function updateTagPattern(id: string, updates: Partial<TagPattern>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Normalize prefix if it's being updated
    const updateData = {
      ...updates,
      ...(updates.prefix && { prefix: updates.prefix.trim().toUpperCase() })
    };

    const { data, error: err } = await supabase
      .from('tag_patterns')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (err) {
      if (err.code === '23505') {
        throw new Error(`Pattern with this prefix already exists for this document`);
      }
      throw err;
    }

    log('TagPatternsService', 'Updated pattern', { id });
    return data;
  } catch (err) {
    error('TagPatternsService', 'Failed to update pattern', err);
    throw err;
  }
}

export async function deleteTagPattern(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { error: err } = await supabase
      .from('tag_patterns')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (err) throw err;
    log('TagPatternsService', 'Deleted pattern', { id });
  } catch (err) {
    error('TagPatternsService', 'Failed to delete pattern', err);
    throw err;
  }
}