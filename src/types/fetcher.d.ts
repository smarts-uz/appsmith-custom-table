/** Fetcher details for TanStack Query + React Query */
export interface FetcherConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: Record<string, any>;
  /** accessor tells how to reach data array in the API response */
  accessor?: string;
}

// function getDataFromResponse(json: any, accessor?: string) {
//   if (!accessor) return json;
//   return accessor.split(".").reduce((acc, key) => acc?.[key], json);
// }

// const { data } = await fetch(url, { method, headers, body })
//   .then(res => res.json())
//   .then(json => getDataFromResponse(json, accessor));