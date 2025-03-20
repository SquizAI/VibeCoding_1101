/**
 * OpenAI API integration aligned with Unified Agentic System methodology
 * Based on official OpenAI function calling & tools guidelines (March 2025)
 * https://platform.openai.com/docs/guides/function-calling
 * https://platform.openai.com/docs/guides/tools
 */

import OpenAI from 'openai';

// Define available models with their release dates
export enum OpenAIModel {
  O1_LATEST = 'o1', // Always points to latest o1 model
  O1_2024_12_17 = 'o1-2024-12-17',
  GPT4O_MINI_2024_07_18 = 'gpt-4o-mini-2024-07-18',
  GPT4O_2024_08_06 = 'gpt-4o-2024-08-06',
}

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string): OpenAI => {
  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API requests should be made through a backend
  });
  return openaiClient;
};

export const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }
  return openaiClient;
};

// Function to validate if a model meets our requirements
export const isValidModel = (model: string): boolean => {
  const validModels = Object.values(OpenAIModel);
  return validModels.includes(model as OpenAIModel);
};

// Type for JSON Schema object
interface JSONSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any; // For other JSON Schema properties
}

// Type for defining a system tool/function
export interface AgentTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: JSONSchema;
  }
}

// Type for agent message
export interface AgentMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    }
  }>;
  tool_call_id?: string;
  name?: string;
}

/**
 * Core function for structured output using OpenAI's function calling API
 * Follows the Unified Agentic System methodology for predictable, structured outputs
 */
export async function getStructuredOutput<T>(
  prompt: string,
  model: OpenAIModel | string = OpenAIModel.O1_LATEST,
  schema: JSONSchema,
  temperature: number = 0.7,
  maxTokens?: number,
  systemPrompt?: string
): Promise<T> {
  if (!isValidModel(model)) {
    throw new Error(`Invalid model specified: ${model}. Please use one of the supported models.`);
  }

  const client = getOpenAIClient();

  // Unified Agentic approach using OpenAI function calling API (March 2025 standard)
  const defaultSystemPrompt = "You are a helpful assistant that responds with structured JSON data according to the provided schema.";
  
  const response = await client.chat.completions.create({
    model: model as string,
    response_format: { type: "json_object" },
    tools: [{
      type: "function",
      function: {
        name: "get_structured_response",
        description: "Generate a structured response based on the query",
        parameters: schema
      }
    }],
    tool_choice: {
      type: "function",
      function: { name: "get_structured_response" }
    },
    messages: [
      {
        role: "system",
        content: systemPrompt || defaultSystemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature,
    ...(maxTokens && { max_tokens: maxTokens }),
  });

  try {
    // In March 2025 OpenAI format, structured responses are in the tool_calls output
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'get_structured_response') {
      throw new Error("No valid structured response returned from OpenAI");
    }
    
    return JSON.parse(toolCall.function.arguments) as T;
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    throw new Error("Failed to parse structured output from OpenAI");
  }
}
