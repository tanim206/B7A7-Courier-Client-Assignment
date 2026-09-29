export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "STAFF";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export interface Hub {
  id: string;
  hubCode: string;
  name: string;
  city: string;
  district: string;
  division: string;
}

export interface Me {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  authProvider: AuthProvider;
  lastLoginAt: string | null;
  createdAt: string;
  hub: Hub | null;
}
