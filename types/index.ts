
// Tipos principales de la aplicación
export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: PropertyType;
  status: PropertyStatus;
  images: string[];
  description: string;
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'casa' | 'departamento' | 'ph' | 'terreno' | 'local' | 'oficina';
export type PropertyStatus = 'venta' | 'alquiler' | 'vendido' | 'alquilado';

export interface PropertyFilters {
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  location?: string;
  minArea?: number;
  maxArea?: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  propertyType: string;
  budget: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Estados de UI
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationState;
}
