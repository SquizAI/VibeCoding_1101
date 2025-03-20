import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useTheme } from '../../styles/ThemeProvider';

// Define type for themed props
type ThemedProps = {
  darkMode: boolean;
};
import Header from '../common/Header';
import Footer from '../common/Footer';

const PageContainer = styled.div<ThemedProps>`
  min-height: 100vh;
  background-color: ${props => props.darkMode ? 'var(--color-dark)' : 'var(--color-light)'};
  color: ${props => props.darkMode ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1rem;
  margin-bottom: 4rem;
`;

const HeroTitle = styled(motion.h1)<{ level?: 'beginner' | 'advanced' | 'ninja' }>`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: ${props => {
    switch (props.level) {
      case 'beginner': return 'linear-gradient(90deg, var(--color-beginner) 0%, #60a5fa 100%)';
      case 'advanced': return 'linear-gradient(90deg, var(--color-advanced) 0%, #f472b6 100%)';
      case 'ninja': return 'linear-gradient(90deg, var(--color-ninja) 0%, #a78bfa 100%)';
      default: return 'linear-gradient(90deg, var(--color-primary) 0%, #8b5cf6 100%)';
    }
  }};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 400;
  margin-bottom: 2.5rem;
  max-width: 800px;
  line-height: 1.5;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled(Link)<{ variant: 'primary' | 'secondary'; level: string }>`
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background-color: ${props => {
    if (props.variant === 'secondary') return 'transparent';
    switch (props.level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
  color: ${props => props.variant === 'primary' ? 'white' : 
    props.level === 'beginner' ? 'var(--color-beginner)' : 
    props.level === 'advanced' ? 'var(--color-advanced)' : 
    'var(--color-ninja)'};
  border: 2px solid ${props => {
    switch (props.level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
  border-radius: var(--border-radius-full);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    background-color: ${props => {
      if (props.variant === 'secondary') {
        switch (props.level) {
          case 'beginner': return 'rgba(59, 130, 246, 0.1)';
          case 'advanced': return 'rgba(236, 72, 153, 0.1)';
          case 'ninja': return 'rgba(139, 92, 246, 0.1)';
          default: return 'rgba(109, 40, 217, 0.1)';
        }
      }
      return '';
    }};
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)<ThemedProps>`
  background-color: ${props => props.darkMode ? 'var(--color-dark-light)' : 'var(--color-white)'};
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div<{ level: string }>`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => {
    switch (props.level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  line-height: 1.6;
`;

const SkillLevelsSection = styled.section`
  margin-bottom: 4rem;
`;

const SkillLevelCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const SkillLevelCard = styled(motion.div)<{ level: string, darkMode: boolean }>`
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background-color: ${props => props.darkMode ? 'var(--color-dark-light)' : 'var(--color-white)'};
  border-top: 5px solid ${props => {
    switch (props.level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const SkillLevelHeader = styled.div<{ level: string, darkMode: boolean }>`
  padding: 1.5rem;
  background-color: ${props => {
    if (props.darkMode) return 'rgba(0, 0, 0, 0.2)';
    switch (props.level) {
      case 'beginner': return 'rgba(59, 130, 246, 0.05)';
      case 'advanced': return 'rgba(236, 72, 153, 0.05)';
      case 'ninja': return 'rgba(139, 92, 246, 0.05)';
      default: return 'rgba(109, 40, 217, 0.05)';
    }
  }};
`;

const SkillLevelTitle = styled.h3<{ level: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => {
    switch (props.level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
`;

const SkillLevelContent = styled.div`
  padding: 1.5rem;
`;

const SkillLevelDescription = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SkillLevelFeatures = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const SkillLevelFeatureItem = styled.li`
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

const CTASection = styled.section<ThemedProps>`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${props => props.darkMode ? 'var(--color-dark-light)' : 'rgba(109, 40, 217, 0.05)'};
  border-radius: var(--border-radius-lg);
  margin-bottom: 4rem;
`;

const CTATitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const CTADescription = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const features = [
  {
    icon: '🎬',
    title: 'Interactive Video Tutorials',
    description: 'Watch step-by-step video tutorials demonstrating real-world Vibe Coding techniques.'
  },
  {
    icon: '💻',
    title: 'Live Code Editors',
    description: 'Try out Vibe Coding techniques directly in the browser with our interactive code editors.'
  },
  {
    icon: '🤖',
    title: 'AI Workflow Demonstrations',
    description: 'See how different AI coding assistants approach the same problem across skill levels.'
  },
  {
    icon: '🔍',
    title: 'Prompt Engineering Examples',
    description: 'Learn how to craft effective prompts to get the best results from AI assistants.'
  },
  {
    icon: '📈',
    title: 'Skill Level Progression',
    description: 'Track your progress from beginner to ninja with tailored content for your skill level.'
  },
  {
    icon: '🧩',
    title: 'Comprehensive Workflows',
    description: 'Complete end-to-end workflows showing how to integrate AI into your development process.'
  }
];

const skillLevels = [
  {
    level: 'beginner',
    title: 'Beginner',
    description: 'Perfect for those just starting with AI-assisted coding. Learn the fundamentals and build confidence.',
    features: [
      'Introduction to AI coding assistants',
      'Basic prompt engineering techniques',
      'Simple project scaffolding with Bolt.new',
      'Fundamental workflows for common tasks',
      'Best practices for getting started'
    ]
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: 'For experienced developers looking to optimize their workflow and build more complex applications.',
    features: [
      'Advanced prompt engineering strategies',
      'Complex project structuring with Cursor',
      'Optimizing code quality and performance',
      'Debugging and refactoring techniques',
      'Building robust, production-ready features'
    ]
  },
  {
    level: 'ninja',
    title: 'Ninja',
    description: 'Master AI-human collaboration with cutting-edge techniques and achieve maximum efficiency.',
    features: [
      'Expert-level prompt chaining and workflows',
      'Cognitive frameworks for AI-human collaboration',
      'Pushing the boundaries with Windsurf',
      'Creating custom tools and extensions',
      'Teaching AI to learn your coding style'
    ]
  }
];

const HomePage: React.FC = () => {
  const { darkMode, skillLevel, setSkillLevel } = useTheme();
  
  // Animation hooks for sections
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [skillLevelsRef, skillLevelsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  return (
    <PageContainer darkMode={darkMode}>
      <Header />
      
      <MainContent>
        <HeroSection ref={heroRef}>
          <HeroTitle 
            level={skillLevel}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            The Vibe Coding Revolution
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to the interactive chapter of Vibe Coding 101 — the definitive guide to mastering AI-assisted development. Explore, experiment, and elevate your coding skills.
          </HeroSubtitle>
          
          <ButtonContainer
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button to="/interactive-demo" variant="primary" level={skillLevel}>
              Start Interactive Demo
            </Button>
            <Button to="/examples" variant="secondary" level={skillLevel}>
              View Examples
            </Button>
          </ButtonContainer>
        </HeroSection>
        
        <FeaturesSection ref={featuresRef}>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Interactive Learning Experience
          </SectionTitle>
          
          <FeaturesGrid
            as={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                darkMode={darkMode}
                variants={fadeIn}
              >
                <FeatureIcon level={skillLevel}>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
        
        <SkillLevelsSection ref={skillLevelsRef}>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={skillLevelsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Choose Your Skill Level
          </SectionTitle>
          
          <SkillLevelCards
            as={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate={skillLevelsInView ? "visible" : "hidden"}
          >
            {skillLevels.map((level, index) => (
              <SkillLevelCard
                key={index}
                level={level.level}
                darkMode={darkMode}
                variants={fadeIn}
                onClick={() => setSkillLevel(level.level as 'beginner' | 'advanced' | 'ninja')}
              >
                <SkillLevelHeader level={level.level} darkMode={darkMode}>
                  <SkillLevelTitle level={level.level}>{level.title}</SkillLevelTitle>
                </SkillLevelHeader>
                
                <SkillLevelContent>
                  <SkillLevelDescription>{level.description}</SkillLevelDescription>
                  
                  <SkillLevelFeatures>
                    {level.features.map((feature, featureIndex) => (
                      <SkillLevelFeatureItem key={featureIndex}>
                        {feature}
                      </SkillLevelFeatureItem>
                    ))}
                  </SkillLevelFeatures>
                  
                  <Button
                    to={`/${level.level}`}
                    variant="primary"
                    level={level.level}
                    style={{ width: '100%' }}
                  >
                    Explore {level.title} Content
                  </Button>
                </SkillLevelContent>
              </SkillLevelCard>
            ))}
          </SkillLevelCards>
        </SkillLevelsSection>
        
        <CTASection darkMode={darkMode} ref={ctaRef}>
          <CTATitle
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Coding?
          </CTATitle>
          
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dive into the interactive experience and discover how Vibe Coding can revolutionize your development workflow. Start with the demo, explore examples, and find your optimal path to mastery.
          </CTADescription>
          
          <Button
            to="/interactive-demo"
            variant="primary"
            level={skillLevel}
            as={motion.a}
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Get Started Now
          </Button>
        </CTASection>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default HomePage;
