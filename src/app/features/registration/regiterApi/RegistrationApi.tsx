import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = 'http://52.66.173.231:8001';

export interface RegisterPayload {
  email: string;
  password: string;
  role: number;
  organization: number;
}

export interface RegisterResponse {
  message: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const url = `${BASE_URL}/users/api/registerUser`;

  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerUser,
  });
};