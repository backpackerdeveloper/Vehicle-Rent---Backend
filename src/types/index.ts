import { User, Store, Vehicle, RentalRequest, Payment } from '@prisma/client';

export type UserRole = 'customer' | 'owner';

export type RentalStatus = 'pending' | 'approved' | 'cancelled' | 'completed';

export type PaymentStatus = 'pending' | 'success' | 'failed';

export type PaymentMethod = 'card' | 'upi' | 'cash' | 'mock';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type UserWithRelations = User;

export type StoreWithOwner = Store & {
  owner: User;
};

export type VehicleWithStore = Vehicle & {
  store: Store;
  images: Array<{ id: string; imageUrl: string }>;
};

export type RentalRequestWithRelations = RentalRequest & {
  vehicle: VehicleWithStore;
  customer: User;
  payment?: Payment | null;
};

export type PaymentWithRental = Payment & {
  rentalRequest: RentalRequestWithRelations;
};


