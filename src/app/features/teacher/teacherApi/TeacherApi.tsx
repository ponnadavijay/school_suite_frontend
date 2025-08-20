import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = "http://13.203.135.43";

// ================== Types ==================
export interface Teacher {
  id: number;
  teacher_id: number;
  name: string;
  email: string;
  qualification?: string;
  mobile_no: string;
  whatsapp_no: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  pincode: number;
  organization: number;
  role: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTeacherPayload {
  name: string;
  teacher_id: number;
  qualification: string;
  mobile_no: string;
  whatsapp_no: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  pincode: number;
  email: string;
  organization: number;
  role: number;
}

export interface UpdateTeacherPayload {
  teacher_id: number;
  name?: string;
  qualification?: string;
  mobile_no?: string;
  whatsapp_no?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  pincode?: number;
  email?: string;
  organization?: number;
  role?: number;
}

const api = axios.create({
  baseURL: BASE_URL,
});

const setAuthHeader = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Get all teachers
const fetchAllTeachers = async (organizationId?: number): Promise<Teacher[]> => {
  const response = await api.get(`/teacher/teachers/list/${organizationId}`);
  return response.data;
};

// Get single teacher
const fetchTeacher = async (teacherId: number): Promise<Teacher> => {
  const response = await api.get(`/teacher/teachers/retrieve/${teacherId}/`);
  return response.data;
};

// Create teacher
const createTeacher = async (payload: CreateTeacherPayload): Promise<Teacher> => {
  const response = await api.post("/users/api/register/teacher", payload);
  return response.data;
};

// Update teacher
const updateTeacher = async ({
  teacher_id,
  ...payload
}: UpdateTeacherPayload): Promise<Teacher> => {
  const response = await api.put(`/teacher/teachers/update/${teacher_id}/`, payload);
  return response.data;
};

const fetchOneTeacher = async (teacherId: number): Promise<Teacher> => {
  const response = await api.get(`/teacher/teachers/retrieve/${teacherId}/`);
  return response.data;
};

// ================== React Query Hooks ==================
export const useGetAllTeachers = (organizationId?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Teacher[]>({
    queryKey: ["teachers", organizationId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchAllTeachers(organizationId);
    },
    enabled: !!accessToken && !!organizationId,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useGetRetriveTeacher = (teacherId: number) => {
  const { accessToken } = useAuth();

  return useQuery<Teacher>({
    queryKey: ["teacher", teacherId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchTeacher(teacherId);
    },
    enabled: !!accessToken && !!teacherId,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useCreateTeacher = (organizationId?: number) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Teacher, Error, CreateTeacherPayload>({
    mutationFn: async (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return createTeacher(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

// 🔹 Update Teacher Hook
export const useUpdateTeacher = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Teacher, Error, UpdateTeacherPayload>({
    mutationFn: async (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return updateTeacher(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useGetOneTeacher = (teacherId: number) => {
  const { accessToken } = useAuth();

  return useQuery<Teacher>({
    queryKey: ["teacher", teacherId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchOneTeacher(teacherId);
    },
    enabled: !!accessToken && !!teacherId,
  });
};
