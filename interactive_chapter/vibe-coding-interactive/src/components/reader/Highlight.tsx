import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface HighlightProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'tip';
  title?: string;
}

const HighlightContainer = styled(motion.div)<{ $type: string }>`
  padding: 1.25rem;
  margin: 1.5rem 0;
  border-radius: 8px;
  position: relative;
  border-left: 4px solid ${props => {
    switch(props.$type) {
      case 'info': return 'var(--color-primary)';
      case 'warning': return '#e67e22';
      case 'success': return '#27ae60';
      case 'tip': return '#3498db';
      default: return 'var(--color-primary)';
    }
  }};
  
  background-color: ${props => {
    switch(props.$type) {
      case 'info': return 'rgba(var(--color-primary-rgb), 0.05)';
      case 'warning': return 'rgba(230, 126, 34, 0.05)';
      case 'success': return 'rgba(39, 174, 96, 0.05)';
      case 'tip': return 'rgba(52, 152, 219, 0.05)';
      default: return 'rgba(var(--color-primary-rgb), 0.05)';
    }
  }};
`;

const HighlightTitle = styled.h4<{ $type: string }>`
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: ${props => {
    switch(props.$type) {
      case 'info': return 'var(--color-primary-dark)';
      case 'warning': return '#d35400';
      case 'success': return '#219653';
      case 'tip': return '#2980b9';
      default: return 'var(--color-primary-dark)';
    }
  }};
  
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: ${props => {
      switch(props.$type) {
        case 'info': return '"ℹ️"';
        case 'warning': return '"⚠️"';
        case 'success': return '"✅"';
        case 'tip': return '"💡"';
        default: return '"ℹ️"';
      }
    }};
    font-size: 1.2rem;
  }
`;

const HighlightContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
`;

const Highlight: React.FC<HighlightProps> = ({ 
  children, 
  type = 'info',
  title
}) => {
  return (
    <HighlightContainer 
      $type={type}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title && <HighlightTitle $type={type}>{title}</HighlightTitle>}
      <HighlightContent>{children}</HighlightContent>
    </HighlightContainer>
  );
};

export default Highlight;
