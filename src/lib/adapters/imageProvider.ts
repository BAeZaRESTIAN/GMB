export type ImageProvider = 'stable-diffusion' | 'leonardo' | 'replicate';

export class ImageProviderAdapter {
  private provider: ImageProvider;
  private apiKey: string;

  constructor(provider: ImageProvider, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, options?: any): Promise<{ url: string; thumbnailUrl?: string }> {
    return {
      url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
    };
  }
}

export function createImageProviderAdapter(provider: ImageProvider = 'stable-diffusion', apiKey?: string): ImageProviderAdapter {
  return new ImageProviderAdapter(provider, apiKey || 'demo-key');
}
