export interface Document {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  document_type: string;
  status: 'draft' | 'final' | 'archived';
  content?: any; // JSONB content for internally built documents
  created_at: string;
  updated_at: string;
}

export interface DocumentFormData {
  title: string;
  description?: string;
  document_type: string;
  status: 'draft' | 'final' | 'archived';
}