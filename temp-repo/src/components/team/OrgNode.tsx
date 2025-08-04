import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/types/auth';

interface OrgNodeData {
  user: User;
  directReports?: number;
}

interface OrgNodeProps {
  data: OrgNodeData;
}

const OrgNode: React.FC<OrgNodeProps> = memo(({ data }) => {
  const { user, directReports = 0 } = data;

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'team_member': return 'outline';
      default: return 'outline';
    }
  };

  const isManager = user.role === 'admin' || user.role === 'manager';

  return (
    <div className="bg-card border border-border-soft rounded-lg shadow-soft p-4 min-w-[200px] hover:shadow-soft-md transition-shadow">
      {/* Top Handle for receiving connections */}
      {user.managerId && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-primary border-2 border-background"
        />
      )}

      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{user.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      {/* Role & Department */}
      <div className="space-y-2 mb-3">
        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
          {user.role.replace('_', ' ').toUpperCase()}
        </Badge>
        {user.department && (
          <p className="text-xs text-muted-foreground">{user.department}</p>
        )}
      </div>

      {/* Direct Reports Count */}
      {isManager && directReports > 0 && (
        <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
          {directReports} direct report{directReports !== 1 ? 's' : ''}
        </div>
      )}

      {/* Bottom Handle for connections to direct reports */}
      {isManager && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 bg-primary border-2 border-background"
        />
      )}
    </div>
  );
});

OrgNode.displayName = 'OrgNode';

export default OrgNode;