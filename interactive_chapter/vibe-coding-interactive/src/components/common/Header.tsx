import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../../styles/ThemeProvider';

// Define interface for the theme prop
interface ThemedProps {
  $isDark: boolean;
}

const HeaderContainer = styled.header<ThemedProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled(Link)<ThemedProps>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoHighlight = styled.span<{ level: string }>`
  color: ${props => {
    switch (props.level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

interface NavLinkProps extends ThemedProps {
  $active?: boolean;
  $skillLevel: 'beginner' | 'advanced' | 'ninja';
}

const NavLink = styled(Link)<NavLinkProps>`
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  font-weight: ${props => props.$active ? '700' : '500'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background-color: ${props => {
      switch (props.$skillLevel) {
        case 'beginner': return 'var(--color-beginner)';
        case 'advanced': return 'var(--color-advanced)';
        case 'ninja': return 'var(--color-ninja)';
        default: return 'var(--color-primary)';
      }
    }};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const ThemeToggle = styled.button<ThemedProps>`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const SkillLevelToggle = styled.div<ThemedProps>`
  display: flex;
  background-color: ${props => props.$isDark ? 'var(--color-dark-accent)' : 'var(--color-light-accent)'};
  border-radius: 9999px;
  padding: 0.25rem;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

interface SkillLevelButtonProps extends ThemedProps {
  $active: boolean;
  $level: string;
}

const SkillLevelButton = styled.button<SkillLevelButtonProps>`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  background-color: ${props => props.$active ? 
    (props.$level === 'beginner' ? 'var(--color-beginner)' : 
     props.$level === 'advanced' ? 'var(--color-advanced)' : 
     'var(--color-ninja)') : 'transparent'};
  color: ${props => props.$active ? 'var(--color-light)' : props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.$active ? '' : props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, skillLevel, setSkillLevel } = useTheme();
  
  return (
    <HeaderContainer $isDark={darkMode}>
      <Logo to="/" $isDark={darkMode}>
        <LogoHighlight level={skillLevel}>Vibe</LogoHighlight>Coding
      </Logo>
      
      <Nav>
        <NavLink 
          to="/" 
          $active={window.location.pathname === '/'} 
          $isDark={darkMode}
          $skillLevel={skillLevel}
        >
          Home
        </NavLink>
        <NavLink 
          to="/interactive" 
          $active={window.location.pathname === '/interactive'} 
          $isDark={darkMode}
          $skillLevel={skillLevel}
        >
          Interactive Demo
        </NavLink>
        <NavLink 
          to="/examples" 
          $active={window.location.pathname === '/examples'} 
          $isDark={darkMode}
          $skillLevel={skillLevel}
        >
          Examples
        </NavLink>
        <NavLink 
          to="/resources" 
          $active={window.location.pathname === '/resources'} 
          $isDark={darkMode}
          $skillLevel={skillLevel}
        >
          Resources
        </NavLink>
        
        <SkillLevelToggle $isDark={darkMode}>
          <SkillLevelButton 
            $active={skillLevel === 'beginner'} 
            $level="beginner"
            $isDark={darkMode}
            onClick={() => setSkillLevel('beginner')}
          >
            Beginner
          </SkillLevelButton>
          <SkillLevelButton 
            $active={skillLevel === 'advanced'} 
            $level="advanced"
            $isDark={darkMode}
            onClick={() => setSkillLevel('advanced')}
          >
            Advanced
          </SkillLevelButton>
          <SkillLevelButton 
            $active={skillLevel === 'ninja'} 
            $level="ninja"
            $isDark={darkMode}
            onClick={() => setSkillLevel('ninja')}
          >
            Ninja
          </SkillLevelButton>
        </SkillLevelToggle>
        
        <ThemeToggle onClick={toggleDarkMode} $isDark={darkMode}>
          {darkMode ? '☀️' : '🌙'}
        </ThemeToggle>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
