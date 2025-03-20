// Define JSON schemas for structured outputs

export const codeAnalysisSchema = {
  type: "object",
  properties: {
    analysis: {
      type: "object",
      properties: {
        skillLevel: {
          type: "string",
          enum: ["beginner", "advanced", "ninja"],
          description: "The estimated skill level reflected in the code"
        },
        codeQuality: {
          type: "number",
          minimum: 0,
          maximum: 10,
          description: "Code quality score from 0-10"
        },
        strengths: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Key strengths of the code"
        },
        weaknesses: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Areas for improvement"
        },
        suggestedImprovements: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              codeExample: { type: "string" }
            },
            required: ["title", "description", "codeExample"]
          },
          description: "Suggested code improvements with examples"
        }
      },
      required: ["skillLevel", "codeQuality", "strengths", "weaknesses", "suggestedImprovements"]
    }
  },
  required: ["analysis"]
};

export const codeGenerationSchema = {
  type: "object",
  properties: {
    code: {
      type: "object",
      properties: {
        language: {
          type: "string",
          description: "Programming language of the generated code"
        },
        snippet: {
          type: "string",
          description: "The generated code snippet"
        },
        explanation: {
          type: "string",
          description: "Explanation of how the code works"
        },
        possibleExtensions: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Possible ways to extend or enhance the code"
        }
      },
      required: ["language", "snippet", "explanation", "possibleExtensions"]
    }
  },
  required: ["code"]
};

// Types for TypeScript
export interface CodeAnalysisResult {
  analysis: {
    skillLevel: "beginner" | "advanced" | "ninja";
    codeQuality: number;
    strengths: string[];
    weaknesses: string[];
    suggestedImprovements: {
      title: string;
      description: string;
      codeExample: string;
    }[];
  };
}

export interface CodeGenerationResult {
  code: {
    language: string;
    snippet: string;
    explanation: string;
    possibleExtensions: string[];
  };
}
