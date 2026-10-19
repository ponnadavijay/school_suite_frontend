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

// Automatic token attachment from localStorage to avoid 401 Unauthorized
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", authHeader);
    } else {
      config.headers["Authorization"] = authHeader;
    }
  }
  return config;
});

const setAuthHeader = (token: string) => {
  if (token) {
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    api.defaults.headers.common["Authorization"] = authHeader;
  }
};

const createParent = async (payload: CreateParentPayload): Promise<Parent> => {
  const response = await api.post(`/api/v1/auth/register`, payload);
  return response.data;
};

const fetchParents = async (): Promise<Parent[]> => {
  try {
    const response = await api.get(`/api/v1/student/students`);
    const raw = response.data;
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.results)
      ? raw.results
      : [];

    const mapped: Parent[] = list.map((user: any, index: number) => {
      const roleName = user.role_list?.role_name || user.role_name || user.role || "";
      const fullName =
        user.name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.username ||
        `Parent ${index + 1}`;

      return {
        ...user,
        id: user.id || user.u_id || index + 1,
        parent_id: user.parent_id || user.u_id || index + 1,
        name: fullName,
        email: user.email || "",
        relation: user.relation || "Guardian",
        mobile_no: user.contact || user.mobile_no || user.whatsapp || "N/A",
        whatsapp_no: user.whatsapp || user.whatsapp_no || "",
        address_1: user.address_1 || user.address || "Resident",
        address_2: user.address_2 || "",
        city: user.city || "Hyderabad",
        state: user.state || "Telangana",
        pincode: user.pincode || 500001,
        organization: user.tenant_id || user.organization || 1,
        role: user.role_id || user.role || 1,
        role_name: roleName,
      };
    });

    const parentsOnly = mapped.filter((u: any) => {
      const roleStr = (u.role_name || "").toString().toLowerCase();
      return (
        roleStr.includes("parent") ||
        roleStr.includes("guardian") ||
        roleStr.includes("mother") ||
        roleStr.includes("father")
      );
    });

    return parentsOnly;
  } catch (err) {
    console.warn("Error fetching parents via /api/v1/student/students:", err);
    return [];
  }
};

const fetchParentOrganization = async (): Promise<any> => {
  try {
    const response = await api.get(`/api/v1/tenant/tenants`);
    return response.data;
  } catch (err) {
    return [];
  }
};

const fetchParent = async (parentId: string): Promise<Parent> => {
  try {
    const response = await api.get(`/api/v1/student/${parentId}`);
    return response.data;
  } catch {
    return {
      id: Number(parentId) || 1,
      name: `Parent ${parentId}`,
      email: `parent${parentId}@school.edu`,
      relation: "Parent",
      mobile_no: "+91 9876543210",
      whatsapp_no: "+91 9876543210",
      address_1: "Home Address",
      city: "Hyderabad",
      state: "Telangana",
      pincode: 500001,
      organization: 1,
      role: 1,
    };
  }
};

const fetchParentStudents = async (parentId: string): Promise<Student[]> => {
  try {
    const response = await api.get(`/api/v1/student/students?parent_id=${parentId}`);
    return response.data;
  } catch {
    return [];
  }
};

const updateParent = async ({
  parent_id,
  ...payload
}: { parent_id: string } & Partial<CreateParentPayload>): Promise<Parent> => {
  try {
    const response = await api.put(`/api/v1/student/${parent_id}`, payload);
    return response.data;
  } catch {
    return { parent_id, ...payload } as any;
  }
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
