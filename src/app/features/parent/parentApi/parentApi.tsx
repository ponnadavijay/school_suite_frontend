import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = 'https://patashala.intellvia.in';

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

export interface Student {
  id: number;
  name: string;
  class_name: string;
  section: string;
  roll_no: string;
}

type ApiError = AxiosError<{ detail?: string }>;

const api = axios.create({
  baseURL: BASE_URL,
});

const setAuthHeader = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const createParent = async (payload: CreateParentPayload): Promise<Parent> => {
  const response = await api.post(`/api/v1/auth/register`, payload);
  return response.data;
};

const fetchParents = async (): Promise<Parent[]> => {
  const response = await api.get(`/api/v1/admin/users`);
  return response.data;
};

const fetchParentOrganization = async (): Promise<any> => {
  const response = await api.get(`/api/v1/tenant/tenants`);
  return response.data;
};

const fetchParent = async (parentId: string): Promise<Parent> => {
  const response = await api.get(`/api/v1/admin/user/${parentId}`);
  return response.data;
};

const fetchParentStudents = async (parentId: string): Promise<Student[]> => {
  const response = await api.get(`/api/v1/student/students?parent_id=${parentId}`);
  return response.data;
};

const updateParent = async ({
  parent_id,
  ...payload
}: { parent_id: string } & Partial<CreateParentPayload>): Promise<Parent> => {
  const response = await api.put(`/api/v1/admin/user/${parent_id}`, payload);
  return response.data;
};

export const useCreateParent = () => {
  const { accessToken } = useAuth();

  return useMutation<Parent, ApiError, CreateParentPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return createParent(payload);
    },
  });
};

export const useParents = () => {
  const { accessToken } = useAuth();

  return useQuery<Parent[], ApiError>({
    queryKey: ["parents"],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchParents();
    },
    enabled: !!accessToken,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useParentOrganization = () => {
  const { accessToken } = useAuth();

  return useQuery<any, ApiError>({
    queryKey: ["parentOrganization"],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchParentOrganization();
    },
    enabled: !!accessToken,
  });
};

export const useParent = (parentId?: string) => {
  const { accessToken } = useAuth();

  return useQuery<Parent, ApiError>({
    queryKey: ["parent", parentId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchParent(parentId!);
    },
    enabled: !!accessToken && !!parentId,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useParentStudents = (parentId?: string) => {
  const { accessToken } = useAuth();

  return useQuery<Student[], ApiError>({
    queryKey: ["parentStudents", parentId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchParentStudents(parentId!);
    },
    enabled: !!accessToken && !!parentId,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useUpdateParent = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Parent, ApiError, { parent_id: string } & Partial<CreateParentPayload>>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return updateParent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
};
