// Fixed types to match backend schemas exactly

export type Category = "Books" | "Museums" | "Library" | "Cinema";

// Base Account interface (matches AccountSchema)
export interface Account {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  isApproved: boolean;
  role: 'Admin' | 'User' | 'Partner';
  resetPasswordToken?: string;
  resetPasswordExpiresAt?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Admin interface (extends Account)
export interface Admin extends Account {
  role: 'Admin';
}

// User interface (extends Account) 
export interface User extends Account {
  role: 'User';
}

// Partner interface (extends Account with additional fields)
export interface Partner extends Account {
  role: 'Partner';
  businessName: string;
  description: string;
  location: string;
  websiteUrl: string; // Note: backend uses 'websiteUrl' not 'websiteURL'
  categories: Category[];
  imageUrl: string;
}

// Offer interface (matches OfferSchema)
export interface Offer {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  dateStart: Date;
  createdBy?: string; // ObjectId reference to Partner
  views?: number;
  reservation?: number;
  categories: Category; // Note: backend stores as single string, not array
  createdAt?: Date;
  updatedAt?: Date;
}

// OfferFormData for form handling
export interface OfferFormData {
  _id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  dateStart: Date;
  categories: Category; // Single category to match backend
  imageFile?: File | string; // Can be File or string URL
  imageUrl?: string;
  createdBy?: string;
}

// Task interface (matches tasksSchema)
export interface Task {
  _id: string;
  title: string;
  category: Category;
  requiredReservations: number;
  startDate: Date;
  endDate: Date;
  pointToWin: number;
  completedBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// TaskInput for creating new tasks
export type TaskInput = Omit<Task, "_id" | "views" | "createdAt" | "updatedAt" | "completedBy">;