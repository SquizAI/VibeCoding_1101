import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';
import Header from '../common/Header';
import Footer from '../common/Footer';
import SkillLevelComparison from '../common/SkillLevelComparison';
import CodeAnalyzer from '../features/CodeAnalyzer';

// Styled components for the page layout
const PageContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2<{ $level: string }>`
  font-size: 2rem;
  font-weight: 700;
  margin: 3rem 0 1.5rem;
  color: ${props => {
    switch(props.$level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
  text-align: center;
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ExampleCard = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark-accent)' : 'var(--color-light-accent)'};
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ExampleTitle = styled.h3<{ $level: string }>`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => {
    switch(props.$level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'var(--color-primary)';
    }
  }};
`;

const ExampleDescription = styled.p`
  margin-bottom: 1.5rem;
`;

// Sample code examples for different skill levels
const codeExamples = {
  httpRequest: {
    title: "Making HTTP Requests",
    beginner: {
      description: "Using fetch with basic error handling",
      code: `// Basic fetch request with error handling
async function getUser(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}`,
      language: "javascript"
    },
    advanced: {
      description: "Using axios with response interceptors and timeout",
      code: `// Advanced axios implementation with interceptors
import axios from 'axios';

// Create API instance with base configuration
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.status, error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error:', error.request);
    } else {
      // Error in request configuration
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// User API service
const userService = {
  getUser: (userId) => api.get(\`/users/\${userId}\`),
  updateUser: (userId, data) => api.put(\`/users/\${userId}\`, data),
  deleteUser: (userId) => api.delete(\`/users/\${userId}\`)
};

export default userService;`,
      language: "javascript"
    },
    ninja: {
      description: "Using a custom fetch wrapper with retries, caching, and observability",
      code: `// Ninja-level HTTP client with advanced features
import { createCache } from './cache';
import { logger } from './observability';

// Configuration types
type RetryConfig = {
  maxRetries: number;
  baseDelay: number;
  backoffFactor: number;
  retryStatusCodes: number[];
};

type CacheConfig = {
  enabled: boolean;
  ttl: number; // time to live in seconds
  maxSize: number; // maximum cache entries
  keyGenerator?: (request: Request) => string;
};

type HttpClientConfig = {
  baseUrl: string;
  timeout: number;
  defaultHeaders?: Record<string, string>;
  retry?: RetryConfig;
  cache?: CacheConfig;
  hooks?: {
    beforeRequest?: (request: Request) => Request;
    afterResponse?: (response: Response) => Response;
    onError?: (error: Error, request: Request) => void;
  };
};

// Default configurations
const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 300,
  backoffFactor: 2,
  retryStatusCodes: [408, 429, 500, 502, 503, 504]
};

const defaultCacheConfig: CacheConfig = {
  enabled: true,
  ttl: 300, // 5 minutes
  maxSize: 100,
  keyGenerator: (request: Request) => \`\${request.method}:\${request.url}\`
};

// HTTP client implementation
export class HttpClient {
  private config: HttpClientConfig;
  private cache: Map<string, { data: any; expiresAt: number }>;
  
  constructor(config: HttpClientConfig) {
    this.config = {
      ...config,
      retry: { ...defaultRetryConfig, ...config.retry },
      cache: { ...defaultCacheConfig, ...config.cache }
    };
    
    this.cache = this.config.cache?.enabled 
      ? createCache({ maxSize: this.config.cache.maxSize })
      : new Map();
  }
  
  async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const startTime = performance.now();
    const fullUrl = this.resolveUrl(url);
    const request = this.createRequest(fullUrl, options);
    
    // Apply hooks before request
    const finalRequest = this.config.hooks?.beforeRequest
      ? this.config.hooks.beforeRequest(request)
      : request;
    
    // Check cache first if it's a GET request
    if (options.method === 'GET' && this.config.cache?.enabled) {
      const cacheKey = this.getCacheKey(finalRequest);
      const cachedResponse = this.getFromCache(cacheKey);
      
      if (cachedResponse) {
        logger.debug('Cache hit', { url: fullUrl, cacheKey });
        return cachedResponse;
      }
    }
    
    try {
      return await this.executeWithRetry<T>(finalRequest);
    } catch (error) {
      // Call error hook if configured
      if (this.config.hooks?.onError) {
        this.config.hooks.onError(error as Error, finalRequest);
      }
      
      logger.error('Request failed', {
        url: fullUrl,
        method: options.method || 'GET',
        error: (error as Error).message,
        duration: performance.now() - startTime
      });
      
      throw error;
    }
  }
  
  // Helper methods for the class implementation...
  
  private async executeWithRetry<T>(request: Request, retryCount = 0): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(request.clone(), {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Apply after response hook if configured
      const finalResponse = this.config.hooks?.afterResponse
        ? this.config.hooks.afterResponse(response.clone())
        : response;
      
      if (!finalResponse.ok) {
        const { retry } = this.config;
        const shouldRetry = 
          retryCount < retry!.maxRetries && 
          retry!.retryStatusCodes.includes(finalResponse.status);
          
        if (shouldRetry) {
          const delay = retry!.baseDelay * Math.pow(retry!.backoffFactor, retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.executeWithRetry<T>(request, retryCount + 1);
        }
      }
      
      const data = await finalResponse.json();
      
      // Cache successful GET responses
      if (request.method === 'GET' && this.config.cache?.enabled && finalResponse.ok) {
        const cacheKey = this.getCacheKey(request);
        this.storeInCache(cacheKey, data);
      }
      
      return data as T;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error(\`Request timeout exceeded \${this.config.timeout}ms\`);
      }
      throw error;
    }
  }
  
  // Additional helper methods for URL resolution, request creation, etc.
  
  private resolveUrl(url: string): string {
    return url.startsWith('http') ? url : \`\${this.config.baseUrl}\${url}\`;
  }
  
  private createRequest(url: string, options: RequestInit): Request {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...this.config.defaultHeaders,
      ...options.headers
    });
    
    return new Request(url, {
      ...options,
      headers
    });
  }
  
  private getCacheKey(request: Request): string {
    const keyGenerator = this.config.cache?.keyGenerator || defaultCacheConfig.keyGenerator;
    return keyGenerator!(request);
  }
  
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }
    
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }
  
  private storeInCache(key: string, data: any): void {
    const ttl = this.config.cache?.ttl || defaultCacheConfig.ttl;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl * 1000
    });
  }
}

// Usage examples
const apiClient = new HttpClient({
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  defaultHeaders: {
    'X-API-Version': '1.0'
  },
  hooks: {
    beforeRequest: (request) => {
      // Add auth token to request
      const token = localStorage.getItem('auth_token');
      if (token) {
        request.headers.set('Authorization', \`Bearer \${token}\`);
      }
      return request;
    },
    onError: (error, request) => {
      // Send error to monitoring service
      logger.error('API request failed', {
        url: request.url,
        method: request.method,
        error: error.message
      });
    }
  }
});

// API service using the HTTP client
export const userApi = {
  getUser: (id: string) => apiClient.fetch<User>(\`/users/\${id}\`),
  updateUser: (id: string, data: UserUpdateData) => 
    apiClient.fetch<User>(\`/users/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};`,
      language: "typescript"
    }
  },
  
  stateManagement: {
    title: "React State Management",
    beginner: {
      description: "Using useState hook for simple state management",
      code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`,
      language: "jsx"
    },
    advanced: {
      description: "Using useReducer and context for application state",
      code: `import React, { createContext, useContext, useReducer } from 'react';

// Define action types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const RESET = 'RESET';
const SET_VALUE = 'SET_VALUE';

// Initial state
const initialState = {
  count: 0,
  lastUpdated: null
};

// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case INCREMENT:
      return { 
        ...state, 
        count: state.count + 1, 
        lastUpdated: new Date() 
      };
    case DECREMENT:
      return { 
        ...state, 
        count: state.count - 1, 
        lastUpdated: new Date() 
      };
    case RESET:
      return { 
        ...state, 
        count: 0, 
        lastUpdated: new Date() 
      };
    case SET_VALUE:
      return { 
        ...state, 
        count: action.payload, 
        lastUpdated: new Date() 
      };
    default:
      return state;
  }
}

// Create context
const CounterContext = createContext();

// Provider component
export function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  
  // Action creators
  const increment = () => dispatch({ type: INCREMENT });
  const decrement = () => dispatch({ type: DECREMENT });
  const reset = () => dispatch({ type: RESET });
  const setValue = (value) => dispatch({ 
    type: SET_VALUE, 
    payload: parseInt(value, 10) 
  });
  
  const value = {
    state,
    actions: {
      increment,
      decrement,
      reset,
      setValue
    }
  };
  
  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
}

