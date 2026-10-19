import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = 'https://patashala.intellvia.in';

export interface RegisterPayload {
  username: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  whatsapp: string;
  role_id: string;
  tenant_id: string;
}

export interface RegisterResponse {
  message: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const url = `${BASE_URL}/api/v1/auth/register`;

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