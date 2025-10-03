// ==================== API CLIENT ====================
// src/api/screenClient.ts

import { ScreenSchema, FormValues, FormErrors } from '../types/schema.types';

export class DynamicScreenClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = '/api', headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers
    };
  }

  async getScreen(screenId: string): Promise<ScreenSchema> {
    const response = await fetch(`${this.baseUrl}/screens/${screenId}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch screen: ${response.statusText}`);
    }

    return response.json();
  }

  async submitScreen(screenId: string, data: FormValues): Promise<any> {
    const response = await fetch(`${this.baseUrl}/screens/${screenId}/submit`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit: ${response.statusText}`);
    }

    return response.json();
  }

  async validateScreen(screenId: string, data: FormValues): Promise<FormErrors> {
    const response = await fetch(`${this.baseUrl}/screens/${screenId}/validate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to validate: ${response.statusText}`);
    }

    return response.json();
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }
}
