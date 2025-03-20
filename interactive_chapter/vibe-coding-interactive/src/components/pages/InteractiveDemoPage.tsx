import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';
import Header from '../common/Header';
import Footer from '../common/Footer';
import VideoTutorial from '../common/VideoTutorial';
import AIWorkflowDemo from '../common/AIWorkflowDemo';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme === 'dark' ? 'var(--color-dark)' : 'var(--color-light)'};
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 3rem 0 1.5rem;
  color: ${props => props.level === 'beginner' ? 'var(--color-beginner)' : 
    props.level === 'advanced' ? 'var(--color-advanced)' : 'var(--color-ninja)'};
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

// Sample workflow steps for Bolt.new
const boltWorkflowSteps = [
  {
    id: 1,
    title: "Define Your Project",
    description: "Start by describing what you want to build to Bolt.new using natural language.",
    userInput: "Build me a simple weather app that shows the current weather and 5-day forecast for a location that the user can search for.",
    aiResponse: "I'll help you build a weather app with those features. Let's start by setting up the project structure and core components."
  },
  {
    id: 2,
    title: "Generate Project Structure",
    description: "Bolt.new will scaffold the project structure based on your requirements.",
    code: `
// Project structure
/weather-app
  /src
    /components
      App.js
      SearchBar.js
      CurrentWeather.js
      ForecastList.js
      ForecastItem.js
    /services
      weatherApi.js
    /styles
      styles.css
    index.js
  package.json
  README.md
    `,
    language: "markdown"
  },
  {
    id: 3,
    title: "Implement Core Components",
    description: "Bolt.new can generate key components based on your specifications.",
    userInput: "Create the SearchBar component that allows users to search for a city.",
    aiResponse: "Here's a SearchBar component with input validation and search functionality:",
    code: `
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.trim() === '') {
      setError('Please enter a location');
      return;
    }
    
    setError('');
    onSearch(query);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchBar;
    `,
    language: "jsx"
  },
  {
    id: 4,
    title: "Integration with API",
    description: "Bolt.new can help you implement API integration for your app.",
    userInput: "Now implement the weatherApi.js service to fetch data from a weather API.",
    aiResponse: "Here's a service to fetch weather data from the OpenWeatherMap API:",
    code: `
// weatherApi.js
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchCurrentWeather = async (city) => {
  try {
    const response = await fetch(
      \`\${BASE_URL}/weather?q=\${city}&units=metric&appid=\${API_KEY}\`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const fetchForecast = async (city) => {
  try {
    const response = await fetch(
      \`\${BASE_URL}/forecast?q=\${city}&units=metric&appid=\${API_KEY}\`
    );
    
    if (!response.ok) {
      throw new Error('Forecast data not found');
    }
    
    const data = await response.json();
    
    // Process to get one forecast per day (noon)
    const fiveDayForecast = data.list
      .filter(item => item.dt_txt.includes('12:00:00'))
      .slice(0, 5);
      
    return fiveDayForecast;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};
    `,
    language: "javascript"
  }
];