// Custom hook for using the counter
export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
}

// Counter component using the context
function Counter() {
  const { state, actions } = useCounter();
  
  return (
    <div>
      <h2>Count: {state.count}</h2>
      {state.lastUpdated && (
        <p>Last updated: {state.lastUpdated.toLocaleTimeString()}</p>
      )}
      <div>
        <button onClick={actions.increment}>Increment</button>
        <button onClick={actions.decrement}>Decrement</button>
        <button onClick={actions.reset}>Reset</button>
      </div>
      <div>
        <input 
          type="number" 
          value={state.count}
          onChange={(e) => actions.setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

// App component wrapping everything with the provider
function App() {
  return (
    <CounterProvider>
      <h1>Counter App</h1>
      <Counter />
    </CounterProvider>
  );
}

export default App;`,
      language: "jsx"
    },
    ninja: {
      description: "Implementing a custom state manager with middleware and dev tools integration",
      code: `// Custom state manager with middleware pattern and dev tools
import { useState, useEffect, useRef, useCallback } from 'react';

type StateListener<T> = (state: T) => void;
type Middleware<T> = (state: T, nextState: T, action: Action) => T;
type Selector<T, S> = (state: T) => S;
type Action = { type: string; payload?: any };
type ActionCreator<P = any> = (payload?: P) => Action;

interface StoreOptions<T> {
  initialState: T;
  middleware?: Middleware<T>[];
  devTools?: boolean;
}

interface Store<T> {
  getState: () => T;
  dispatch: (action: Action) => void;
  subscribe: (listener: StateListener<T>) => () => void;
  select: <S>(selector: Selector<T, S>) => S;
}

// Create a store
function createStore<T>({
  initialState,
  middleware = [],
  devTools = false
}: StoreOptions<T>): Store<T> {
  let state = initialState;
  const listeners: Set<StateListener<T>> = new Set();
  
  // DevTools support
  const devToolsExtension = 
    devTools && 
    typeof window !== 'undefined' && 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__?.();
    
  if (devToolsExtension) {
    devToolsExtension.init(state);
  }
  
  const getState = () => state;
  
  const dispatch = (action: Action) => {
    // Apply middleware chain
    const nextState = middleware.reduce(
      (resultState, middlewareFn) => middlewareFn(state, resultState, action),
      // Deep copy initial state to prevent direct mutations
      JSON.parse(JSON.stringify(state))
    );
    
    state = nextState;
    
    // Notify listeners
    listeners.forEach(listener => listener(state));
    
    // Update dev tools
    if (devToolsExtension) {
      devToolsExtension.send(action, state);
    }
  };
  
  const subscribe = (listener: StateListener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  
  const select = <S>(selector: Selector<T, S>): S => {
    return selector(state);
  };
  
  return { getState, dispatch, subscribe, select };
}

// Common middleware
const loggingMiddleware = <T>(state: T, nextState: T, action: Action): T => {
  console.group('Action: ' + action.type);
  console.log('Previous state:', state);
  console.log('Action:', action);
  console.log('Next state:', nextState);
  console.groupEnd();
  return nextState;
};

const persistenceMiddleware = <T>(
  key: string,
  deserialize: (data: string) => T = JSON.parse,
  serialize: (state: T) => string = JSON.stringify
) => {
  // Load initial data on creation
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return deserialize(storedData);
    }
  } catch (e) {
    console.error('Failed to load persisted state:', e);
  }
  
  // Return the middleware function
  return (state: T, nextState: T, action: Action): T => {
    try {
      localStorage.setItem(key, serialize(nextState));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
    return nextState;
  };
};

// Custom hook for consuming the store
function useStore<T, S = T>(
  store: Store<T>,
  selector: Selector<T, S> = state => state as unknown as S
) {
  const [selectedState, setSelectedState] = useState<S>(() => selector(store.getState()));
  
  useEffect(() => {
    const unsubscribe = store.subscribe(state => {
      setSelectedState(selector(state));
    });
    
    return unsubscribe;
  }, [store, selector]);
  
  const dispatch = useCallback(store.dispatch, [store]);
  
  return [selectedState, dispatch] as const;
}

// Action creators factory
function createActionCreators<T extends Record<string, ActionCreator>>(actionCreators: T): T {
  return actionCreators;
}

// Usage example
interface CounterState {
  count: number;
  lastUpdated: string | null;
}

// Actions
const CounterActions = createActionCreators({
  increment: () => ({ type: 'counter/increment' }),
  decrement: () => ({ type: 'counter/decrement' }),
  reset: () => ({ type: 'counter/reset' }),
  setValue: (value: number) => ({ 
    type: 'counter/setValue', 
    payload: value 
  })
});

// Create the store
const counterStore = createStore<CounterState>({
  initialState: {
    count: 0,
    lastUpdated: null
  },
  middleware: [
    loggingMiddleware,
    // Apply state updates based on actions
    (state, nextState, action) => {
      switch (action.type) {
        case 'counter/increment':
          return {
            ...nextState,
            count: nextState.count + 1,
            lastUpdated: new Date().toISOString()
          };
        case 'counter/decrement':
          return {
            ...nextState,
            count: nextState.count - 1,
            lastUpdated: new Date().toISOString()
          };
        case 'counter/reset':
          return {
            ...nextState,
            count: 0,
            lastUpdated: new Date().toISOString()
          };
        case 'counter/setValue':
          return {
            ...nextState,
            count: action.payload,
            lastUpdated: new Date().toISOString()
          };
        default:
          return nextState;
      }
    },
    persistenceMiddleware('counter-store')
  ],
  devTools: true
});

// Counter component
function NinjaCounter() {
  const [state, dispatch] = useStore(counterStore);
  
  return (
    <div>
      <h2>Count: {state.count}</h2>
      {state.lastUpdated && (
        <p>Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}</p>
      )}
      <div>
        <button onClick={() => dispatch(CounterActions.increment())}>
          Increment
        </button>
        <button onClick={() => dispatch(CounterActions.decrement())}>
          Decrement
        </button>
        <button onClick={() => dispatch(CounterActions.reset())}>
          Reset
        </button>
      </div>
      <div>
        <input 
          type="number" 
          value={state.count}
          onChange={(e) => 
            dispatch(CounterActions.setValue(parseInt(e.target.value, 10)))
          }
        />
      </div>
    </div>
  );
}

export default NinjaCounter;`,
      language: "typescript"
    }
  }
};

interface ExampleProps {
  title: string;
  examples: {
    beginner: { description: string; code: string; language: string };
    advanced: { description: string; code: string; language: string };
    ninja: { description: string; code: string; language: string };
  };
  skillLevel: 'beginner' | 'advanced' | 'ninja';
  isDark: boolean;
}

const CodeExample: React.FC<ExampleProps> = ({ title, examples, skillLevel, isDark }) => {
  return (
    <ExampleCard $isDark={isDark}>
      <ExampleTitle $level={skillLevel}>{title}</ExampleTitle>
      <ExampleDescription>{examples[skillLevel].description}</ExampleDescription>
      
      <SkillLevelComparison 
        title={title}
        beginnerCode={examples.beginner.code}
        advancedCode={examples.advanced.code}
        ninjaCode={examples.ninja.code}
        beginnerLanguage={examples.beginner.language}
        advancedLanguage={examples.advanced.language}
        ninjaLanguage={examples.ninja.language}
        activeLevel={skillLevel}
      />
    </ExampleCard>
  );
};

const ExamplesPage: React.FC = () => {
  const { darkMode, skillLevel } = useTheme();
  
  return (
    <PageContainer $isDark={darkMode}>
      <Header />
      
      <MainContent>
        <SectionTitle $level={skillLevel}>Vibe Coding Examples</SectionTitle>
        <SectionDescription>
          Explore different coding approaches based on your skill level. 
          See how the same functionality can be implemented with varying levels of complexity and features.
        </SectionDescription>
        
        <CodeExample 
          title={codeExamples.httpRequest.title}
          examples={codeExamples.httpRequest}
          skillLevel={skillLevel}
          isDark={darkMode}
        />
        
        <CodeExample 
          title={codeExamples.stateManagement.title}
          examples={codeExamples.stateManagement}
          skillLevel={skillLevel}
          isDark={darkMode}
        />
        
        <SectionTitle $level="ninja">OpenAI API with Structured Output</SectionTitle>
        <SectionDescription>
          Experience the latest OpenAI API integration with structured output formatting.
          This example uses models like o1-2024-12-17, gpt-4o-mini-2024-07-18, and gpt-4o-2024-08-06
          to analyze your code and provide structured, actionable feedback.
        </SectionDescription>
        
        <CodeAnalyzer />
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default ExamplesPage;
