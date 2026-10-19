import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = 'https://patashala.intellvia.in';

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
const fetchAllTeachers = async (): Promise<Teacher[]> => {
  const response = await api.get(`/api/v1/admin/users`);
  return response.data;
};

// Get single teacher
const fetchTeacher = async (teacherId: string): Promise<Teacher> => {
  const response = await api.get(`/api/v1/admin/user/${teacherId}`);
  return response.data;
};

// Create teacher
const createTeacher = async (payload: CreateTeacherPayload): Promise<Teacher> => {
  const response = await api.post("/api/v1/auth/register", payload);
  return response.data;
};

// Update teacher
const updateTeacher = async ({
  teacher_id,
  ...payload
}: UpdateTeacherPayload): Promise<Teacher> => {
  const response = await api.put(`/api/v1/admin/user/${teacher_id}`, payload);
  return response.data;
};

const fetchOneTeacher = async (teacherId: string): Promise<Teacher> => {
  const response = await api.get(`/api/v1/admin/user/${teacherId}`);
  return response.data;
};

// ================== React Query Hooks ==================
export const useGetAllTeachers = () => {
  const { accessToken } = useAuth();

  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchAllTeachers();
    },
    enabled: !!accessToken,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useGetRetriveTeacher = (teacherId: string) => {
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

export interface BulkTeacherAttendancePayload {
  teacher_ids: number[];
  present_status: "Present" | "Absent";
}

const bulkUpdateTeacherAttendance = async (payload: BulkTeacherAttendancePayload): Promise<any> => {
  const response = await api.put(`/teacher/teachers/bulk-update-attendance/`, payload);
  return response.data;
};

export const useBulkUpdateTeacherAttendance = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, Error, BulkTeacherAttendancePayload>({
    mutationFn: async (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return bulkUpdateTeacherAttendance(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
