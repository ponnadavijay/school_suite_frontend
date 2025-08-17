import { useMutation, useQuery } from "@tanstack/react-query";
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

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {
  id: number;
}

type ApiError = AxiosError<{ detail?: string }>;

// ================== API Functions ==================
const api = axios.create({
  baseURL: BASE_URL,
});

const setAuthHeader = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Get all teachers
const fetchTeachers = async (organizationId?: number): Promise<Teacher[]> => {
  const response = await api.post("/teacher/teachers/list", {
    organization: organizationId,
  });
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
  id,
  ...payload
}: UpdateTeacherPayload): Promise<Teacher> => {
  const response = await api.put(`/teacher/teachers/update/${id}/`, payload);
  return response.data;
};

// ================== React Query Hooks ==================
export const useTeachers = (organizationId?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Teacher[], ApiError>({
    queryKey: ["teachers", organizationId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchTeachers(organizationId);
    },
    enabled: !!accessToken,
  });
};

export const useTeacher = (teacherId: number) => {
  const { accessToken } = useAuth();

  return useQuery<Teacher, ApiError>({
    queryKey: ["teacher", teacherId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchTeacher(teacherId);
    },
    enabled: !!accessToken && !!teacherId,
  });
};

export const useCreateTeacher = () => {
  const { accessToken } = useAuth();

  return useMutation<Teacher, ApiError, CreateTeacherPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return createTeacher(payload);
    },
  });
};

export const useUpdateTeacher = () => {
  const { accessToken } = useAuth();

  return useMutation<Teacher, ApiError, UpdateTeacherPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return updateTeacher(payload);
    },
  });
};