import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';
import logger from '../utils/logger';

export interface ContentGenerationOptions {
  businessName: string;
  businessType: string;
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  keywords?: string[];
}

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generatePostContent(options: ContentGenerationOptions): Promise<string> {
    try {
      const { businessName, businessType, targetAudience, tone = 'professional', keywords = [] } = options;

      const prompt = `Generate a compelling Google Business Profile post for ${businessName}, a ${businessType} business.
Target audience: ${targetAudience || 'general public'}
Tone: ${tone}
Keywords to include: ${keywords.join(', ')}

Requirements:
- Keep it under 1500 characters
- Include a clear call-to-action
- Make it engaging and relevant
- Use emojis sparingly
- Focus on customer value

Generate only the post content without any additional explanation.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('AI post generation error:', error);
      throw new Error('Failed to generate post content');
    }
  }

  async generateBusinessDescription(options: ContentGenerationOptions): Promise<string> {
    try {
      const { businessName, businessType, keywords = [] } = options;

      const prompt = `Write a compelling business description for ${businessName}, a ${businessType}.
Keywords: ${keywords.join(', ')}

Requirements:
- Keep it under 750 characters
- Highlight unique selling points
- Include relevant keywords naturally
- Make it SEO-friendly
- Focus on benefits to customers

Generate only the description without any additional explanation.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('AI description generation error:', error);
      throw new Error('Failed to generate business description');
    }
  }

  async generateReviewResponse(reviewText: string, rating: number): Promise<string> {
    try {
      const prompt = `Generate a professional and empathetic response to this ${rating}-star review:
"${reviewText}"

Requirements:
- Be genuine and personalized
- Thank the customer
- ${rating >= 4 ? 'Show appreciation' : 'Address concerns professionally'}
- Keep it under 500 characters
- Use appropriate tone

Generate only the response without any additional explanation.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('AI review response generation error:', error);
      throw new Error('Failed to generate review response');
    }
  }

  async generateBlogPost(options: ContentGenerationOptions & { topic: string }): Promise<{ title: string; content: string }> {
    try {
      const { businessName, businessType, topic, keywords = [] } = options;

      const prompt = `Write a comprehensive blog post about "${topic}" for ${businessName}, a ${businessType}.
Keywords: ${keywords.join(', ')}

Requirements:
- Create an engaging title
- Write 800-1200 words
- Include relevant keywords naturally
- Use proper HTML formatting (h2, h3, p, ul, strong)
- Make it informative and valuable
- Include a conclusion with call-to-action

Format the response as JSON with 'title' and 'content' fields.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      try {
        return JSON.parse(text);
      } catch {
        // Fallback if not valid JSON
        return {
          title: topic,
          content: text,
        };
      }
    } catch (error) {
      logger.error('AI blog post generation error:', error);
      throw new Error('Failed to generate blog post');
    }
  }

  async analyzeSEO(content: string, keywords: string[]): Promise<any> {
    try {
      const prompt = `Analyze this content for SEO optimization:
"${content}"

Target keywords: ${keywords.join(', ')}

Provide analysis on:
1. Keyword usage and density
2. Readability score
3. Content quality
4. Suggestions for improvement

Format as JSON with fields: keywordDensity, readabilityScore, contentQuality, suggestions (array).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch {
        return {
          error: 'Failed to parse SEO analysis',
          rawResponse: text,
        };
      }
    } catch (error) {
      logger.error('AI SEO analysis error:', error);
      throw new Error('Failed to analyze SEO');
    }
  }

  async generateCompetitorInsights(competitorData: any[]): Promise<string> {
    try {
      const dataStr = JSON.stringify(competitorData);
      
      const prompt = `Analyze this competitor data and provide actionable insights:
${dataStr}

Provide insights on:
1. Market positioning
2. Competitive advantages
3. Areas for improvement
4. Recommended actions

Keep the analysis concise and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('AI competitor insights error:', error);
      throw new Error('Failed to generate competitor insights');
    }
  }
}

export default new AIService();
