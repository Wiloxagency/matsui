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
    getFormulaComponents: builder.query<
      FormulaInterface,
      { formulaSeries: string; formulaCode: string }
    >({
      query: (arg) => {
        const { formulaSeries, formulaCode } = arg;

        return {
          method: "POST",
          url: "components/",
          params: { formulaSeries, formulaCode },
        };
      },
      providesTags: [],
    }),
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
    getSeries: builder.query<Array<{ seriesName: string }>, void>({
      query: () => "components/GetSeries",
      providesTags: [],
    }),
    getSeriesFormulaCodes: builder.query<Array<string>, string>({
      query: (seriesName) => "components/GetSeriesFormulaCodes/" + seriesName,
      providesTags: [],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulaComponentsQuery,
  useGetGivenComponentsQuery,
  useGetSeriesQuery,
  useGetInkSystemsQuery,
  useGetSeriesFormulaCodesQuery
} = api;