// Sample workflow steps for Cursor
const cursorWorkflowSteps = [
  {
    id: 1,
    title: "Refine Requirements",
    description: "Advanced users leverage Cursor to refine their requirements and implementation plan.",
    userInput: "I need to build a React app to visualize data from the GitHub API with filtering, sorting, and pagination. It should use TypeScript, Redux for state management, and include unit tests. Help me plan the implementation.",
    aiResponse: "Let's break this down into manageable parts. Here's an implementation plan for your GitHub data visualization app:"
  },
  {
    id: 2,
    title: "Project Setup and Type Definitions",
    description: "Cursor helps define TypeScript interfaces and project structure",
    code: `
// src/types/github.ts
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubSearchParams {
  q: string;
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}
    `,
    language: "typescript"
  },
  {
    id: 3,
    title: "Redux State Implementation",
    description: "Cursor can help implement advanced Redux patterns with TypeScript",
    userInput: "Generate the Redux slice for the GitHub API integration.",
    aiResponse: "Here's a Redux slice using Redux Toolkit with async thunks for API integration:",
    code: `
// src/store/githubSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GitHubRepo, GitHubSearchParams, GitHubSearchResponse } from '../types/github';

interface GithubState {
  repos: GitHubRepo[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  searchParams: GitHubSearchParams;
}

const initialState: GithubState = {
  repos: [],
  totalCount: 0,
  loading: false,
  error: null,
  searchParams: {
    q: 'react',
    sort: 'stars',
    order: 'desc',
    page: 1,
    per_page: 10
  }
};

export const searchRepositories = createAsyncThunk(
  'github/searchRepositories',
  async (searchParams: GitHubSearchParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
      
      const response = await fetch(
        \`https://api.github.com/search/repositories?\${queryParams.toString()}\`
      );
      
      if (!response.ok) {
        throw new Error(\`API error: \${response.status}\`);
      }
      
      const data: GitHubSearchResponse = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    updateSearchParams: (state, action: PayloadAction<Partial<GitHubSearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRepositories.fulfilled, (state, action) => {
        state.loading = false;
        state.repos = action.payload.items;
        state.totalCount = action.payload.total_count;
      })
      .addCase(searchRepositories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { updateSearchParams } = githubSlice.actions;
export default githubSlice.reducer;
    `,
    language: "typescript"
  },
  {
    id: 4,
    title: "Component Implementation",
    description: "Cursor helps implement complex components with proper typing",
    code: `
// src/components/RepositoryList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { searchRepositories, updateSearchParams } from '../store/githubSlice';
import RepositoryItem from './RepositoryItem';
import Pagination from './Pagination';
import SortingControls from './SortingControls';
import FilterControls from './FilterControls';

const RepositoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { repos, totalCount, loading, error, searchParams } = useSelector(
    (state: RootState) => state.github
  );

  useEffect(() => {
    dispatch(searchRepositories(searchParams));
  }, [dispatch, searchParams]);

  const handlePageChange = (page: number) => {
    dispatch(updateSearchParams({ page }));
  };

  const handleSortChange = (sort: 'stars' | 'forks' | 'updated', order: 'asc' | 'desc') => {
    dispatch(updateSearchParams({ 
      sort, 
      order,
      page: 1 // Reset to first page when sort changes
    }));
  };

  const handleFilterChange = (query: string) => {
    dispatch(updateSearchParams({ 
      q: query,
      page: 1 // Reset to first page when filter changes
    }));
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="repository-list">
      <div className="controls">
        <FilterControls 
          currentFilter={searchParams.q} 
          onFilterChange={handleFilterChange} 
        />
        <SortingControls 
          currentSort={searchParams.sort} 
          currentOrder={searchParams.order}
          onSortChange={handleSortChange}
        />
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="results-summary">
            Found {totalCount} repositories
          </div>
          <div className="repository-items">
            {repos.map(repo => (
              <RepositoryItem key={repo.id} repo={repo} />
            ))}
          </div>
          <Pagination 
            currentPage={searchParams.page || 1}
            totalPages={Math.min(100, Math.ceil(totalCount / (searchParams.per_page || 10)))}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default RepositoryList;
    `,
    language: "tsx"
  }
];

