import React, { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import OrgNode from './OrgNode';
import { User } from '@/types/auth';

interface OrgChartProps {
  teamMembers: User[];
}

const nodeTypes = {
  orgNode: OrgNode,
};

// Helper function to calculate hierarchical positions
const calculateNodePositions = (users: User[]): { [userId: string]: { x: number; y: number } } => {
  const positions: { [userId: string]: { x: number; y: number } } = {};
  const levels: { [level: number]: User[] } = {};
  
  // Build hierarchy levels
  const getLevel = (user: User, visited = new Set()): number => {
    if (visited.has(user.id)) return 0; // Prevent infinite loops
    visited.add(user.id);
    
    if (!user.managerId) return 0; // Top level
    const manager = users.find(u => u.id === user.managerId);
    return manager ? getLevel(manager, visited) + 1 : 0;
  };

  // Group users by level
  users.forEach(user => {
    const level = getLevel(user);
    if (!levels[level]) levels[level] = [];
    levels[level].push(user);
  });

  // Position nodes
  const levelHeight = 180;
  const nodeWidth = 220;
  const spacing = 50;

  Object.entries(levels).forEach(([levelStr, levelUsers]) => {
    const level = parseInt(levelStr);
    const totalWidth = levelUsers.length * nodeWidth + (levelUsers.length - 1) * spacing;
    const startX = -totalWidth / 2;

    levelUsers.forEach((user, index) => {
      positions[user.id] = {
        x: startX + index * (nodeWidth + spacing),
        y: level * levelHeight,
      };
    });
  });

  return positions;
};

export const OrgChart: React.FC<OrgChartProps> = ({ teamMembers }) => {
  const { nodes, edges } = useMemo(() => {
    const positions = calculateNodePositions(teamMembers);
    
    // Create nodes
    const flowNodes: Node[] = teamMembers.map(user => {
      const directReports = teamMembers.filter(member => member.managerId === user.id).length;
      
      return {
        id: user.id,
        type: 'orgNode',
        position: positions[user.id] || { x: 0, y: 0 },
        data: {
          user,
          directReports,
        },
        draggable: true,
      };
    });

    // Create edges (manager -> direct report relationships)
    const flowEdges: Edge[] = teamMembers
      .filter(user => user.managerId)
      .map(user => ({
        id: `edge-${user.managerId}-${user.id}`,
        source: user.managerId!,
        target: user.id,
        type: 'smoothstep',
        style: {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))',
        },
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [teamMembers]);

  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  return (
    <div className="h-96 w-full border border-border-soft rounded-lg overflow-hidden bg-background">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        style={{ backgroundColor: 'hsl(var(--background-subtle))' }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="bg-card border border-border-soft shadow-soft" />
        <Background 
          color="hsl(var(--border))" 
          gap={20} 
          size={1}
        />
      </ReactFlow>
    </div>
  );
};