import { postsTableSchema } from "./types/mock";

export const mockModel = {
  fetcher: {
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    headers: {},
    body: null,
    accessor: ""
  },
  schema: postsTableSchema,
};
