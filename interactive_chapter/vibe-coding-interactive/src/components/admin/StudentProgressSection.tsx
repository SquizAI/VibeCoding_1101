import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';

interface StudentProgressSectionProps {
  chapterId: string;
  filterStatus?: string;
  onViewStudent?: (studentId: string) => void;
}

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  pathway: 'beginner' | 'advanced' | 'ninja';
  lastActive: string;
  engagementScore: number;
  completedSections: number;
  totalSections: number;
}

// Styled components
const SectionContainer = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

const SearchInput = styled.input<{ $isDark: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  color: inherit;
  font-size: 0.9rem;
  max-width: 200px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  
  &::placeholder {
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  }
`;

const StudentList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.3);
    border-radius: 4px;
  }
`;

const StudentItem = styled.div<{ $isDark: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div<{ $src: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const StudentInfo = styled.div`
  margin-left: 1rem;
  flex: 1;
  min-width: 0;
`;

const StudentName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StudentMeta = styled.div`
  display: flex;
  font-size: 0.8rem;
  color: #888;
  gap: 1rem;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  flex-shrink: 0;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ $progress: number, $pathway: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => `${props.$progress}%`};
  background: ${props => {
    switch(props.$pathway) {
      case 'ninja': return 'linear-gradient(to right, #8e2de2, #4a00e0)';
      case 'advanced': return 'linear-gradient(to right, #2193b0, #6dd5ed)';
      default: return 'linear-gradient(to right, #11998e, #38ef7d)';
    }
  }};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 45px;
  text-align: right;
`;

const PathwayBadge = styled.div<{ $pathway: string, $isDark: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 1rem;
  
  background-color: ${props => {
    if (props.$pathway === 'ninja') {
      return props.$isDark ? 'rgba(88, 24, 69, 0.3)' : 'rgba(147, 51, 234, 0.1)';
    } else if (props.$pathway === 'advanced') {
      return props.$isDark ? 'rgba(12, 74, 110, 0.3)' : 'rgba(59, 130, 246, 0.1)';
    } else {
      return props.$isDark ? 'rgba(6, 78, 59, 0.3)' : 'rgba(16, 185, 129, 0.1)';
    }
  }};
  
  color: ${props => {
    if (props.$pathway === 'ninja') {
      return props.$isDark ? '#d946ef' : '#9333ea';
    } else if (props.$pathway === 'advanced') {
      return props.$isDark ? '#3b82f6' : '#2563eb';
    } else {
      return props.$isDark ? '#10b981' : '#047857';
    }
  }};
`;



// Mock student data for demonstration
const getMockStudentData = (chapterId: string, filterStatus: string = 'all'): StudentData[] => {
  // In a real app, this would fetch actual student data from a database
  console.log(`Fetching student data for chapter: ${chapterId} with filter: ${filterStatus}`);
  
  // Base student data
  const allStudents = [
    {
      id: 'student1',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      progress: 83,
      pathway: 'ninja',
      lastActive: '10 minutes ago',
      engagementScore: 92,
      completedSections: 5,
      totalSections: 6
    },
    {
      id: 'student2',
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      progress: 67,
      pathway: 'advanced',
      lastActive: '2 hours ago',
      engagementScore: 78,
      completedSections: 4,
      totalSections: 6
    },
    {
      id: 'student3',
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      progress: 50,
      pathway: 'beginner',
      lastActive: '3 days ago',
      engagementScore: 65,
      completedSections: 3,
      totalSections: 6
    },
    {
      id: 'student4',
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      progress: 33,
      pathway: 'beginner',
      lastActive: '1 day ago',
      engagementScore: 45,
      completedSections: 2,
      totalSections: 6
    },
    {
      id: 'student5',
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      progress: 100,
      pathway: 'ninja',
      lastActive: '5 hours ago',
      engagementScore: 98,
      completedSections: 6,
      totalSections: 6
    },
    {
      id: 'student6',
      name: 'Olivia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
      progress: 17,
      pathway: 'beginner',
      lastActive: 'Just now',
      engagementScore: 32,
      completedSections: 1,
      totalSections: 6
    }
  ];
  
  // Apply filters based on filterStatus
  switch(filterStatus) {
    case 'active':
      return allStudents.filter(student => 
        student.lastActive.includes('Just now') || student.lastActive.includes('minutes') || student.lastActive.includes('hour')) as StudentData[];
    case 'inactive':
      return allStudents.filter(student => 
        student.lastActive.includes('week') || student.lastActive.includes('month')) as StudentData[];
    case 'at-risk':
      return allStudents.filter(student => student.engagementScore < 60) as StudentData[];
    default:
      return allStudents as StudentData[];
  }
};

const StudentProgressSection: React.FC<StudentProgressSectionProps> = ({ 
  chapterId, 
  filterStatus = 'all',
  onViewStudent 
}) => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const students = getMockStudentData(chapterId, filterStatus);
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <SectionContainer $isDark={darkMode}>
      <SectionHeader $isDark={darkMode}>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
            <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
          </svg>
          Student Progress
        </SectionTitle>
        <SearchInput 
          $isDark={darkMode}
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SectionHeader>
      
      <StudentList>
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <StudentItem 
              key={student.id} 
              $isDark={darkMode} 
              onClick={() => onViewStudent && onViewStudent(student.id)}
              title="Click to view student details"
            >
              <Avatar $src={student.avatar} />
              <StudentInfo>
                <StudentName>{student.name}</StudentName>
                <StudentMeta>
                  <span>Last active: {student.lastActive}</span>
                  <span>{student.completedSections}/{student.totalSections} sections</span>
                </StudentMeta>
              </StudentInfo>
              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill $progress={student.progress} $pathway={student.pathway} />
                </ProgressBar>
                <ProgressText>{student.progress}%</ProgressText>
                <PathwayBadge $pathway={student.pathway} $isDark={darkMode}>
                  {student.pathway.charAt(0).toUpperCase() + student.pathway.slice(1)}
                </PathwayBadge>
              </ProgressContainer>
            </StudentItem>
          ))
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888' }}>
            No students match the current filters
          </div>
        )}
      </StudentList>
    </SectionContainer>
  );
};

export default StudentProgressSection;
