export class GooglePlacesAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchNearby(location: { lat: number; lng: number }, radius: number, type?: string): Promise<any[]> {
    return [];
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    return { placeId, name: 'Demo Place' };
  }
}

export function createGooglePlacesAdapter(apiKey?: string): GooglePlacesAdapter {
  return new GooglePlacesAdapter(apiKey || 'demo-key');
}
