import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Calendar,
  Edit,
  MapPin
} from 'lucide-react';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  job_title: string | null;
  photo_url: string | null;
  created_at: string;
}

interface ProfileViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  canEdit: boolean;
  onEdit: () => void;
}

export const ProfileViewDialog: React.FC<ProfileViewDialogProps> = ({
  open,
  onOpenChange,
  profile,
  canEdit,
  onEdit
}) => {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Profile Details
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            View profile information and contact details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Photo and Basic Info */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.photo_url || undefined} alt={profile.name || ''} />
              <AvatarFallback className="text-lg">
                {profile.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{profile.name || 'No name set'}</h3>
              {profile.job_title && (
                <p className="text-sm text-muted-foreground">{profile.job_title}</p>
              )}
              {profile.department && (
                <Badge variant="outline" className="mt-2">
                  {profile.department}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
            
            <div className="space-y-2">
              {profile.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.phone}</span>
                </div>
              )}
              
              {!profile.email && !profile.phone && (
                <p className="text-sm text-muted-foreground">No contact information available</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Work Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Work Information</h4>
            
            <div className="space-y-2">
              {profile.job_title && (
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.job_title}</span>
                </div>
              )}
              
              {profile.department && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.department}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {!profile.job_title && !profile.department && (
                <p className="text-sm text-muted-foreground">No work information available</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};