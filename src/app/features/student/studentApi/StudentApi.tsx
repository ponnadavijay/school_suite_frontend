import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = "http://13.203.135.43";

export interface CreateStudentPayload {
  name: string;
  parent: number;
  class_room: number;
  role: number;
  organization: number;
}

export interface Student {
  admission_no: number; 
  name: string;
  parent: any; 
  class_room: any;
  role: any;
  organization: any;
}

type ApiError = AxiosError<{ detail?: string }>;

const api = axios.create({
  baseURL: BASE_URL,
});

const setAuthHeader = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const createStudent = async (payload: CreateStudentPayload): Promise<Student> => {
  const response = await api.post(`/users/api/register/student`, payload);
  return response.data;
};

const fetchStudents = async (organizationId: number): Promise<Student[]> => {
  const response = await api.get(`/student/Students/list/${organizationId}/`);
  return response.data;
};

const fetchStudentOrganization = async (): Promise<any> => {
  const response = await api.get(`/student/Students/organization/`);
  return response.data;
};

const fetchStudent = async (admission_no: number): Promise<Student> => {
  const response = await api.get(`/student/Students/retrieve/${admission_no}/`);
  return response.data;
};

const fetchStudentsBySection = async (class_room_id: number): Promise<Student[]> => {
  const response = await api.get(`/student/Students/listbySection/${class_room_id}/`);
  return response.data;
};

const deleteStudent = async (admission_no: number): Promise<void> => {
  await api.delete(`/student/Students/delete/${admission_no}/`);
};

const updateStudent = async ({
  admission_no,
  ...payload
}: { admission_no: number } & Partial<CreateStudentPayload>): Promise<Student> => {
  const response = await api.put(`/student/Students/update/${admission_no}/`, payload);
  return response.data;
};

export const useStudents = (organizationId?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Student[], ApiError>({
    queryKey: ["students", organizationId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchStudents(organizationId!);
    },
    enabled: !!organizationId,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useStudentOrganization = () => {
  const { accessToken } = useAuth();

  return useQuery<any, ApiError>({
    queryKey: ["studentOrganization"],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchStudentOrganization();
    },
    enabled: !!accessToken,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useStudent = (admission_no?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Student, ApiError>({
    queryKey: ["student", admission_no],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchStudent(admission_no!);
    },
    enabled: !!accessToken && !!admission_no,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useRegisterStudent = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Student, ApiError, CreateStudentPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return createStudent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = (organizationId?: number) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Student, ApiError, { admission_no: number } & Partial<CreateStudentPayload>>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return updateStudent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", organizationId] });
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useStudentsBySection = (class_id?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Student[], ApiError>({
    queryKey: ["studentsBySection", class_id],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchStudentsBySection(class_id!);
    },
    enabled: !!class_id,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useDeleteStudent = (organizationId?: number) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (admission_no) => {
      if (accessToken) setAuthHeader(accessToken);
      return deleteStudent(admission_no);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["studentsBySection"] });
    },
  });
};