import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';

interface ThemedProps {
  $isDark: boolean;
}

const FooterContainer = styled.footer<ThemedProps>`
  padding: 2rem;
  background-color: ${props => props.$isDark ? 'var(--color-dark-light)' : 'var(--color-light-dark)'};
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface TitleProps {
  $level: string;
}

const FooterTitle = styled.h3<TitleProps>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => {
    switch (props.$level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
`;

interface FooterLinkProps extends ThemedProps {
  $level: string;
}

const FooterLink = styled.a<FooterLinkProps>`
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.$level === 'beginner' ? 'var(--color-beginner)' : 
      props.$level === 'advanced' ? 'var(--color-advanced)' : 'var(--color-ninja)'};
  }
`;

const FooterText = styled.p`
  margin-bottom: 0.5rem;
`;

const Copyright = styled.div<ThemedProps>`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  text-align: center;
  font-size: 0.875rem;
`;

const Footer: React.FC = () => {
  const { darkMode, skillLevel } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer $isDark={darkMode}>
      <FooterContent>
        <FooterSection>
          <FooterTitle $level={skillLevel}>Vibe Coding 101</FooterTitle>
          <FooterText>
            The definitive guide to AI-assisted development, providing a comprehensive introduction to the principles, practices, and applications of Vibe Coding.
          </FooterText>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle $level={skillLevel}>Tools</FooterTitle>
          <FooterLink 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Bolt.new
          </FooterLink>
          <FooterLink 
            href="https://cursor.sh" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Cursor
          </FooterLink>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Windsurf
          </FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle $level={skillLevel}>Resources</FooterTitle>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            YouTube Channel
          </FooterLink>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Research Papers
          </FooterLink>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Community Forum
          </FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle $level={skillLevel}>Connect</FooterTitle>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Twitter
          </FooterLink>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            GitHub
          </FooterLink>
          <FooterLink 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={darkMode}
            $level={skillLevel}
          >
            Discord
          </FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright $isDark={darkMode}>
        © {currentYear} Vibe Coding 101. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
