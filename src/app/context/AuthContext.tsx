import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface User {
  id?: string;
  u_id?: string;
  email?: string;
  role_id?: string;
  tenant_id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role?: { role_id?: any; role_name?: string };
  role_name?: string;
  organization?: { org_id?: any; org_name?: string };
  permissions?: string[];
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  isLoadingUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthData: (user: User | null, access: string, refresh?: string) => Promise<void>;
  fetchUserDetails: (tokenOverride?: string) => Promise<User | null>;
  hasPermission: (permission?: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = "https://patashala.intellvia.in";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken");
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem("refreshToken");
  });

  const [permissions, setPermissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("permissions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  // Decode JWT token safely and restore user state & permissions without making network calls to /me or /student
  const fetchUserDetails = useCallback(async (tokenOverride?: string): Promise<User | null> => {
    const token = tokenOverride || accessToken || localStorage.getItem("accessToken");
    if (!token) return null;

    let tokenPayload: any = null;
    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        tokenPayload = JSON.parse(jsonPayload);
      }
    } catch (e) {
      console.warn("Could not decode JWT token payload:", e);
    }

    let savedUser: any = null;
    try {
      const saved = localStorage.getItem("user");
      if (saved) savedUser = JSON.parse(saved);
    } catch {
      // ignore
    }

    const tokenUser = tokenPayload?.user || tokenPayload || {};
    const candidateUserId = tokenUser?.u_id || tokenUser?.id || tokenUser?.sub || savedUser?.id || savedUser?.u_id;
    const candidateEmail = tokenUser?.email || tokenUser?.username || savedUser?.email;

    const roleId =
      tokenUser?.role_id ||
      tokenUser?.role?.role_id ||
      savedUser?.role_id ||
      savedUser?.role?.role_id ||
      "";

    const roleName =
      tokenUser?.role_name ||
      tokenUser?.role?.role_name ||
      tokenUser?.role_list?.role_name ||
      savedUser?.role_name ||
      savedUser?.role?.role_name ||
      "";

    // Extract permissions directly from token or saved user or admin bypass
    let permissionsList: string[] = [];
    if (Array.isArray(tokenUser?.permissions)) {
      permissionsList = tokenUser.permissions;
    } else if (Array.isArray(tokenPayload?.permissions)) {
      permissionsList = tokenPayload.permissions;
    } else if (Array.isArray(savedUser?.permissions)) {
      permissionsList = savedUser.permissions;
    }

    const roleLower = String(roleName).toLowerCase();
    if (
      roleLower.includes("admin") ||
      roleLower.includes("principal") ||
      roleLower.includes("super")
    ) {
      if (!permissionsList.includes("*")) {
        permissionsList = ["*", ...permissionsList];
      }
    }

    const normalizedPerms: string[] = permissionsList
      .map((p: any) => (typeof p === "string" ? p.trim().toLowerCase() : p?.permission?.trim().toLowerCase() || ""))
      .filter(Boolean);

    const resolvedUser: User = {
      ...(savedUser || {}),
      ...tokenUser,
      id: candidateUserId,
      u_id: candidateUserId,
      email: candidateEmail || "",
      first_name: tokenUser?.first_name || savedUser?.first_name || "",
      last_name: tokenUser?.last_name || savedUser?.last_name || "",
      name:
        tokenUser?.name ||
        savedUser?.name ||
        `${tokenUser?.first_name || savedUser?.first_name || ""} ${tokenUser?.last_name || savedUser?.last_name || ""}`.trim() ||
        candidateEmail ||
        "User",
      role_id: String(roleId || ""),
      role_name: roleName,
      role: {
        role_id: roleId,
        role_name: roleName,
      },
      tenant_id: tokenUser?.tenant_id || savedUser?.tenant_id,
      organization: {
        org_id: tokenUser?.tenant_id || savedUser?.tenant_id || 1,
        org_name: tokenUser?.organization?.org_name || savedUser?.organization?.org_name || "Tech Patashala",
      },
      permissions: normalizedPerms,
    };

    setUser(resolvedUser);
    setPermissions(normalizedPerms);
    localStorage.setItem("user", JSON.stringify(resolvedUser));
    localStorage.setItem("permissions", JSON.stringify(normalizedPerms));
    setIsLoadingUser(false);
    return resolvedUser;
  }, [accessToken]);

  // Check user permission
  const hasPermission = useCallback((permission?: string | string[]): boolean => {
    // If no permission rule is specified, always allow
    if (!permission) return true;

    // Check if user is logged in
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token && !user) return false;

    const roleName = (user?.role_name || user?.role?.role_name || "").toLowerCase();
    // Admin, Principal, SuperAdmin, or unassigned roles default to universal access
    if (
      !roleName ||
      roleName.includes("admin") ||
      roleName.includes("principal") ||
      roleName.includes("super")
    ) {
      return true;
    }

    const currentPerms = permissions.length > 0 ? permissions : user?.permissions || [];
    // If user has wildcard permissions or no explicit permissions restriction has been loaded, allow access
    if (
      currentPerms.length === 0 ||
      currentPerms.includes("*") ||
      currentPerms.includes("all")
    ) {
      return true;
    }

    const required = Array.isArray(permission) ? permission : [permission];
    return required.some((req) => {
      const reqLower = req.toLowerCase().trim();
      return currentPerms.some((userPerm) => {
        const p = userPerm.toLowerCase().trim();
        // Exact match
        if (p === reqLower) return true;
        // Prefix/Namespace match e.g. "student" matches "student:view" or vice-versa
        const pPrefix = p.split(":")[0];
        const reqPrefix = reqLower.split(":")[0];
        if (p === reqPrefix || reqLower === pPrefix) return true;
        // Substring match e.g. "student:create" matches "create"
        if (p.includes(reqLower) || reqLower.includes(p)) return true;
        return false;
      });
    });
  }, [user, accessToken, permissions]);

  // Sync /me on initial mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserDetails(token);
    }
  }, [fetchUserDetails]);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    const token = data.access_token || data.token || "";
    const refresh = data.refresh_token || "";
    await setAuthData(data.user, token, refresh);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setPermissions([]);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("permissions");
  };

  const setAuthData = async (userInitial: User | null, access: string, refresh?: string) => {
    setAccessToken(access);
    if (refresh) setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);

    if (userInitial) {
      setUser(userInitial);
      localStorage.setItem("user", JSON.stringify(userInitial));
    }

    // Hit /me immediately to obtain user details & permissions
    await fetchUserDetails(access);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        permissions,
        isLoadingUser,
        login,
        logout,
        setAuthData,
        fetchUserDetails,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
