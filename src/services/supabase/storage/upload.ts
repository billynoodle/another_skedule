import { supabase } from '../client';
import { createFilePath } from './paths';
import { StorageFile, UploadOptions } from './types';
import { log, error } from '../../../utils/logger';

const DEFAULT_UPLOAD_OPTIONS: UploadOptions = {
  cacheControl: '3600',
  upsert: false
};

export async function uploadFile(
  file: File, 
  jobId: string, 
  options: UploadOptions = DEFAULT_UPLOAD_OPTIONS
): Promise<StorageFile> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Create path: userId/jobId/fileName
    const filePath = `${user.id}/${jobId}/${file.name}`;

    log('StorageService', 'Uploading file', { 
      path: filePath,
      size: file.size,
      type: file.type
    });

    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        ...options,
        duplex: 'half'
      });

    if (uploadError) {
      error('StorageService', 'Upload failed', uploadError);
      throw uploadError;
    }

    if (!data) throw new Error('Upload failed with no error');

    log('StorageService', 'File uploaded successfully', { 
      path: filePath,
      userId: user.id,
      jobId
    });

    return {
      path: filePath,
      ...data
    };
  } catch (err) {
    error('StorageService', 'Failed to upload file', err);
    throw err;
  }
}