import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';

interface VideoTutorialProps {
  videoId: string;
  title: string;
  description: string;
  category?: 'beginner' | 'advanced' | 'ninja';
  timestamp?: Record<string, number>;
}

const VideoContainer = styled(motion.div)`
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background-color: ${props => props.theme === 'dark' ? 'var(--color-dark-light)' : 'var(--color-white)'};
  margin-bottom: 2rem;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3<{ category?: string }>`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => {
    if (!props.category) return 'inherit';
    switch (props.category) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'inherit';
    }
  }};
`;

const VideoDescription = styled.p`
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  margin-bottom: 1rem;
`;

const TimestampContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TimestampButton = styled.button<{ category?: string }>`
  background-color: ${props => {
    if (!props.category) return 'var(--color-light-dark)';
    switch (props.category) {
      case 'beginner': return 'rgba(59, 130, 246, 0.1)';
      case 'advanced': return 'rgba(236, 72, 153, 0.1)';
      case 'ninja': return 'rgba(139, 92, 246, 0.1)';
      default: return 'var(--color-light-dark)';
    }
  }};
  color: ${props => {
    if (!props.category) return 'var(--color-dark)';
    switch (props.category) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-dark)';
    }
  }};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => {
      if (!props.category) return 'var(--color-light-dark)';
      switch (props.category) {
        case 'beginner': return 'rgba(59, 130, 246, 0.2)';
        case 'advanced': return 'rgba(236, 72, 153, 0.2)';
        case 'ninja': return 'rgba(139, 92, 246, 0.2)';
        default: return 'var(--color-light-dark)';
      }
    }};
  }
`;

const CategoryBadge = styled.span<{ category: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
  background-color: ${props => {
    switch (props.category) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
  color: var(--color-white);
`;

const VideoTutorial: React.FC<VideoTutorialProps> = ({
  videoId,
  title,
  description,
  category,
  timestamp = {}
}) => {
  const { darkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimestampClick = (time: number) => {
    setCurrentTime(time);
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [time, true]
        }),
        '*'
      );
    }
  };

  return (
    <VideoContainer
      theme={darkMode ? 'dark' : 'light'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VideoWrapper>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${currentTime}&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </VideoWrapper>
      <VideoInfo>
        {category && <CategoryBadge category={category}>{category}</CategoryBadge>}
        <VideoTitle category={category}>{title}</VideoTitle>
        <VideoDescription theme={darkMode ? 'dark' : 'light'}>{description}</VideoDescription>
        
        {Object.keys(timestamp).length > 0 && (
          <>
            <h4>Key Moments</h4>
            <TimestampContainer>
              {Object.entries(timestamp).map(([label, time]) => (
                <TimestampButton
                  key={label}
                  category={category}
                  onClick={() => handleTimestampClick(time)}
                >
                  {label}
                </TimestampButton>
              ))}
            </TimestampContainer>
          </>
        )}
      </VideoInfo>
    </VideoContainer>
  );
};

export default VideoTutorial;
