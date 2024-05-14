import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FormulaComponentInterface,
  FormulaInterface,
  InkSystemInterface,
  UserInterface,
} from "../interfaces/interfaces";

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
    getFormulaComponents: builder.query<Array<FormulaComponentInterface>, void>(
      {
        query: () => "components/",
        providesTags: [],
      }
    ),
    getInkSystems: builder.query<Array<InkSystemInterface>, void>({
      query: () => "inkSystems/",
      providesTags: [],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulasQuery,
  useGetFormulaComponentsQuery,
  useGetInkSystemsQuery,
} = api;
