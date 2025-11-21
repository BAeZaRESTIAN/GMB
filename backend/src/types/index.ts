export enum UserRole {
  ADMIN = 'admin',
  TENANT_ADMIN = 'tenant_admin',
  USER = 'user',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

export interface User {
  id: string;
  tenant_id?: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price_monthly?: number;
  price_yearly?: number;
  features: Record<string, any>;
  limits: Record<string, any>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentTransaction {
  id: string;
  tenant_id: string;
  subscription_id?: string;
  payment_gateway: string;
  gateway_transaction_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface GMBLocation {
  id: string;
  tenant_id: string;
  google_location_id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  categories: string[];
  business_hours: Record<string, any>;
  attributes: Record<string, any>;
  access_token?: string;
  refresh_token?: string;
  token_expiry?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  tenant_id: string;
  location_id: string;
  content: string;
  media_urls: string[];
  status: PostStatus;
  scheduled_at?: Date;
  published_at?: Date;
  google_post_id?: string;
  ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  tenant_id: string;
  location_id: string;
  google_review_id: string;
  reviewer_name?: string;
  rating: number;
  comment?: string;
  review_reply?: string;
  replied_at?: Date;
  review_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface QRCode {
  id: string;
  tenant_id: string;
  location_id: string;
  qr_code_url: string;
  review_url: string;
  scans: number;
  created_at: Date;
  updated_at: Date;
}

export interface Competitor {
  id: string;
  tenant_id: string;
  location_id: string;
  name: string;
  google_place_id?: string;
  address?: string;
  rating?: number;
  review_count?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GeoRanking {
  id: string;
  tenant_id: string;
  location_id: string;
  keyword: string;
  latitude?: number;
  longitude?: number;
  rank_position?: number;
  competitor_ranks: any[];
  checked_at: Date;
  created_at: Date;
}

export interface BloggerPost {
  id: string;
  tenant_id: string;
  location_id: string;
  blog_id: string;
  blogger_post_id?: string;
  title: string;
  content: string;
  status: PostStatus;
  scheduled_at?: Date;
  published_at?: Date;
  ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: string;
  tenant_id?: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}
