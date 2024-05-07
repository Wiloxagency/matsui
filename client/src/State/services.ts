import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserInterface } from "../interfaces/interfaces";

export const services = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "services",
  tagTypes: [],
  endpoints: (build) => ({
    getUsers: build.query<Array<UserInterface>, void>({
      query: () => "users/",
      providesTags: [],
    }),
  }),
});

export const { useGetUsersQuery } = services;
