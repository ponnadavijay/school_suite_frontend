import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = 'http://13.203.135.43';

export interface RegisterStudentParams {
  name: string;
  parent: number;
  class_room: number;
  role: number;
  organization: number;
}

export interface RegisterStudentResponse {
  id: number;
  name: string;
  // Add other response fields as needed
}

export const registerStudent = async (params: RegisterStudentParams): Promise<RegisterStudentResponse> => {
  const response = await axios.post(
    `${BASE_URL}/users/api/register/student`,
    null, // No body needed since we're using query params
    {
      params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};

export const useRegisterStudent = () => {
  return useMutation<RegisterStudentResponse, Error, RegisterStudentParams>({
    mutationFn: registerStudent,
  });
};