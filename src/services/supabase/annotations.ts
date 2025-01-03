import { supabase } from './client';
import { log, error } from '../../utils/logger';
import { Annotation } from '../../types/annotations';

export async function getAnnotations(documentId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error: err } = await supabase
      .from('annotations')
      .select(`
        *,
        tag_patterns (
          id,
          prefix,
          description,
          schedule_table
        )
      `)
      .eq('document_id', documentId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (err) throw err;
    log('AnnotationsService', 'Retrieved annotations', { count: data?.length });
    return data;
  } catch (err) {
    error('AnnotationsService', 'Failed to get annotations', err);
    throw err;
  }
}

export async function createAnnotation(documentId: string, annotation: Omit<Annotation, 'id'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error: err } = await supabase
      .from('annotations')
      .insert({
        document_id: documentId,
        type: annotation.type,
        position: annotation.position,
        tag_pattern_id: annotation.tagPatternId,
        extracted_text: annotation.extractedText,
        confidence: annotation.confidence,
        user_id: user.id
      })
      .select(`
        *,
        tag_patterns (
          id,
          prefix,
          description,
          schedule_table
        )
      `)
      .single();

    if (err) throw err;
    log('AnnotationsService', 'Created annotation', { id: data?.id });
    return data;
  } catch (err) {
    error('AnnotationsService', 'Failed to create annotation', err);
    throw err;
  }
}

export async function updateAnnotation(id: string, updates: Partial<Annotation>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error: err } = await supabase
      .from('annotations')
      .update({
        position: updates.position,
        tag_pattern_id: updates.tagPatternId,
        extracted_text: updates.extractedText,
        confidence: updates.confidence,
        last_modified: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        tag_patterns (
          id,
          prefix,
          description,
          schedule_table
        )
      `)
      .single();

    if (err) throw err;
    log('AnnotationsService', 'Updated annotation', { id });
    return data;
  } catch (err) {
    error('AnnotationsService', 'Failed to update annotation', err);
    throw err;
  }
}

export async function deleteAnnotation(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { error: err } = await supabase
      .from('annotations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (err) throw err;
    log('AnnotationsService', 'Deleted annotation', { id });
  } catch (err) {
    error('AnnotationsService', 'Failed to delete annotation', err);
    throw err;
  }
}