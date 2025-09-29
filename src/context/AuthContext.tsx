import {
  useEffect,
  createContext,
  useState,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { axiosPrivate } from "../api/axios";
import api from "../api/axios";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import axios from "axios";

// Define a custom interface for our request config to include the _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface User {
  userId: number;
  displayName: string | null;
  email: string;
  leetcodeUsername: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isAuthLoading: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await api.post("/token/refresh", null, {
          withCredentials: true,
        });
        setAccessToken(response.data.accessToken);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.log("No active session or refresh token expired.");
        }
      } finally {
        setIsAuthLoading(false); // <-- Stop loading once check is complete
      }
    };

    verifyRefreshToken();
  }, []);

  //
  /// This effect runs whenever the accessToken changes
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await axiosPrivate.get("/user/me");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user on token change", error);
          // If fetching the user fails, the token might be invalid, so log out.
          setAccessToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [accessToken]);

  const logout = async () => {
    setAccessToken(null);
    try {
      await axiosPrivate.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useLayoutEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axiosPrivate.post("/token/refresh");
            const newAccessToken = refreshResponse.data.accessToken;
            setAccessToken(newAccessToken);
            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
            return axiosPrivate(originalRequest);
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, user, isAuthLoading, setAccessToken, logout }}
    >
      {!isAuthLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