// Sample workflow steps for Windsurf
const windsurfWorkflowSteps = [
  {
    id: 1,
    title: "System Architecture Design",
    description: "Ninja-level users can describe high-level architecture and have Windsurf create an implementation plan.",
    userInput: "Design a microservices architecture for a scalable e-commerce platform with separate services for product catalog, user management, cart/checkout, order processing, payment, and recommendation engine. Each microservice should use the most appropriate database for its data model. Include service discovery, API gateway, and monitoring.",
    aiResponse: "I'll design a scalable microservices architecture for your e-commerce platform with appropriate technologies for each component."
  },
  {
    id: 2,
    title: "Infrastructure as Code",
    description: "Windsurf can generate infrastructure code for deploying microservices.",
    code: `
# docker-compose.yml for local development
version: '3.8'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    environment:
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - service-registry

  service-registry:
    build: ./service-registry
    ports:
      - "8761:8761"

  product-service:
    build: ./product-service
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://product-db:27017/product
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - product-db
      - service-registry

  user-service:
    build: ./user-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://user-db:5432/user
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - user-db
      - service-registry

  cart-service:
    build: ./cart-service
    environment:
      - SPRING_REDIS_HOST=cart-db
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - cart-db
      - service-registry

  order-service:
    build: ./order-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://order-db:5432/order
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - order-db
      - service-registry

  payment-service:
    build: ./payment-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://payment-db:5432/payment
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - payment-db
      - service-registry

  recommendation-service:
    build: ./recommendation-service
    environment:
      - NEO4J_URI=bolt://recommendation-db:7687
      - SERVICE_REGISTRY_URL=http://service-registry:8761/eureka
    depends_on:
      - recommendation-db
      - service-registry

  monitoring:
    build: ./monitoring
    ports:
      - "9090:9090" # Prometheus
      - "3000:3000" # Grafana
    depends_on:
      - api-gateway

  # Databases
  product-db:
    image: mongo:latest
    volumes:
      - product-data:/data/db

  user-db:
    image: postgres:latest
    environment:
      - POSTGRES_DB=user
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - user-data:/var/lib/postgresql/data

  cart-db:
    image: redis:latest
    volumes:
      - cart-data:/data

  order-db:
    image: postgres:latest
    environment:
      - POSTGRES_DB=order
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - order-data:/var/lib/postgresql/data

  payment-db:
    image: postgres:latest
    environment:
      - POSTGRES_DB=payment
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - payment-data:/var/lib/postgresql/data

  recommendation-db:
    image: neo4j:latest
    environment:
      - NEO4J_AUTH=neo4j/password
    volumes:
      - recommendation-data:/data

volumes:
  product-data:
  user-data:
  cart-data:
  order-data:
  payment-data:
  recommendation-data:
    `,
    language: "yaml"
  },
  {
    id: 3,
    title: "Service Implementation",
    description: "Windsurf can generate service implementations with proper interfaces and communication.",
    userInput: "Create the product service with proper domain model, repository, service, and controller layers. Include API documentation and proper error handling.",
    aiResponse: "Here's a Spring Boot implementation for the product service with MongoDB integration:",
    code: `
// ProductService.java
package com.ecommerce.product.service;

import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable(value = "products", key = "#id")
    public Product getProductById(String id) {
        log.info("Fetching product with id: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
    }

    public Page<Product> findProducts(String category, String query, Pageable pageable) {
        log.info("Searching products with category: {} and query: {}", category, query);
        
        if (category != null && !category.isEmpty()) {
            if (query != null && !query.isEmpty()) {
                return productRepository.findByCategoryAndNameContainingIgnoreCase(category, query, pageable);
            } else {
                return productRepository.findByCategory(category, pageable);
            }
        } else if (query != null && !query.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(query, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    public Product createProduct(Product product) {
        log.info("Creating new product: {}", product);
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", key = "#id")
    public Product updateProduct(String id, Product productDetails) {
        log.info("Updating product with id: {}", id);
        
        Product existingProduct = getProductById(id);
        
        // Update fields
        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setCategory(productDetails.getCategory());
        existingProduct.setInventory(productDetails.getInventory());
        existingProduct.setImageUrls(productDetails.getImageUrls());
        existingProduct.setAttributes(productDetails.getAttributes());
        
        return productRepository.save(existingProduct);
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(String id) {
        log.info("Deleting product with id: {}", id);
        
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }
}
    `,
    language: "java"
  },
  {
    id: 4,
    title: "API Documentation and Testing",
    description: "Windsurf generates comprehensive API documentation and test suites.",
    code: `
// ProductControllerTest.java
package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetProductById() throws Exception {
        // Given
        Product product = createSampleProduct();
        when(productService.getProductById("1")).thenReturn(product);

        // When & Then
        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("1")))
                .andExpect(jsonPath("$.name", is("Test Product")))
                .andExpect(jsonPath("$.price", is(99.99)));
    }

    @Test
    public void testFindProducts() throws Exception {
        // Given
        List<Product> products = Arrays.asList(createSampleProduct(), createSampleProduct());
        Page<Product> productPage = new PageImpl<>(products);
        
        when(productService.findProducts(eq("electronics"), eq("test"), any(Pageable.class)))
                .thenReturn(productPage);

        // When & Then
        mockMvc.perform(get("/api/v1/products")
                .param("category", "electronics")
                .param("query", "test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements", is(2)));
    }

    @Test
    public void testCreateProduct() throws Exception {
        // Given
        Product product = createSampleProduct();
        when(productService.createProduct(any(Product.class))).thenReturn(product);

        // When & Then
        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is("1")))
                .andExpect(jsonPath("$.name", is("Test Product")));
    }

    private Product createSampleProduct() {
        Product product = new Product();
        product.setId("1");
        product.setName("Test Product");
        product.setDescription("This is a test product");
        product.setPrice(new BigDecimal("99.99"));
        product.setCategory("electronics");
        product.setInventory(100);
        
        List<String> imageUrls = Arrays.asList(
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg"
        );
        product.setImageUrls(imageUrls);
        
        Map<String, String> attributes = new HashMap<>();
        attributes.put("color", "black");
        attributes.put("weight", "250g");
        product.setAttributes(attributes);
        
        return product;
    }
}
    `,
    language: "java"
  }
];

