/**
 * Unified Agentic System - Agent Conversation Implementation
 * Based on OpenAI function calling & tools guidelines (March 2025)
 * https://platform.openai.com/docs/guides/function-calling
 * https://platform.openai.com/docs/guides/tools
 */

import { OpenAIModel, getOpenAIClient, isValidModel, AgentTool, AgentMessage } from './openai';

/**
 * Multi-agent conversation using OpenAI's function calling for agency control
 * Implements the Unified Agentic System methodology with proper state tracking
 */
export async function createAgentConversation(
  messages: AgentMessage[],
  availableTools: AgentTool[],
  model: OpenAIModel | string = OpenAIModel.O1_LATEST,
  temperature: number = 0.7,
  maxTokens?: number
): Promise<AgentMessage> {
  if (!isValidModel(model)) {
    throw new Error(`Invalid model specified: ${model}. Please use one of the supported models.`);
  }

  const client = getOpenAIClient();
  
  const response = await client.chat.completions.create({
    model: model as string,
    messages: messages as any[],
    tools: availableTools,
    temperature,
    ...(maxTokens && { max_tokens: maxTokens }),
  });

  return response.choices[0].message as AgentMessage;
}

/**
 * Helper function to execute agent tool calls based on model response
 * Part of the Unified Agentic System for managing tool execution flow
 */
export async function executeToolCalls(
  message: AgentMessage,
  toolImplementations: Record<string, (args: any) => Promise<any>>
): Promise<AgentMessage[]> {
  if (!message.tool_calls || message.tool_calls.length === 0) {
    return [];
  }

  const toolResponses: AgentMessage[] = [];
  
  for (const toolCall of message.tool_calls) {
    const { id, function: { name, arguments: argsString } } = toolCall;
    
    if (!toolImplementations[name]) {
      throw new Error(`Tool implementation not found for: ${name}`);
    }
    
    try {
      const args = JSON.parse(argsString);
      const result = await toolImplementations[name](args);
      
      toolResponses.push({
        role: 'tool',
        tool_call_id: id,
        content: typeof result === 'string' ? result : JSON.stringify(result)
      });
    } catch (error) {
      toolResponses.push({
        role: 'tool',
        tool_call_id: id,
        content: `Error executing tool: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
  
  return toolResponses;
}

/**
 * Run a full agent conversation with tool execution until completion
 * Core component of the Unified Agentic System for agent orchestration
 */
export async function runAgentConversationWithTools(
  initialMessages: AgentMessage[],
  availableTools: AgentTool[],
  toolImplementations: Record<string, (args: any) => Promise<any>>,
  model: OpenAIModel | string = OpenAIModel.O1_LATEST,
  maxTurns: number = 10,
  temperature: number = 0.7
): Promise<AgentMessage[]> {
  let currentMessages = [...initialMessages];
  let turns = 0;
  
  while (turns < maxTurns) {
    // Get agent response
    const agentResponse = await createAgentConversation(
      currentMessages,
      availableTools,
      model,
      temperature
    );
    
    // Add agent response to conversation
    currentMessages.push(agentResponse);
    
    // Check if agent is calling tools
    if (!agentResponse.tool_calls || agentResponse.tool_calls.length === 0) {
      // No tool calls, conversation is complete
      break;
    }
    
    // Execute tool calls
    const toolResponses = await executeToolCalls(agentResponse, toolImplementations);
    
    // Add tool responses to conversation
    currentMessages = [...currentMessages, ...toolResponses];
    
    turns++;
  }
  
  return currentMessages;
}

/**
 * Create a simple agent with a single tool for structured output
 * Useful for applications needing predictable JSON responses
 */
export async function createStructuredOutputAgent<T>(
  systemPrompt: string,
  userPrompt: string,
  outputSchema: any,
  model: OpenAIModel | string = OpenAIModel.O1_LATEST,
  temperature: number = 0.7
): Promise<T> {
  const tools: AgentTool[] = [{
    type: 'function',
    function: {
      name: 'generate_structured_output',
      description: 'Generate structured data according to the specified schema',
      parameters: outputSchema
    }
  }];
  
  const initialMessages: AgentMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
  
  const toolImplementations = {
    generate_structured_output: async (args: any) => args
  };
  
  const conversation = await runAgentConversationWithTools(
    initialMessages,
    tools,
    toolImplementations,
    model,
    1,
    temperature
  );
  
  // Find the tool response with the structured output
  const toolResponse = conversation.find(msg => 
    msg.role === 'tool' && 
    msg.content !== null
  );
  
  if (!toolResponse || !toolResponse.content) {
    throw new Error('No structured output was generated');
  }
  
  return typeof toolResponse.content === 'string' 
    ? JSON.parse(toolResponse.content) 
    : toolResponse.content;
}
