import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FormulaInterface, UserInterface } from "../interfaces/interfaces";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (builder) => ({
    getUsers: builder.query<Array<UserInterface>, void>({
      query: () => "users/",
      providesTags: [],
    }),
    getFormulas: builder.query<Array<FormulaInterface>, void>({
      query: () => "formulas/",
      providesTags: [],
    }),
  }),
});

export const { useGetUsersQuery, useGetFormulasQuery } = api;
