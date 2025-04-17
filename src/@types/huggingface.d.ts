declare module '@huggingface/inference' {
  interface TextGenerationParameters {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    repetition_penalty?: number;
  }

  interface TextGenerationResponse {
    generated_text: string;
    details?: {
      finish_reason: string;
      generated_tokens: number;
    };
  }
}