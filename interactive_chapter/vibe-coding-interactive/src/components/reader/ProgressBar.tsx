import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  skillLevel: string;
}

const BarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressIndicator = styled(motion.div)<{ $skillLevel: string }>`
  height: 100%;
  border-radius: 4px;
  background: ${props => {
    switch(props.$skillLevel) {
      case 'beginner':
        return 'linear-gradient(to right, #11998e, #38ef7d)';
      case 'intermediate':
        return 'linear-gradient(to right, #2193b0, #6dd5ed)';
      case 'advanced':
        return 'linear-gradient(to right, #8e2de2, #4a00e0)';
      default:
        return 'linear-gradient(to right, #11998e, #38ef7d)';
    }
  }};
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, skillLevel }) => {
  return (
    <BarContainer>
      <ProgressIndicator
        $skillLevel={skillLevel}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </BarContainer>
  );
};

export default ProgressBar;
