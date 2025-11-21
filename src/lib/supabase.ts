import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'user' | 'agent';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
export type PaymentProvider = 'razorpay' | 'stripe' | 'paypal';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type AutomationMode = 'manual' | 'semi_auto' | 'full_auto';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  gmb_account_id?: string;
  gmb_location_id?: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  keywords?: string[];
  automation_mode: AutomationMode;
  is_connected: boolean;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  ai_tokens_included: number;
  businesses_allowed: number;
  features: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  provider_subscription_id?: string;
  provider_customer_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_ends_at?: string;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  business_id: string;
  title?: string;
  content: string;
  media_urls?: string[];
  cta_type?: string;
  cta_url?: string;
  status: PostStatus;
  scheduled_for?: string;
  published_at?: string;
  gmb_post_id?: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}
