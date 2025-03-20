import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color variables */
    --color-primary: #6d28d9; /* Purple */
    --color-secondary: #4f46e5; /* Indigo */
    --color-accent: #f59e0b; /* Amber */
    
    --color-dark: #111827; /* Gray 900 */
    --color-dark-accent: #1f2937; /* Gray 800 */
    --color-light: #ffffff; /* White */
    --color-light-accent: #f3f4f6; /* Gray 100 */
    
    --color-text-dark: #111827; /* Gray 900 */
    --color-text-light: #f9fafb; /* Gray 50 */
    
    --color-beginner: #10b981; /* Emerald 500 */
    --color-advanced: #3b82f6; /* Blue 500 */
    --color-ninja: #8b5cf6; /* Violet 500 */
    
    /* Font variables */
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-code: 'Fira Code', 'Courier New', Courier, monospace;
    
    /* Spacing variables */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    
    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    
    /* Transitions */
    --transition-normal: 0.3s ease;
    --transition-fast: 0.15s ease;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--color-text-dark);
    width: 100%;
    overflow-x: hidden;
    
    /* Ensure body takes full width and centers content */
    margin: 0 auto;
    max-width: 100%;
    position: relative;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-4);
  }
  
  p {
    margin-bottom: var(--spacing-4);
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
    font-family: var(--font-primary);
  }
  
  code {
    font-family: var(--font-code);
  }
  
  /* Container classes for consistent spacing and responsive design */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
    
    @media (min-width: 768px) {
      padding: 0 var(--spacing-6);
    }
  }
  
  /* Utility classes */
  .text-center {
    text-align: center;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .w-full {
    width: 100%;
  }
  
  .h-full {
    height: 100%;
  }
  
  /* Responsive breakpoints */
  @media (max-width: 640px) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyles;
