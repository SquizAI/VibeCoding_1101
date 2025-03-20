import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';

interface StudentAchievementsProps {
  userId?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  iconPath: string;
  dateEarned: Date | null;
  progress: number; // 0-100
  category: 'skill' | 'milestone' | 'challenge';
}

const AchievementCard = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const CategoryTab = styled.button<{ $active: boolean, $isDark: boolean }>`
  background-color: ${props => props.$active ? 
    'var(--color-primary)' : 
    props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
  };
  color: ${props => props.$active ? 'white' : 'inherit'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.$active ? 
      'var(--color-primary)' : 
      props.$isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
    };
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const AchievementItem = styled.div<{ $earned: boolean, $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.$isDark ? 
    props.$earned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)' : 
    props.$earned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  };
  opacity: ${props => props.$earned ? 1 : 0.7};
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const AchievementIcon = styled.div<{ $earned: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.$earned ? 'var(--color-primary)' : 'rgba(128, 128, 128, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: white;
  font-size: 1.5rem;
  
  svg {
    width: 30px;
    height: 30px;
  }
`;

const AchievementTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const AchievementDate = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-muted);
`;

const ProgressCircle = styled.div<{ $progress: number, $isDark: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$isDark ? '#2d3748' : '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: bold;
  color: ${props => props.$isDark ? 'white' : 'black'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      var(--color-primary) ${props => props.$progress}%, 
      transparent 0
    );
    mask: radial-gradient(transparent 55%, black 56%);
    -webkit-mask: radial-gradient(transparent 55%, black 56%);
  }
`;

// Mock achievement data for demonstration
const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'Hello World',
    description: 'Run your first code successfully',
    iconPath: '✨',
    dateEarned: new Date(2025, 2, 10),
    progress: 100,
    category: 'milestone'
  },
  {
    id: 'a2',
    title: 'Bug Hunter',
    description: 'Fix 5 errors in your code',
    iconPath: '🐞',
    dateEarned: new Date(2025, 2, 15),
    progress: 100,
    category: 'skill'
  },
  {
    id: 'a3',
    title: 'Loop Master',
    description: 'Successfully implement all types of loops',
    iconPath: '🔄',
    dateEarned: new Date(2025, 2, 18),
    progress: 100,
    category: 'skill'
  },
  {
    id: 'a4',
    title: 'Function Guru',
    description: 'Create 10 custom functions',
    iconPath: 'λ',
    dateEarned: null,
    progress: 60,
    category: 'skill'
  },
  {
    id: 'a5',
    title: 'Data Wizard',
    description: 'Use 5 different data structures correctly',
    iconPath: '📊',
    dateEarned: null,
    progress: 40,
    category: 'skill'
  },
  {
    id: 'a6',
    title: 'Chapter Champion',
    description: 'Complete a full chapter with 90%+ score',
    iconPath: '🏆',
    dateEarned: new Date(2025, 2, 12),
    progress: 100,
    category: 'milestone'
  },
  {
    id: 'a7',
    title: 'Code Streak',
    description: 'Code for 5 consecutive days',
    iconPath: '🔥',
    dateEarned: null,
    progress: 80,
    category: 'challenge'
  },
  {
    id: 'a8',
    title: 'Debugging Ninja',
    description: 'Fix a complex bug in under 5 minutes',
    iconPath: '⚡',
    dateEarned: null,
    progress: 0,
    category: 'challenge'
  }
];

const formatDate = (date: Date | null): string => {
  if (!date) return 'Not earned yet';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const StudentAchievements: React.FC<StudentAchievementsProps> = ({ userId: _userId }) => {
  const { darkMode } = useTheme();
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'skill' | 'milestone' | 'challenge'>('all');
  
  const filteredAchievements = activeCategory === 'all' 
    ? mockAchievements 
    : mockAchievements.filter(a => a.category === activeCategory);
  
  const earnedCount = mockAchievements.filter(a => a.dateEarned !== null).length;
    
  return (
    <AchievementCard $isDark={darkMode}>
      <CardTitle>
        <span>My Achievements</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>
          {earnedCount}/{mockAchievements.length} earned
        </span>
      </CardTitle>
      
      <CategoryTabs>
        <CategoryTab 
          $active={activeCategory === 'all'} 
          $isDark={darkMode}
          onClick={() => setActiveCategory('all')}
        >
          All
        </CategoryTab>
        <CategoryTab 
          $active={activeCategory === 'skill'} 
          $isDark={darkMode}
          onClick={() => setActiveCategory('skill')}
        >
          Skills
        </CategoryTab>
        <CategoryTab 
          $active={activeCategory === 'milestone'} 
          $isDark={darkMode}
          onClick={() => setActiveCategory('milestone')}
        >
          Milestones
        </CategoryTab>
        <CategoryTab 
          $active={activeCategory === 'challenge'} 
          $isDark={darkMode}
          onClick={() => setActiveCategory('challenge')}
        >
          Challenges
        </CategoryTab>
      </CategoryTabs>
      
      <AchievementsGrid>
        {filteredAchievements.map(achievement => (
          <AchievementItem 
            key={achievement.id}
            $earned={achievement.dateEarned !== null}
            $isDark={darkMode}
          >
            <AchievementIcon $earned={achievement.dateEarned !== null}>
              {achievement.iconPath}
            </AchievementIcon>
            <AchievementTitle>{achievement.title}</AchievementTitle>
            <AchievementDate>
              {achievement.dateEarned ? formatDate(achievement.dateEarned) : 'In progress'}
            </AchievementDate>
            
            {achievement.dateEarned === null && (
              <ProgressCircle $progress={achievement.progress} $isDark={darkMode}>
                {achievement.progress}%
              </ProgressCircle>
            )}
          </AchievementItem>
        ))}
      </AchievementsGrid>
    </AchievementCard>
  );
};

export default StudentAchievements;
