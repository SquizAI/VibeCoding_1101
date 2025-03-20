import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';

interface EngagementMetricsSectionProps {
  chapterId: string;
  filterStatus?: string;
}

interface MetricData {
  id: string;
  name: string;
  description: string;
  averageValue: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
}

// Styled components
const SectionContainer = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;
`;

const SectionHeader = styled.div<{ $isDark: boolean }>`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--color-primary);
  }
`;

const TimeToggle = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const TimeOption = styled.button<{ $active: boolean, $isDark: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${props => 
    props.$active ? 
      (props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 
      'transparent'
  };
  color: ${props => props.$active ? 'var(--color-primary)' : 'inherit'};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => 
      props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'
    };
  }
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const MetricCard = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MetricName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const MetricDescription = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
`;

const MetricValueContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const MetricTrend = styled.div<{ $trend: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => {
    switch(props.$trend) {
      case 'up': return 'rgba(16, 185, 129, 0.1)';
      case 'down': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  
  color: ${props => {
    switch(props.$trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  
  font-weight: 600;
  font-size: 0.9rem;
`;

// SVG Icons for trends
const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L7 17M7 17H17M7 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendNeutralIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Mock data for demonstration
const getMockMetricData = (chapterId: string, timeframe: string, filterStatus: string = 'all'): MetricData[] => {
  // In a real app, this would fetch actual metrics from a database based on chapter, timeframe, and filter status
  console.log(`Fetching metrics for chapter: ${chapterId} with timeframe: ${timeframe} and filter: ${filterStatus}`);
  
  // Base metrics data
  const baseMetrics = [
    {
      id: 'time_spent',
      name: 'Average Time Spent',
      description: 'Average time students spend engaging with chapter content',
      averageValue: 23.5, // minutes
      trend: 'up' as 'up',
      trendValue: 12
    },
    {
      id: 'code_interaction',
      name: 'Code Interactions',
      description: 'Average number of times students write or edit code in the sandbox',
      averageValue: 17,
      trend: 'up' as 'up',
      trendValue: 8
    },
    {
      id: 'ai_prompts',
      name: 'AI Assistant Usage',
      description: 'Average number of queries sent to the AI assistant',
      averageValue: 9,
      trend: 'neutral' as 'neutral',
      trendValue: 2
    },
    {
      id: 'conceptual_understanding',
      name: 'Conceptual Understanding',
      description: 'Estimated understanding level based on interactions (0-100)',
      averageValue: 72,
      trend: 'up' as 'up',
      trendValue: 5
    },
    {
      id: 'completion_rate',
      name: 'Section Completion Rate',
      description: 'Percentage of students who completed all sections',
      averageValue: 68,
      trend: 'down' as 'down',
      trendValue: 7
    },
    {
      id: 'revisit_rate',
      name: 'Content Revisit Rate',
      description: 'Percentage of students who revisited sections after completion',
      averageValue: 42,
      trend: 'up' as 'up',
      trendValue: 15
    }
  ];
  
  // Add an extra metric based on filterStatus
  if (filterStatus === 'at-risk') {
    baseMetrics.push({
      id: 'engagement_gap',
      name: 'Engagement Gap',
      description: 'Difference between expected and actual engagement levels for at-risk students',
      averageValue: 28.5,
      trend: 'down' as 'down',
      trendValue: 4
    });
  }
  
  if (filterStatus === 'active') {
    baseMetrics.push({
      id: 'session_frequency',
      name: 'Session Frequency',
      description: 'Average number of coding sessions per week for active students',
      averageValue: 5.2,
      trend: 'up' as 'up',
      trendValue: 0.8
    });
  }
  
  return baseMetrics;
};

const EngagementMetricsSection: React.FC<EngagementMetricsSectionProps> = ({ 
  chapterId, 
  filterStatus = 'all' 
}) => {
  const { darkMode } = useTheme();
  const [timeframe, setTimeframe] = useState('week');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
  const metrics = getMockMetricData(chapterId, timeframe, filterStatus);
  
  return (
    <SectionContainer $isDark={darkMode}>
      <SectionHeader $isDark={darkMode}>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
          </svg>
          Engagement Metrics
        </SectionTitle>
        <TimeToggle>
          <TimeOption 
            $active={timeframe === 'day'} 
            $isDark={darkMode}
            onClick={() => setTimeframe('day')}
          >
            Day
          </TimeOption>
          <TimeOption 
            $active={timeframe === 'week'} 
            $isDark={darkMode}
            onClick={() => setTimeframe('week')}
          >
            Week
          </TimeOption>
          <TimeOption 
            $active={timeframe === 'month'} 
            $isDark={darkMode}
            onClick={() => setTimeframe('month')}
          >
            Month
          </TimeOption>
        </TimeToggle>
      </SectionHeader>
      
      <SectionContent>
        <MetricsGrid>
          {metrics.map(metric => (
            <MetricCard 
              key={metric.id} 
              $isDark={darkMode}
              onClick={() => setExpandedMetric(expandedMetric === metric.id ? null : metric.id)}
              style={{ cursor: 'pointer' }}
            >
              <MetricName>{metric.name}</MetricName>
              <MetricDescription>{metric.description}</MetricDescription>
              <MetricValueContainer>
                <MetricValue>
                  {/* Format based on metric type */}
                  {metric.id === 'time_spent' ? `${metric.averageValue}m` : 
                   (metric.id === 'completion_rate' || metric.id === 'revisit_rate' || metric.id === 'conceptual_understanding') ? 
                    `${metric.averageValue}%` : 
                    metric.averageValue}
                </MetricValue>
                <MetricTrend $trend={metric.trend}>
                  {metric.trend === 'up' ? <TrendUpIcon /> : 
                   metric.trend === 'down' ? <TrendDownIcon /> : 
                   <TrendNeutralIcon />}
                  {metric.trendValue}%
                </MetricTrend>
              </MetricValueContainer>
              
              {expandedMetric === metric.id && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  <p><strong>Insights:</strong></p>
                  <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                    <li>Students in the {filterStatus === 'at-risk' ? 'at-risk' : filterStatus === 'active' ? 'active' : 'all'} group show {metric.trend === 'up' ? 'improved' : metric.trend === 'down' ? 'declining' : 'stable'} trends.</li>
                    <li>Compared to last {timeframe}, this metric has {metric.trend === 'up' ? 'increased' : metric.trend === 'down' ? 'decreased' : 'remained stable'} by {metric.trendValue}%.</li>
                    <li>Recommendation: {metric.trend === 'up' ? 'Maintain current instructional approach' : metric.trend === 'down' ? 'Consider focused interventions' : 'Monitor for any changes'}.</li>
                  </ul>
                  <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>Click to collapse</span>
                  </div>
                </div>
              )}
            </MetricCard>
          ))}
        </MetricsGrid>
      </SectionContent>
    </SectionContainer>
  );
};

export default EngagementMetricsSection;
