import { useState, useCallback } from 'react';
import { supabase } from '../../../services/supabase/client';
import { TagPattern } from '../types/patterns';
import { log } from '../../../utils/logger';

export function useTagPatterns(documentId: string) {
  const [patterns, setPatterns] = useState<TagPattern[]>([]);
  const [linkedPatterns, setLinkedPatterns] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatterns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('tag_patterns')
        .select('*')
        .eq('document_id', documentId);

      if (err) throw err;

      setPatterns(data || []);
      log('TagPatterns', 'Patterns fetched', { count: data?.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patterns';
      setError(message);
      log('TagPatterns', 'Failed to fetch patterns', err);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const savePattern = useCallback(async (pattern: Omit<TagPattern, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('tag_patterns')
        .insert([{
          document_id: documentId,
          prefix: pattern.prefix,
          description: pattern.description,
          schedule_table: pattern.scheduleTable
        }])
        .select()
        .single();

      if (err) throw err;

      setPatterns(prev => [...prev, data]);
      log('TagPatterns', 'Pattern saved', { id: data.id });
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save pattern';
      setError(message);
      log('TagPatterns', 'Failed to save pattern', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const updatePattern = useCallback(async (pattern: TagPattern) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('tag_patterns')
        .update({
          prefix: pattern.prefix,
          description: pattern.description,
          schedule_table: pattern.scheduleTable
        })
        .eq('id', pattern.id)
        .select()
        .single();

      if (err) throw err;

      setPatterns(prev => prev.map(p => p.id === pattern.id ? data : p));
      log('TagPatterns', 'Pattern updated', { id: pattern.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update pattern';
      setError(message);
      log('TagPatterns', 'Failed to update pattern', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePattern = useCallback(async (patternId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: err } = await supabase
        .from('tag_patterns')
        .delete()
        .eq('id', patternId);

      if (err) throw err;

      setPatterns(prev => prev.filter(p => p.id !== patternId));
      log('TagPatterns', 'Pattern deleted', { id: patternId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete pattern';
      setError(message);
      log('TagPatterns', 'Failed to delete pattern', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const linkPattern = useCallback(async (annotationId: string, patternId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: err } = await supabase
        .from('annotations')
        .update({ tag_pattern_id: patternId })
        .eq('id', annotationId);

      if (err) throw err;

      setLinkedPatterns(prev => ({
        ...prev,
        [patternId]: [...(prev[patternId] || []), annotationId]
      }));

      log('TagPatterns', 'Pattern linked', { patternId, annotationId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link pattern';
      setError(message);
      log('TagPatterns', 'Failed to link pattern', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setHoveredPattern = useCallback((patternId: string | null) => {
    // This will be handled by the annotation store
    log('TagPatterns', 'Pattern hover state changed', { patternId });
  }, []);

  return {
    patterns,
    linkedPatterns,
    loading,
    error,
    savePattern,
    updatePattern,
    deletePattern,
    linkPattern,
    setHoveredPattern,
    fetchPatterns
  };
}