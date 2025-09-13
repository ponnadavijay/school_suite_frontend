import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = 'http://52.66.173.231:8001';

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

// Add to your API file

export interface Classroom {
  class_id: number;
  class_no: number;
  class_section: string;
  incharge: number;
  organization: number;
}

// Fetch all classrooms for an organization
const fetchClassrooms = async (organizationId: number): Promise<Classroom[]> => {
  const response = await api.get(`/users/api/listclass`);
  // Filter classrooms by organization if needed, or adjust endpoint if it supports query params
  const allClassrooms = response.data;
  return allClassrooms.filter((classroom: Classroom) => classroom.organization === organizationId);
};

// Fetch classroom by ID
const fetchClassroom = async (class_id: number): Promise<Classroom> => {
  const response = await api.get(`/users/api/listclass/${class_id}/`);
  return response.data;
};

// Create classroom
const createClassroom = async (payload: Omit<Classroom, 'class_id'>): Promise<Classroom> => {
  const response = await api.post(`/users/api/listclass/`, payload);
  return response.data;
};

// Update classroom
const updateClassroom = async (class_id: number, payload: Partial<Classroom>): Promise<Classroom> => {
  const response = await api.put(`/users/api/listclass/${class_id}/`, payload);
  return response.data;
};

// Delete classroom
const deleteClassroom = async (class_id: number): Promise<void> => {
  await api.delete(`/users/api/listclass/${class_id}/`);
};

// Hooks
export const useClassrooms = (organizationId?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Classroom[], ApiError>({
    queryKey: ["classrooms", organizationId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchClassrooms(organizationId!);
    },
    enabled: !!organizationId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClassroom = (class_id?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Classroom, ApiError>({
    queryKey: ["classroom", class_id],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchClassroom(class_id!);
    },
    enabled: !!class_id,
  });
};

export const useCreateClassroom = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Classroom, ApiError, Omit<Classroom, 'class_id'>>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return createClassroom(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

export const useUpdateClassroom = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Classroom, ApiError, { class_id: number } & Partial<Classroom>>({
    mutationFn: ({ class_id, ...payload }) => {
      if (accessToken) setAuthHeader(accessToken);
      return updateClassroom(class_id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["classroom"] });
    },
  });
};

export const useDeleteClassroom = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (class_id) => {
      if (accessToken) setAuthHeader(accessToken);
      return deleteClassroom(class_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

// ============================
// Bulk Update Attendance
// ============================

export interface BulkUpdateAttendancePayload {
  name: string;
  parent: number;
  class_room: number;
  role: number;
  organization: number;
  present_status: "Present" | "Absent"; // restrict to allowed values
}

const bulkUpdateAttendance = async (
  payload: BulkUpdateAttendancePayload
): Promise<any> => {
  const response = await api.put(
    `/student/Students/bulk-update-attendance/`,
    payload
  );
  return response.data;
};

export const useBulkUpdateAttendance = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, ApiError, BulkUpdateAttendancePayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return bulkUpdateAttendance(payload);
    },
    onSuccess: () => {
      // refresh all related student queries
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["studentsBySection"] });
    },
  });
};