const InteractiveDemoPage: React.FC = () => {
  const { darkMode, skillLevel } = useTheme();
  
  return (
    <PageContainer theme={darkMode ? 'dark' : 'light'}>
      <Header />
      
      <MainContent>
        <SectionTitle level={skillLevel}>Interactive Vibe Coding Demo</SectionTitle>
        <SectionDescription>
          Experience the power of AI-assisted development through these interactive demonstrations.
          Each example showcases a different approach to solving coding challenges using AI tools.
        </SectionDescription>
        
        <VideoTutorial
          videoId="dQw4w9WgXcQ" // Placeholder - replace with actual video ID
          title="Introduction to Vibe Coding"
          description="This video introduces the core concepts of Vibe Coding and demonstrates how to leverage AI for more efficient and creative development."
          category={skillLevel as 'beginner' | 'advanced' | 'ninja'}
          timestamp={{
            "Introduction": 0,
            "Core Concepts": 45,
            "Demo": 120,
            "Best Practices": 240
          }}
        />
        
        <SectionTitle level="beginner">Beginner Workflow: Bolt.new</SectionTitle>
        <SectionDescription>
          For beginners, Bolt.new offers a simple yet powerful way to create projects quickly by describing
          what you want to build in natural language. Follow this demonstration to see how a weather app
          can be created with minimal coding experience.
        </SectionDescription>
        
        <AIWorkflowDemo
          title="Building a Weather App with Bolt.new"
          description="See how Bolt.new can help you build a complete weather application with just a few prompts."
          tool="bolt"
          steps={boltWorkflowSteps}
        />
        
        <SectionTitle level="advanced">Advanced Workflow: Cursor</SectionTitle>
        <SectionDescription>
          For experienced developers, Cursor provides advanced capabilities for implementing complex
          features and architectures. This demonstration shows how to build a GitHub repository explorer
          with TypeScript, Redux, and proper state management.
        </SectionDescription>
        
        <AIWorkflowDemo
          title="Building a GitHub Explorer with Cursor"
          description="See how Cursor can help experienced developers implement complex TypeScript and Redux patterns."
          tool="cursor"
          steps={cursorWorkflowSteps}
        />
        
        <SectionTitle level="ninja">Ninja Workflow: Windsurf</SectionTitle>
        <SectionDescription>
          For expert-level developers, Windsurf enables the creation of complex distributed systems
          and architectures. This demonstration shows how to design and implement a microservices
          architecture for an e-commerce platform.
        </SectionDescription>
        
        <AIWorkflowDemo
          title="Building a Microservices E-commerce Platform"
          description="See how Windsurf can help expert developers architect and implement complex distributed systems."
          tool="windsurf"
          steps={windsurfWorkflowSteps}
        />
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default InteractiveDemoPage;
