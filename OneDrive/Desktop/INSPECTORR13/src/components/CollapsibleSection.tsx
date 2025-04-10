import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ 
  title, 
  icon, 
  defaultExpanded = false, 
  children 
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{ 
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: 'none',
          borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1rem'
        }}
      >
        {icon && <span>{icon}</span>}
        <span style={{ fontWeight: 'bold' }}>{title}</span>
        <span style={{ 
          marginLeft: 'auto',
          transform: isExpanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div style={{ padding: '1rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}
