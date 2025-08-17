import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://13.203.135.43';

interface User {
  id: string;
  email: string;
  organization: number;
  role: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user(user: any, access: string, refresh: string): unknown;
  access: string;
  refresh: string;
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/api/users/login/`, payload);
  return response.data;
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
  });
};

export const fetchCurrentUser = async (accessToken: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/users/api/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const currentUser = await response.json();

  if (!currentUser.organization || currentUser.organization === 0) {
    throw new Error("User has invalid organization");
  }

  return {
    id: currentUser.id || currentUser._id || "",
    email: currentUser.email,
    organization: currentUser.organization,
    role: currentUser.role,
  };
};

