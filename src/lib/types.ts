
// export type UserRole = 'member' | 'staff' | 'admin';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  MEMBER = 'member'
}

export interface Profile {
  avatarUrl?: string;
  membershipType?: string;
  joinDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  token?: string;
  permissions: {
    canManageBooks: boolean;
    canManageUsers: boolean;
    canBorrowBooks: boolean;
  }
  membershipStartDate?: string;
  address?: string;
  phoneNumber?: string;
  profile?: Profile;
}

export const getRolePermissions = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return {
        canManageBooks: true,
        canManageUsers: true,
        canBorrowBooks: true
      };
    case UserRole.STAFF:
      return {
        canManageBooks: true,
        canManageUsers: false,
        canBorrowBooks: true
      };
    case UserRole.MEMBER:
      return {
        canManageBooks: false,
        canManageUsers: false,
        canBorrowBooks: true
      };
  }
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
}

export interface Publisher {
  id: string;
  name: string;
  address?: string;
  contactInfo?: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  coverImage: string;
  description: string;
  genre: string;
  publicationYear: number;
  publisherId: string;
  publisher: Publisher;
  authors: Author[];
  available: boolean;
  rating?: number;
  totalCopies: number;
  availableCopies: number;
}

export interface Loan {
  id: string;
  memberId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  book?: Book;
  member?: User;
}

export interface BookFilter {
  search?: string;
  genre?: string;
  available?: boolean;
  year?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
}
