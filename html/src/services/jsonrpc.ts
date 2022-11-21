import useSWR from "swr";
import useAuth from "../contexts/auth";

const fetcher = function<T>(token: string) {
  return async (method: string, params: any, ...args: any[]) => {
    return await jsonrpc<T>(token, method, params);
  };
}

export async function jsonrpc<T>(token: string, method: string, params?: any) {
  const res = await fetch('/api/v1/jsonrpc', {
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params: params || {}
    }),
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'POST'
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result as T;
}

export function useInvoker<T>(method: string) {
  const { token } = useAuth();
  if (!token) throw new Error("Invalid token");
  return (params?: any) => jsonrpc<T>(token, method, params);
}

export function useRPC<T>(method: string, params?: any, config?: any) {
  const { token } = useAuth();
  if (!token) throw new Error("Invalid token");
  return useSWR([method, params], fetcher<T>(token), config);
}
