// src/api/auth.ts
import client from './client';

export interface SignupData {
  username: string;
  fullName: string;
  email:     string;
  password:  string;
}

export const signup = (userData: SignupData) =>
  client.post('/auth/signup', userData);

export interface LoginData {
  username: string;
  password: string;
}

export const login = ({ username, password }: LoginData) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  return client.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export interface User {
  id: number
  username: string
  fullName: string
  email: string
}
export function getProfile() {
  return client.get<User>("/auth/users/me")
}