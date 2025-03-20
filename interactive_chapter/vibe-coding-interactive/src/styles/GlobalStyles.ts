import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #6d28d9;
    --color-primary-light: #8b5cf6;
    --color-primary-dark: #5b21b6;
    --color-secondary: #10b981;
    --color-secondary-light: #34d399;
    --color-secondary-dark: #059669;
    --color-beginner: #3b82f6;
    --color-advanced: #ec4899;
    --color-ninja: #8b5cf6;
    --color-dark: #111827;
    --color-dark-light: #1f2937;
    --color-light: #f9fafb;
    --color-light-dark: #e5e7eb;
    --color-danger: #ef4444;
    --color-warning: #f59e0b;
    --color-success: #10b981;
    --color-gray: #6b7280;
    --color-white: #ffffff;
    
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-code: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
    --border-radius-full: 9999px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: var(--font-primary);
    color: var(--color-dark);
    background-color: var(--color-light);
    line-height: 1.5;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.5rem;
  }

  h3 {
    font-size: 2rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: var(--color-primary-dark);
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  code {
    font-family: var(--font-code);
    background-color: var(--color-light-dark);
    padding: 0.1em 0.3em;
    border-radius: var(--border-radius-sm);
    font-size: 0.9em;
  }

  pre {
    font-family: var(--font-code);
    background-color: var(--color-dark);
    color: var(--color-light);
    padding: 1rem;
    border-radius: var(--border-radius-md);
    overflow-x: auto;
    font-size: 0.9em;
    margin: 1rem 0;
  }

  button {
    cursor: pointer;
    font-family: var(--font-primary);
  }

  input, textarea, select {
    font-family: var(--font-primary);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section {
    padding: 4rem 0;
  }

  .text-center {
    text-align: center;
  }

  .text-beginner {
    color: var(--color-beginner);
  }

  .text-advanced {
    color: var(--color-advanced);
  }

  .text-ninja {
    color: var(--color-ninja);
  }
  
  .dark-mode {
    color: var(--color-light);
    background-color: var(--color-dark);
    
    code {
      background-color: var(--color-dark-light);
      color: var(--color-light);
    }
    
    pre {
      background-color: var(--color-dark-light);
    }
  }
`;

export default GlobalStyles;
