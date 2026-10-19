import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://patashala.intellvia.in";

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatic token attachment from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const setAuthHeader = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Helper to normalize array responses
const normalizeList = <T,>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && typeof data === "object") {
    // If it's a keyed dictionary of items
    const values = Object.values(data);
    if (values.length > 0 && typeof values[0] === "object") {
      return values as T[];
    }
  }
  return [];
};

// ==========================================
// --- Roles Types & APIs ---
// ==========================================
export interface Role {
  id?: string | number;
  role_id?: string | number;
  role_name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleCreateModel {
  role_name: string;
  description?: string;
}

export interface RoleUpdateModel {
  role_id: string | number;
  role_name: string;
  description?: string;
}

export const createRole = async (payload: RoleCreateModel): Promise<any> => {
  const response = await api.post(`/api/v1/admin/create_role`, payload);
  return response.data;
};

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await api.get(`/api/v1/admin/roles`);
  return normalizeList<Role>(response.data);
};

export const fetchRole = async (id: string | number): Promise<Role> => {
  const response = await api.get(`/api/v1/admin/role/${id}`);
  return response.data;
};

export const updateRole = async (payload: RoleUpdateModel): Promise<any> => {
  const roleId = payload.role_id;
  try {
    const response = await api.put(`/api/v1/admin/role/${roleId}`, payload);
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const response = await api.put(`/api/v1/admin/role?role_id=${roleId}`, payload);
      return response.data;
    }
    throw err;
  }
};

export const deleteRole = async (role_id: string | number): Promise<void> => {
  await api.delete(`/api/v1/admin/role?role_id=${role_id}`);
};

// ==========================================
// --- Permissions Types & APIs ---
// ==========================================
export interface PermissionItem {
  id?: string | number;
  perm_id?: string | number;
  permission: string;
  perm_description: string;
  role_id?: string | number;
  role_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PermCreateModel {
  perm_description: string;
  permission: string;
  role_id: string | number;
}

export interface PermUpdateModel {
  id: string | number;
  permission: string;
  perm_description: string;
  role_id?: string | number;
}

export const createPermission = async (payload: PermCreateModel): Promise<any> => {
  const response = await api.post(`/api/v1/admin/permissions/create`, payload);
  return response.data;
};

export const fetchPermissions = async (): Promise<PermissionItem[]> => {
  const response = await api.get(`/api/v1/admin/permissions`);
  return normalizeList<PermissionItem>(response.data);
};

export const fetchPermission = async (id: string | number): Promise<PermissionItem> => {
  const response = await api.get(`/api/v1/admin/permissions/${id}`);
  return response.data;
};

export const updatePermission = async (payload: PermUpdateModel): Promise<any> => {
  const permId = payload.id;
  try {
    const response = await api.put(`/api/v1/admin/permissions/${permId}`, payload);
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const response = await api.put(`/api/v1/admin/permissions/update/${permId}`, payload);
      return response.data;
    }
    throw err;
  }
};

export const deletePermission = async (id: string | number): Promise<void> => {
  await api.delete(`/api/v1/admin/permissions/${id}`);
};

// ==========================================
// --- Tenants Types & APIs ---
// ==========================================
export interface Tenant {
  id?: string | number;
  tenant_id?: string | number;
  name: string;
  address: string;
  email: string;
  contact: string;
  country: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export interface TenantCreateModel {
  name: string;
  address: string;
  email: string;
  contact: string;
  country: string;
}

export interface TenantUpdateModel {
  id: string | number;
  name: string;
  address: string;
  email: string;
  contact: string;
  country: string;
}

export const createTenant = async (payload: TenantCreateModel): Promise<any> => {
  const response = await api.post(`/api/v1/tenant/create_tenant`, payload);
  return response.data;
};

export const fetchTenants = async (): Promise<Tenant[]> => {
  const response = await api.get(`/api/v1/tenant/tenants`);
  return normalizeList<Tenant>(response.data);
};

export const fetchTenant = async (id: string | number): Promise<Tenant> => {
  const response = await api.get(`/api/v1/tenant/${id}`);
  return response.data;
};

export const updateTenant = async (payload: TenantUpdateModel): Promise<any> => {
  const tenantId = payload.id;
  try {
    const response = await api.put(`/api/v1/tenant/update/${tenantId}`, payload);
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const response = await api.put(`/api/v1/tenant/${tenantId}`, payload);
      return response.data;
    }
    throw err;
  }
};

export const deleteTenant = async (id: string | number): Promise<void> => {
  await api.delete(`/api/v1/tenant/delete/${id}`);
};

// ==========================================
// --- React Query Hooks ---
// ==========================================

// --- Roles Hooks ---
export const useRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRole = (id?: string | number) => {
  return useQuery<Role>({
    queryKey: ["role", id],
    queryFn: () => fetchRole(id!),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

// --- Permissions Hooks ---
export const usePermissions = () => {
  return useQuery<PermissionItem[]>({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePermission = (id?: string | number) => {
  return useQuery<PermissionItem>({
    queryKey: ["permission", id],
    queryFn: () => fetchPermission(id!),
    enabled: !!id,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};

// --- Tenants Hooks ---
export const useTenants = () => {
  return useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenant = (id?: string | number) => {
  return useQuery<Tenant>({
    queryKey: ["tenant", id],
    queryFn: () => fetchTenant(id!),
    enabled: !!id,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

// ==========================================
// --- WhatsApp Webhook APIs ---
// ==========================================
export const verifyWhatsappWebhook = async (params: {
  mode: string;
  token: string;
  challenge: string;
}): Promise<any> => {
  const response = await api.get(`/api/v1/admin/wapphook`, {
    params: {
      "hub.mode": params.mode,
      "hub.verify_token": params.token,
      "hub.challenge": params.challenge,
    },
  });
  return response.data;
};

export const postWhatsappWebhook = async (payload: any): Promise<any> => {
  const response = await api.post(`/api/v1/admin/wapphook`, payload);
  return response.data;
};

export const usePostWhatsappWebhook = () => {
  return useMutation({
    mutationFn: postWhatsappWebhook,
  });
};

export default api;

