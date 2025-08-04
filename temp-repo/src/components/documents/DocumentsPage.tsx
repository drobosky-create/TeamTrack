import { useState } from 'react';
import { Plus, Upload, FileText, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentUploadForm } from './DocumentUploadForm';
import { DocumentBuilderForm } from './DocumentBuilderForm';
import { formatDistanceToNow } from 'date-fns';

export const DocumentsPage = () => {
  const { documents, loading, deleteDocument, downloadDocument } = useDocuments();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [builderDialogOpen, setBuilderDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'final': return 'default';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operating Agreements</h1>
          <p className="text-muted-foreground">
            Manage your company's operating agreements - upload existing documents or build them internally.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Operating Agreement</DialogTitle>
              </DialogHeader>
              <DocumentUploadForm onSuccess={() => setUploadDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={builderDialogOpen} onOpenChange={setBuilderDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Build Agreement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Build Operating Agreement</DialogTitle>
              </DialogHeader>
              <DocumentBuilderForm onSuccess={() => setBuilderDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No operating agreements found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by uploading an existing operating agreement or building one from scratch.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
              <Button onClick={() => setBuilderDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Build Agreement
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {document.title}
                    </CardTitle>
                    {document.description && (
                      <CardDescription>{document.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant={getStatusColor(document.status)}>
                    {document.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      Type: {document.file_path ? 'Uploaded PDF' : 'Built Internally'}
                    </div>
                    {document.file_size && (
                      <div>Size: {formatFileSize(document.file_size)}</div>
                    )}
                    <div>
                      Created {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {document.file_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(document.file_path!, document.title)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDocument(document.id, document.file_path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};