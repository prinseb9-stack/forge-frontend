import { getIdToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// ═══ Types ═══
export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  periodStartedAt?: string;
  periodEndsAt?: string;
}

export interface GeneratedPlatform {
  platform: string;
  content: string;
}

export interface GenerateResponse {
  success: boolean;
  results?: GeneratedPlatform[];
  plan?: string;
  usage?: UsageInfo;
  error?: string;
  code?: string;
}

export interface GenerateRequest {
  content: string;
  platforms: string[];
}

export interface ImageResult {
  id: string;
  url: string;
  prompt: string;
  size: string;
  model: string;
  createdAt: string;
}

export interface GenerateImageResponse {
  success: boolean;
  image?: ImageResult;
  plan?: string;
  usage?: UsageInfo;
  error?: string;
  code?: string;
}

// ═══ Helpers ═══
async function authedFetch(
  path: string,
  body: unknown
): Promise<{ status: number; json: unknown }> {
  const token = await getIdToken();
  if (!token) {
    return { status: 401, json: { success: false, error: 'Not signed in', code: 'UNAUTHENTICATED' } };
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return { status: 0, json: { success: false, error: 'Could not reach the server.', code: 'NETWORK_ERROR' } };
  }

  const text = await res.text();
  if (!text) {
    return { status: res.status, json: { success: false, error: `Server returned ${res.status}`, code: 'SERVER_ERROR' } };
  }

  try {
    return { status: res.status, json: JSON.parse(text) };
  } catch {
    return { status: res.status, json: { success: false, error: 'Invalid response from server', code: 'INVALID_RESPONSE' } };
  }
}

// ═══ Text Generation ═══
export async function generateContent(payload: GenerateRequest): Promise<GenerateResponse> {
  const { json } = await authedFetch('/api/generate', payload);
  return json as GenerateResponse;
}

// ═══ Image Generation ═══
export async function generateImage(
  prompt: string,
  size: string
): Promise<GenerateImageResponse> {
  const { json } = await authedFetch('/api/generate-image', { prompt, size });
  return json as GenerateImageResponse;
}

// ═══ User Info ═══
export interface MeUserInfo {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro' | 'higher_pro';
  textGeneration?: UsageInfo;
  imageGeneration?: UsageInfo;
  videoGeneration?: UsageInfo;
}

export interface MeResponse {
  success: boolean;
  user?: MeUserInfo;
  error?: string;
}

export async function getMe(): Promise<MeResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: 'Not signed in' };
  }

  try {
    const res = await fetch(`${API_URL}/api/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    if (!text) return { success: false, error: `Server ${res.status}` };
    return JSON.parse(text) as MeResponse;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// ═══ Payments ═══
export interface CheckoutResponse {
  success: boolean;
  checkoutURL?: string;
  error?: string;
  code?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  plan: string;
  subscription?: {
    provider: string;
    planName: string;
    status: string;
    currentPeriodEnd: string;
  };
  error?: string;
}

export async function createCheckout(
  plan: 'pro' | 'higher_pro'
): Promise<CheckoutResponse> {
  const { json } = await authedFetch('/api/payments/checkout', { plan });
  return json as CheckoutResponse;
}

export async function getSubscription(): Promise<SubscriptionResponse> {
  const token = await getIdToken();
  if (!token) return { success: false, plan: 'free', error: 'Not signed in' };

  try {
    const res = await fetch(`${API_URL}/api/subscription`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    if (!text) return { success: false, plan: 'free', error: 'Server error' };
    return JSON.parse(text) as SubscriptionResponse;
  } catch {
    return { success: false, plan: 'free', error: 'Network error' };
  }
}
