import { UserAccount, Country } from '../types';

const USERS_STORAGE_KEY = 'faizul_pay_users';
const CURRENT_USER_KEY = 'faizul_pay_current_user';

export const DEFAULT_USER: UserAccount = {
  id: 'usr-default-faizul',
  name: 'Faizul Haque',
  phoneNumber: '9876543210',
  email: 'faizulhaque9387497618@gmail.com',
  country: 'IN',
  pin: '1234',
  walletBalance: 50,
  createdAt: Date.now() - 86400000 * 5,
  avatarLetter: 'F',
  kycVerified: true,
};

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const users: UserAccount[] = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) {
        return users;
      }
    }
  } catch (e) {
    console.error('Failed to read users from storage', e);
  }
  // If no users exist, initialize with default user
  const initial = [DEFAULT_USER];
  saveUsers(initial);
  return initial;
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage', e);
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get current user', e);
  }
  return null;
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
}

export function registerUser(newUser: Omit<UserAccount, 'id' | 'createdAt' | 'avatarLetter'>): {
  success: boolean;
  message?: string;
  user?: UserAccount;
} {
  const users = getStoredUsers();
  const cleanPhone = newUser.phoneNumber.replace(/\D/g, '');

  if (users.some((u) => u.phoneNumber.replace(/\D/g, '') === cleanPhone)) {
    return {
      success: false,
      message: 'इस मोबाइल नंबर से पहले से खाता मौजूद है। कृपया लॉगिन करें।'
    };
  }

  const initial = newUser.name.trim().charAt(0).toUpperCase() || 'U';
  const created: UserAccount = {
    ...newUser,
    id: 'usr-' + Date.now(),
    createdAt: Date.now(),
    avatarLetter: initial,
  };

  const updated = [created, ...users];
  saveUsers(updated);
  setCurrentUser(created);

  return {
    success: true,
    user: created,
  };
}

export function loginWithPin(phoneNumber: string, pin: string): {
  success: boolean;
  message?: string;
  user?: UserAccount;
} {
  const users = getStoredUsers();
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const user = users.find((u) => u.phoneNumber.replace(/\D/g, '') === cleanPhone);

  if (!user) {
    return {
      success: false,
      message: 'यह नंबर पंजीकृत नहीं है। कृपया "नया खाता बनाएं" पर क्लिक करें।'
    };
  }

  if (user.pin !== pin) {
    return {
      success: false,
      message: 'गलत 4-अंकों का UPI/सुरक्षा पिन। कृपया पुनः प्रयास करें।'
    };
  }

  setCurrentUser(user);
  return {
    success: true,
    user,
  };
}

export function loginWithOtp(phoneNumber: string): {
  success: boolean;
  message?: string;
  user?: UserAccount;
} {
  const users = getStoredUsers();
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  let user = users.find((u) => u.phoneNumber.replace(/\D/g, '') === cleanPhone);

  if (!user) {
    // If not found, auto-create a user on OTP verification
    user = {
      id: 'usr-' + Date.now(),
      name: 'User ' + cleanPhone.slice(-4),
      phoneNumber: cleanPhone,
      country: 'IN',
      pin: '1234',
      walletBalance: 50,
      createdAt: Date.now(),
      avatarLetter: 'U',
      kycVerified: true,
    };
    saveUsers([user, ...users]);
  }

  setCurrentUser(user);
  return {
    success: true,
    user,
  };
}

export function updateUserWallet(userId: string, deltaAmount: number): UserAccount | null {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  const current = users[index];
  const newBalance = Math.max(0, current.walletBalance + deltaAmount);
  const updatedUser: UserAccount = {
    ...current,
    walletBalance: newBalance,
  };

  users[index] = updatedUser;
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}
