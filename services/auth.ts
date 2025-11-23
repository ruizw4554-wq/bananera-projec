
import { User } from '../types';

const STORAGE_KEY = 'bananera_users_v2';

interface StoredUser extends User {
  password?: string;
}

// Seed Admin Account - No default photoUrl so it falls back to Initials
const SEED_ADMIN: StoredUser = {
  id: 'admin-001',
  name: 'Admin General',
  email: 'admin@bananerapro.com',
  role: 'ADMIN',
  password: 'Bananera'
  // photoUrl intentionally left undefined
};

export const getStoredAccounts = (): StoredUser[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const users: StoredUser[] = JSON.parse(stored);
      // Ensure Admin always exists in case storage was cleared or corrupted
      if (!users.find(u => u.role === 'ADMIN')) {
        users.unshift(SEED_ADMIN);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      }
      return users;
    }
  } catch (e) {
    console.error("Error loading accounts", e);
  }
  
  // Initialize with Admin
  localStorage.setItem(STORAGE_KEY, JSON.stringify([SEED_ADMIN]));
  return [SEED_ADMIN];
};

// Changed to verify by Email instead of ID
export const verifyCredentials = async (email: string, passwordAttempt: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
  
  const accounts = getStoredAccounts();
  // Case insensitive email check
  const user = accounts.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (user && user.password === passwordAttempt) {
    // Return user without password field
    const { password, ...safeUser } = user;
    return safeUser;
  }
  
  throw new Error("Credenciales inválidas. Verifique su correo y contraseña.");
};

export const adminCreateUser = (name: string, email: string, password: string, role: 'ADMIN' | 'USER'): User => {
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    role,
    password
    // No default photoUrl, will fallback to initials
  };

  const currentAccounts = getStoredAccounts();
  
  // Check for duplicate email
  if (currentAccounts.some(u => u.email === newUser.email)) {
    throw new Error("El correo electrónico ya está registrado.");
  }

  const updatedAccounts = [...currentAccounts, newUser];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  
  const { password: _, ...safeUser } = newUser;
  return safeUser;
};

export const adminDeleteUser = (userId: string): void => {
  const currentAccounts = getStoredAccounts();
  // Prevent deleting the main admin
  if (userId === SEED_ADMIN.id) {
    throw new Error("No se puede eliminar el Administrador Principal");
  }
  const updatedAccounts = currentAccounts.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
};

export const adminResetPassword = (userId: string, newPassword: string): void => {
  const currentAccounts = getStoredAccounts();
  const updatedAccounts = currentAccounts.map(u => {
    if (u.id === userId) {
      return { ...u, password: newPassword };
    }
    return u;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
};

export const updateUserPhoto = (userId: string, photoBase64: string): User => {
  const currentAccounts = getStoredAccounts();
  const updatedAccounts = currentAccounts.map(u => {
    if (u.id === userId) {
      return { ...u, photoUrl: photoBase64 };
    }
    return u;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  
  const user = updatedAccounts.find(u => u.id === userId)!;
  const { password: _, ...safeUser } = user;
  return safeUser;
};
