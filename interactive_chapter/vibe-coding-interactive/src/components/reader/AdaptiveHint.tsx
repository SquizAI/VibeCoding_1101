import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AdaptiveHintProps {
  icon: string;
  text: string;
  isDark: boolean;
}

const HintContainer = styled(motion.div)<{ $isDark: boolean }>`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.4;
  border-left: 3px solid var(--color-primary);
`;

const IconWrapper = styled.div`
  font-size: 1.2rem;
  margin-top: 0.1rem;
`;

const HintText = styled.p`
  margin: 0;
  flex: 1;
`;

const AdaptiveHint: React.FC<AdaptiveHintProps> = ({ icon, text, isDark }) => {
  return (
    <HintContainer 
      $isDark={isDark}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconWrapper>{icon}</IconWrapper>
      <HintText>{text}</HintText>
    </HintContainer>
  );
};

export default AdaptiveHint;
