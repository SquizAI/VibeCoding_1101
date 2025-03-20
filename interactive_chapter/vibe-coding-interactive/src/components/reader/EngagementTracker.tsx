import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';
import PathwayIndicator from './PathwayIndicator';
import AdaptiveHint from './AdaptiveHint';
import { EngagementMetrics, getInitialEngagementMetrics, determinePathway, generateAdaptiveHint } from './engagementUtils';

interface EngagementTrackerProps {
  chapterId: string;
  sectionId: string;
  userId?: string;
}

// Interface definition moved to engagementUtils.ts

const TrackerContainer = styled.div<{ $isDark: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Pathway styling moved to PathwayIndicator.tsx

// Hint styling moved to AdaptiveHint.tsx

// Initial metrics functionality moved to engagementUtils.ts

// Pathway determination moved to engagementUtils.ts

// Adaptive hint generation moved to engagementUtils.ts

const EngagementTracker: React.FC<EngagementTrackerProps> = ({ 
  chapterId, 
  sectionId 
  // userId removed as it's not used
}) => {
  const { darkMode, skillLevel, setSkillLevel } = useTheme();
  const [metrics, setMetrics] = useState<EngagementMetrics>(getInitialEngagementMetrics());
  const [hint, setHint] = useState<{ icon: string; text: string } | null>(null);
  
  useEffect(() => {
    // In a real implementation, this would load saved metrics from the backend
    // and set up event listeners for user interactions
    const timer = setInterval(() => {
      // Simulating user interactions for demonstration purposes
      setMetrics(prev => {
        const updated = {
          ...prev,
          timeSpent: prev.timeSpent + 5,
          codeInteractions: Math.random() > 0.7 ? prev.codeInteractions + 1 : prev.codeInteractions,
          aiPrompts: Math.random() > 0.9 ? prev.aiPrompts + 1 : prev.aiPrompts,
          executionSuccess: Math.random() > 0.8 ? prev.executionSuccess + 1 : prev.executionSuccess,
          executionFailures: Math.random() > 0.9 ? prev.executionFailures + 1 : prev.executionFailures,
          confidenceScore: Math.min(1, prev.confidenceScore + (Math.random() * 0.05 - 0.01)),
          lastActive: new Date()
        };
        
        // Update learning pathway based on metrics
        const pathway = determinePathway(updated);
        updated.learningPathway = pathway;
        
        return updated;
      });
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    // Update hint based on current metrics
    const newHint = generateAdaptiveHint(metrics, chapterId, sectionId);
    setHint(newHint);
    
    // In a real implementation, we would send the updated metrics to a backend service
    // for analytics and teacher dashboards
    
    // Update the skill level in the theme context if the pathway changes
    if (skillLevel !== metrics.learningPathway) {
      setSkillLevel(metrics.learningPathway);
    }
    
  }, [metrics, chapterId, sectionId, skillLevel, setSkillLevel]);
  
  return (
    <TrackerContainer $isDark={darkMode}>
      <PathwayIndicator pathway={metrics.learningPathway} isDark={darkMode} />
      
      {hint && (
        <AdaptiveHint 
          icon={hint.icon}
          text={hint.text}
          isDark={darkMode}
        />
      )}
    </TrackerContainer>
  );
};

export default EngagementTracker;
