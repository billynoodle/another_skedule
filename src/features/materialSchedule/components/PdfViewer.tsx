import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { supabase } from '../../../services/supabase/client';
import { PDF_OPTIONS } from '../../../services/pdf/documentPreparation';
import { AnnotationToolbar } from './annotations/AnnotationToolbar';
import { AnnotationCanvas } from './annotations/canvas/AnnotationCanvas';
import { useViewerStore } from '../../../stores/viewerStore';
import { useAnnotationStore } from '../../../stores/annotationStore';
import { log } from '../../../utils/logger';

interface PdfViewerProps {
  document: Document;
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function PdfViewer({ document, jobId, documentId, onAnnotationComplete }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const transformComponentRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const viewerState = useViewerStore();
  const { 
    getDocumentState, 
    setDocumentState, 
    fetchAnnotations 
  } = useAnnotationStore();
  
  const documentState = getDocumentState(jobId, documentId);

  // Fetch annotations only once when component mounts
  useEffect(() => {
    let mounted = true;

    const loadAnnotations = async () => {
      try {
        await fetchAnnotations(documentId);
      } catch (err) {
        log('PdfViewer', 'Failed to fetch annotations', err);
      }
    };

    if (mounted) {
      loadAnnotations();
    }

    return () => {
      mounted = false;
    };
  }, [documentId, fetchAnnotations]);

  // Get signed URL for document
  useEffect(() => {
    let mounted = true;

    const getSignedUrl = async () => {
      try {
        const { data, error: urlError } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.filePath, 3600);

        if (urlError) throw urlError;
        if (!data?.signedUrl) throw new Error('No signed URL returned');

        if (mounted) {
          setFileUrl(data.signedUrl);
          log('PdfViewer', 'Obtained signed URL');
        }
      } catch (err) {
        log('PdfViewer', 'Failed to get signed URL', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (document.filePath) {
      getSignedUrl();
    }

    return () => {
      mounted = false;
    };
  }, [document.filePath]);

  const handleDocumentLoadSuccess = useCallback(() => {
    log('PdfViewer', 'Document loaded successfully');
  }, []);

  const handlePageLoadSuccess = useCallback((page: any) => {
    try {
      const viewport = page.getViewport({ scale: 1, rotation: 0 });
      const isPortrait = viewport.width < viewport.height;
      
      // Only update rotation if needed
      if (isPortrait && documentState.rotation === 0) {
        setDocumentState(jobId, documentId, { rotation: 90 });
      }

      const rotatedViewport = page.getViewport({ 
        scale: 1, 
        rotation: documentState.rotation 
      });

      setDimensions({
        width: rotatedViewport.width,
        height: rotatedViewport.height
      });

      setLoading(false);
      log('PdfViewer', 'Page loaded successfully', { 
        dimensions: { 
          width: rotatedViewport.width, 
          height: rotatedViewport.height 
        },
        rotation: documentState.rotation
      });
    } catch (err) {
      log('PdfViewer', 'Failed to process page', err);
      setLoading(false);
    }
  }, [jobId, documentId, documentState.rotation, setDocumentState]);

  const handleScaleChange = useCallback((newScale: number) => {
    setDocumentState(jobId, documentId, { scale: newScale });
  }, [jobId, documentId, setDocumentState]);

  if (!fileUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      <div className="flex-none bg-white border-b border-gray-200">
        <AnnotationToolbar 
          jobId={jobId} 
          documentId={documentId} 
          scale={documentState.scale}
          onScaleChange={handleScaleChange}
        />
      </div>

      <div className="flex-1 relative overflow-hidden bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        <TransformWrapper
          ref={transformComponentRef}
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          centerOnInit
          disabled={viewerState.mode === 'draw'}
          wheel={{ disabled: false }}
          panning={{ disabled: viewerState.mode === 'draw' }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%'
            }}
          >
            <div className="relative">
              <Document
                file={fileUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                options={PDF_OPTIONS}
                loading={null}
                error={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-500">Error loading PDF</p>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  scale={documentState.scale}
                  rotate={documentState.rotation}
                  loading={null}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                  onLoadSuccess={handlePageLoadSuccess}
                />
              </Document>

              {dimensions && (
                <AnnotationCanvas
                  width={dimensions.width}
                  height={dimensions.height}
                  jobId={jobId}
                  documentId={documentId}
                  onAnnotationComplete={onAnnotationComplete}
                />
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}