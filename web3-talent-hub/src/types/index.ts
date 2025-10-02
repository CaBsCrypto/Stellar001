// User Types
export interface User {
  id: string;
  publicKey: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creator Profile Types
export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  specialties: CreatorSpecialty[];
  portfolioLinks: PortfolioLink[];
  socialLinks: SocialLink[];
  location?: string;
  hourlyRate?: number;
  availability: AvailabilityStatus;
  reputation: number;
  totalRatings: number;
  averageRating: number;
  badges: Badge[];
  level: UserLevel;
  createdAt: Date;
  updatedAt: Date;
}

// Creator Specialties
export enum CreatorSpecialty {
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  TWITCH = 'twitch',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  PODCAST = 'podcast',
  BLOG = 'blog',
  VIDEO_EDITING = 'video_editing',
  GRAPHIC_DESIGN = 'graphic_design',
  COPYWRITING = 'copywriting',
  PHOTOGRAPHY = 'photography',
}

// Portfolio and Social Links
export interface PortfolioLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  metrics?: {
    views?: number;
    likes?: number;
    shares?: number;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
  followers?: number;
  verified?: boolean;
}

// Availability Status
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  UNAVAILABLE = 'unavailable',
}

// User Levels and Badges
export enum UserLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// Reputation and Ratings
export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectId?: string;
  rating: number; // 1-5 stars
  comment?: string;
  categories: RatingCategory[];
  createdAt: Date;
}

export enum RatingCategory {
  QUALITY = 'quality',
  COMMUNICATION = 'communication',
  TIMELINESS = 'timeliness',
  PROFESSIONALISM = 'professionalism',
}

// Project and Collaboration Types
export interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  clientId: string;
  status: ProjectStatus;
  budget?: number;
  deadline?: Date;
  deliverables: Deliverable[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Deliverable {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  status: DeliverableStatus;
  submittedAt?: Date;
  approvedAt?: Date;
}

export enum DeliverableStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Wallet and Blockchain Types
export interface WalletConnection {
  isConnected: boolean;
  publicKey?: string;
  network: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and Filter Types
export interface SearchFilters {
  specialties?: CreatorSpecialty[];
  minRating?: number;
  maxHourlyRate?: number;
  availability?: AvailabilityStatus;
  location?: string;
  level?: UserLevel;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
