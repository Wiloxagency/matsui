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
    getFormula: builder.query<
      FormulaInterface,
      { formulaSeries: string; formulaCode: string }
    >({
      query: (arg) => {
        const { formulaSeries, formulaCode } = arg;

        return {
          method: "POST",
          url: "formulas/",
          params: { formulaSeries, formulaCode },
        };
      },
      providesTags: [],
    }),
    getFormulaComponents: builder.query<Array<FormulaComponentInterface>, void>(
      {
        query: () => "components/",
        providesTags: [],
      }
    ),
    getGivenComponents: builder.query<
      Array<FormulaComponentInterface>,
      string[]
    >({
      query: (body) => ({
        url: "components/",
        method: "POST",
        body: body,
      }),
      providesTags: [],
    }),
    getInkSystems: builder.query<Array<InkSystemInterface>, void>({
      query: () => "inkSystems/",
      providesTags: [],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulasQuery,
  useGetFormulaQuery,
  useGetFormulaComponentsQuery,
  useGetGivenComponentsQuery,
  useGetInkSystemsQuery,
} = api;
