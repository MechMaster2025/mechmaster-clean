export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  is_paid: boolean;
  subscription_expires_at?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  razorpay_customer_id?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  short_desc: string;
  category?: Category;
}

export interface BlogContent {
  id: string;
  topic_id: string;
  section_title: string;
  section_body: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  reading_time: number;
  is_published: boolean;
  created_at: string;
  topic_id: string;
  topic?: Topic;
  slug?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
}