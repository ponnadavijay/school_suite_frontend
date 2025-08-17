import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = "http://13.203.135.43";

export interface CreateParentPayload {
  name: string;
  email: string;
  relation: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  pincode: number;
  mobile_no: string;
  whatsapp_no: string;
  organization: number;
  role: number;
}

export interface Parent {
  id: number;
  name: string;
  email: string;
  relation: string;
  // Add other fields as needed
}

export const createParent = async (payload: CreateParentPayload): Promise<Parent> => {
  const response = await axios.post(`${BASE_URL}/users/api/register/parent`, payload);
  return response.data;
};

export const useCreateParent = () => {
  return useMutation<Parent, Error, CreateParentPayload>({
    mutationFn: createParent,
  });
};