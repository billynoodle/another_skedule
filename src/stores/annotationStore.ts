import { create } from 'zustand';
import { getAnnotations, createAnnotation, updateAnnotation, deleteAnnotation } from '../services/supabase/annotations';
import { log, error as logError } from '../utils/logger';
import { Annotation } from '../types/annotations';

interface DocumentState {
  annotations: Annotation[];
  scale: number;
  rotation: number;
}

interface AnnotationState {
  documents: Record<string, DocumentState>;
  selectedId: string | null;
  hoveredId: string | null;
  hoveredPatternId: string | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_DOCUMENT_STATE: DocumentState = {
  annotations: [],
  scale: 1,
  rotation: 0
};

export const useAnnotationStore = create<AnnotationState & {
  getDocumentState: (jobId: string, documentId: string) => DocumentState;
  setDocumentState: (jobId: string, documentId: string, state: Partial<DocumentState>) => void;
  fetchAnnotations: (documentId: string) => Promise<void>;
  addAnnotation: (jobId: string, documentId: string, annotation: Omit<Annotation, 'id'>) => Promise<void>;
  updateAnnotation: (jobId: string, documentId: string, annotation: Annotation) => Promise<void>;
  deleteAnnotation: (jobId: string, documentId: string, id: string) => Promise<void>;
  selectAnnotation: (id: string | null) => void;
  setHoveredAnnotation: (id: string | null) => void;
  setHoveredPattern: (id: string | null) => void;
  clearAnnotations: (jobId: string, documentId: string) => void;
}>((set, get) => ({
  documents: {},
  selectedId: null,
  hoveredId: null,
  hoveredPatternId: null,
  loading: false,
  error: null,

  getDocumentState: (jobId: string, documentId: string) => {
    const key = `${jobId}:${documentId}`;
    return get().documents[key] || DEFAULT_DOCUMENT_STATE;
  },

  setDocumentState: (jobId: string, documentId: string, state: Partial<DocumentState>) => {
    const key = `${jobId}:${documentId}`;
    const currentState = get().getDocumentState(jobId, documentId);
    
    set(store => ({
      documents: {
        ...store.documents,
        [key]: {
          ...currentState,
          ...state
        }
      }
    }));

    log('AnnotationStore', 'Document state updated', { jobId, documentId, state });
  },

  fetchAnnotations: async (documentId: string) => {
    try {
      set({ loading: true, error: null });
      const fetchedAnnotations = await getAnnotations(documentId);
      
      if (fetchedAnnotations) {
        set(state => ({
          documents: {
            ...state.documents,
            [documentId]: {
              ...state.documents[documentId],
              annotations: fetchedAnnotations
            }
          },
          loading: false
        }));
      }
      
      log('AnnotationStore', 'Annotations fetched', { count: fetchedAnnotations?.length });
    } catch (err) {
      logError('AnnotationStore', 'Failed to fetch annotations', err);
      set({ error: 'Failed to fetch annotations', loading: false });
    }
  },

  addAnnotation: async (jobId: string, documentId: string, annotation: Omit<Annotation, 'id'>) => {
    try {
      const key = `${jobId}:${documentId}`;
      const result = await createAnnotation(documentId, annotation);
      
      if (result) {
        set(state => ({
          documents: {
            ...state.documents,
            [key]: {
              ...state.getDocumentState(jobId, documentId),
              annotations: [...state.getDocumentState(jobId, documentId).annotations, result]
            }
          }
        }));
        log('AnnotationStore', 'Annotation added', { id: result.id });
      }
    } catch (err) {
      logError('AnnotationStore', 'Failed to add annotation', err);
      throw err;
    }
  },

  updateAnnotation: async (jobId: string, documentId: string, annotation: Annotation) => {
    try {
      const key = `${jobId}:${documentId}`;
      const result = await updateAnnotation(annotation.id, annotation);
      
      if (result) {
        set(state => ({
          documents: {
            ...state.documents,
            [key]: {
              ...state.getDocumentState(jobId, documentId),
              annotations: state.getDocumentState(jobId, documentId).annotations.map(a => 
                a.id === annotation.id ? result : a
              )
            }
          }
        }));
        log('AnnotationStore', 'Annotation updated', { id: annotation.id });
      }
    } catch (err) {
      logError('AnnotationStore', 'Failed to update annotation', err);
      throw err;
    }
  },

  deleteAnnotation: async (jobId: string, documentId: string, id: string) => {
    try {
      const key = `${jobId}:${documentId}`;
      await deleteAnnotation(id);
      
      set(state => ({
        documents: {
          ...state.documents,
          [key]: {
            ...state.getDocumentState(jobId, documentId),
            annotations: state.getDocumentState(jobId, documentId).annotations.filter(a => a.id !== id)
          }
        },
        selectedId: state.selectedId === id ? null : state.selectedId
      }));
      
      log('AnnotationStore', 'Annotation deleted', { id });
    } catch (err) {
      logError('AnnotationStore', 'Failed to delete annotation', err);
      throw err;
    }
  },

  selectAnnotation: (id: string | null) => set({ selectedId: id }),
  setHoveredAnnotation: (id: string | null) => set({ hoveredId: id }),
  setHoveredPattern: (id: string | null) => set({ hoveredPatternId: id }),

  clearAnnotations: (jobId: string, documentId: string) => {
    const key = `${jobId}:${documentId}`;
    set(state => ({
      documents: {
        ...state.documents,
        [key]: {
          ...state.getDocumentState(jobId, documentId),
          annotations: []
        }
      },
      selectedId: null,
      hoveredId: null
    }));
    log('AnnotationStore', 'Annotations cleared', { jobId, documentId });
  }
}));