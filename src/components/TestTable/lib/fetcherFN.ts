import { getNestedValue } from "./getNestedValue";

type FetcherOptions = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: BodyInit | null;
  accessor?: string; // string path like "data.items"
  cb?: (data: any) => void;
};

export const fetcherFN = async <T = unknown>({
  url,
  headers,
  body,
  method = "GET",
  accessor,
  cb,
}: FetcherOptions): Promise<T[]> => {
  const res = await fetch(url, { headers, method, body });

  if (!res.ok)
    throw new Error(`Network error: ${res.status} ${res.statusText}`);

  const json = await res.json();
  const data = getNestedValue<T>(json, accessor, []);

  if (cb) {
    cb(data);
  }

  return data;
};
