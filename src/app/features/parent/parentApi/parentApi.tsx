import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = "http://13.203.135.43";

// ================== Types ==================
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

// ================== API Instance ==================
const api = axios.create({
  baseURL: BASE_URL,
});

const setAuthHeader = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// ================== API Functions ==================
const createParent = async (payload: CreateParentPayload): Promise<Parent> => {
  const response = await api.post(`/users/api/register/parent`, payload);
  return response.data;
};

const fetchParents = async (organizationId: number): Promise<Parent[]> => {
  const response = await api.get(`/parent/Parents/list/${organizationId}/`);
  return response.data;
};

const fetchParentOrganization = async (): Promise<any> => {
  const response = await api.get(`/parent/Parents/organization/`);
  return response.data;
};

const fetchParent = async (parentId: number): Promise<Parent> => {
  const response = await api.get(`/parent/Parents/retrieve/${parentId}/`);
  return response.data;
};

const fetchParentStudents = async (parentId: number): Promise<Student[]> => {
  const response = await api.get(`/parent/Parents/students/list/${parentId}/`);
  return response.data;
};

const updateParent = async ({
  parent_id,
  ...payload
}: { parent_id: number } & Partial<CreateParentPayload>): Promise<Parent> => {
  const response = await api.put(`/parent/Parents/update/${parent_id}/`, payload);
  return response.data;
};

// ================== React Query Hooks ==================
export const useCreateParent = () => {
  const { accessToken } = useAuth();

  return useMutation<Parent, ApiError, CreateParentPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return createParent(payload);
    },
  });
};

export const useParents = (organizationId?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Parent[], ApiError>({
    queryKey: ["parents", organizationId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchParents(organizationId!);
    },
    enabled: !!accessToken && !!organizationId,
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

export const useParent = (parentId?: number) => {
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

export const useParentStudents = (parentId?: number) => {
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

export const useUpdateParent = (organizationId?: number) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Parent, ApiError, { parent_id: number } & Partial<CreateParentPayload>>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return updateParent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents", organizationId] });
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
