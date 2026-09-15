export type Platform =
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'blog'
  | 'newsletter';

export interface GeneratedContent {
  id: string;
  platform: Platform;
  content: string;
  timestamp: Date;
}

export type UserPlan = 'free' | 'pro' | 'higher_pro';

export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  periodStartedAt?: string;
  periodEndsAt?: string;
}
