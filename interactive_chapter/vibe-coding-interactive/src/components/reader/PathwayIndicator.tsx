import React from 'react';
import styled from 'styled-components';

interface PathwayIndicatorProps {
  pathway: 'beginner' | 'advanced' | 'ninja';
  isDark: boolean;
}

const PathwayContainer = styled.div<{ $pathway: string, $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: ${props => {
    if (props.$pathway === 'ninja') {
      return props.$isDark ? 'rgba(88, 24, 69, 0.3)' : 'rgba(147, 51, 234, 0.1)';
    } else if (props.$pathway === 'advanced') {
      return props.$isDark ? 'rgba(6, 78, 59, 0.3)' : 'rgba(5, 150, 105, 0.1)';
    } else {
      return props.$isDark ? 'rgba(30, 58, 138, 0.3)' : 'rgba(59, 130, 246, 0.1)';
    }
  }};
  color: ${props => {
    if (props.$pathway === 'ninja') {
      return props.$isDark ? 'rgba(192, 132, 252, 1)' : 'rgba(126, 34, 206, 1)';
    } else if (props.$pathway === 'advanced') {
      return props.$isDark ? 'rgba(52, 211, 153, 1)' : 'rgba(4, 120, 87, 1)';
    } else {
      return props.$isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(29, 78, 216, 1)';
    }
  }};
`;

const PathwayText = styled.span`
  text-transform: capitalize;
`;

const PathwayIndicator: React.FC<PathwayIndicatorProps> = ({ pathway, isDark }) => {
  return (
    <PathwayContainer $pathway={pathway} $isDark={isDark}>
      {pathway === 'ninja' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
        </svg>
      )}
      
      {pathway === 'advanced' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
      )}
      
      {pathway === 'beginner' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
        </svg>
      )}
      
      <PathwayText>{pathway} Path</PathwayText>
    </PathwayContainer>
  );
};

export default PathwayIndicator;
