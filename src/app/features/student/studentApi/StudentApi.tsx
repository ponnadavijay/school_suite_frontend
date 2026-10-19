import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";

const BASE_URL = 'https://patashala.intellvia.in';

export interface CreateStudentPayload {
  name: string;
  parent?: number | string | null;
  class_room?: number | string | null;
  role?: number | string | null;
  organization?: number | string | null;
}

export interface Student {
  u_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  contact?: string;
  whatsapp?: string;
  tenant_id?: string;
  role_id?: string;
  role_list?: {
    u_id?: string;
    role_name?: string;
  };
  createdat?: string;
  updatedat?: string;
  admission_no: number | string;
  name: string;
  parent: any;
  class_room: any;
  role: any;
  organization: any;
}

export interface AssignParentPayload {
  student_id: string;
  parent_id: string;
  relation: string;
}

export interface AssignClassPayload {
  student_id: string;
  class_id: string;
  year: string;
}

type ApiError = AxiosError<{ detail?: string }>;

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatic token attachment from localStorage to avoid 401 Unauthorized
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const setAuthHeader = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Assign parent to student: POST /api/v1/student/assign_parent
export const assignParent = async (payload: AssignParentPayload): Promise<any> => {
  const response = await api.post(`/api/v1/student/assign_parent`, payload);
  return response.data;
};

// Assign class to student: POST /api/v1/student/assign_class
export const assignClass = async (payload: AssignClassPayload): Promise<any> => {
  const response = await api.post(`/api/v1/student/assign_class`, payload);
  return response.data;
};

const createStudent = async (payload: CreateStudentPayload): Promise<Student> => {
  const response = await api.post(`/users/api/register/student`, payload);
  return response.data;
};

// Fetch students via GET /api/v1/student/students
export const fetchStudents = async (organizationId?: number): Promise<Student[]> => {
  try {
    const response = await api.get(`/api/v1/student/students`);
    const raw = response.data;
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    return list.map((item: any) => ({
      ...item,
      admission_no: item.admission_no || item.u_id || "",
      name:
        item.name ||
        `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
        "Student",
      parent: item.parent || null,
      class_room: item.class_room || null,
      role: item.role_list?.role_name || item.role_id || item.role || null,
      organization: item.tenant_id || item.organization || null,
    }));
  } catch (err: any) {
    if (organizationId) {
      const response = await api.get(`/student/Students/list/${organizationId}/`);
      return response.data;
    }
    throw err;
  }
};

const fetchStudentOrganization = async (): Promise<any> => {
  const response = await api.get(`/student/Students/organization/`);
  return response.data;
};

const fetchStudent = async (admission_no: number | string): Promise<Student> => {
  const response = await api.get(`/student/Students/retrieve/${admission_no}/`);
  return response.data;
};

const fetchStudentsBySection = async (class_room_id: number): Promise<Student[]> => {
  const response = await api.get(`/student/Students/listbySection/${class_room_id}/`);
  return response.data;
};

const deleteStudent = async (admission_no: number | string): Promise<void> => {
  await api.delete(`/student/Students/delete/${admission_no}/`);
};

const updateStudent = async ({
  admission_no,
  ...payload
}: { admission_no: number | string } & Partial<CreateStudentPayload>): Promise<Student> => {
  const response = await api.put(`/student/Students/update/${admission_no}/`, payload);
  return response.data;
};

export const useStudents = (organizationId?: number) => {
  const { accessToken } = useAuth();

  return useQuery<Student[], ApiError>({
    queryKey: ["students", organizationId],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchStudents(organizationId);
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useAssignParent = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, ApiError, AssignParentPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return assignParent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
};

export const useAssignClass = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, ApiError, AssignClassPayload>({
    mutationFn: (payload) => {
      if (accessToken) setAuthHeader(accessToken);
      return assignClass(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["studentsBySection"] });
    },
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
  class_id?: string;
  class_no: number;
  section: string;
  class_teacher_id: string;
}

// Fetch all classrooms
const fetchClassrooms = async (): Promise<Classroom[]> => {
  const response = await api.get(`/api/v1/class/classes`);
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.classes)) return raw.classes;
  return [];
};

// Fetch students belonging to a class: GET /api/v1/teacher/class_students/{class_id}
export interface ClassStudentItem {
  u_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
}

export const fetchClassStudents = async (class_id: string): Promise<ClassStudentItem[]> => {
  const response = await api.get(`/api/v1/teacher/class_students/${class_id}`);
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
};

export const useClassStudents = (class_id?: string) => {
  const { accessToken } = useAuth();
  return useQuery<ClassStudentItem[]>({
    queryKey: ["classStudents", class_id],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchClassStudents(class_id!);
    },
    enabled: !!accessToken && !!class_id,
  });
};

// Fetch classroom by ID (Assuming the endpoint is /api/v1/class/{id})
const fetchClassroom = async (class_id: string): Promise<Classroom> => {
  const response = await api.get(`/api/v1/class/${class_id}`);
  return response.data;
};

// Create classroom
const createClassroom = async (payload: Classroom): Promise<Classroom> => {
  const response = await api.post(`/api/v1/class/create_class`, payload);
  return response.data;
};

// Create classroom bulk
const createClassroomBulk = async (payload: { items: Classroom[] }): Promise<Classroom[]> => {
  const response = await api.post(`/api/v1/class/create_class_bulk`, payload);
  return response.data;
};

// Update classroom
const updateClassroom = async (class_id: string, payload: Partial<Classroom>): Promise<Classroom> => {
  const response = await api.put(`/api/v1/class/${class_id}`, payload);
  return response.data;
};

// Delete classroom
const deleteClassroom = async (class_id: string): Promise<void> => {
  await api.delete(`/api/v1/class/${class_id}`);
};

// Hooks
export const useClassrooms = () => {
  const { accessToken } = useAuth();

  return useQuery<Classroom[], ApiError>({
    queryKey: ["classrooms"],
    queryFn: () => {
      if (accessToken) setAuthHeader(accessToken);
      return fetchClassrooms();
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClassroom = (class_id?: string) => {
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

  return useMutation<Classroom, ApiError, Classroom>({
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

  return useMutation<Classroom, ApiError, { class_id: string } & Partial<Classroom>>({
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

  return useMutation<void, ApiError, string>({
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
