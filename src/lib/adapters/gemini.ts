export class GeminiAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, context?: any): Promise<string> {
    return "AI-generated content placeholder";
  }

  async generateBusinessDescription(businessName: string, category: string, keywords: string[]): Promise<string> {
    return `Professional ${category} business offering quality services. ${businessName} specializes in ${keywords.join(', ')}.`;
  }

  async generatePost(business: any, topic: string): Promise<{ title: string; content: string }> {
    return {
      title: `Latest Update from ${business.name}`,
      content: `Exciting news about ${topic}! Visit us today.`,
    };
  }

  async generateReviewReply(review: any): Promise<string> {
    if (review.rating >= 4) {
      return `Thank you for your wonderful ${review.rating}-star review! We're thrilled you had a great experience.`;
    } else {
      return `Thank you for your feedback. We apologize for any inconvenience and would love to make things right.`;
    }
  }

  async analyzeSentiment(text: string): Promise<number> {
    return 0.5;
  }

  async generateBlogPost(topic: string, keywords: string[]): Promise<{ title: string; content: string; excerpt: string }> {
    return {
      title: `Guide to ${topic}`,
      content: `# Guide to ${topic}\n\nThis is a comprehensive guide about ${topic}.\n\n## Key Points\n\n- Important information\n- Helpful tips\n- Best practices`,
      excerpt: `Learn everything you need to know about ${topic} in this comprehensive guide.`,
    };
  }
}

export function createGeminiAdapter(apiKey?: string): GeminiAdapter {
  return new GeminiAdapter(apiKey || 'demo-key');
}
