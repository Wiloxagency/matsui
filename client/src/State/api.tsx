import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FormulaComponentInterface,
  FormulaInterface,
  InkSystemInterface,
  PigmentInterface,
  UserInterface,
} from "../interfaces/interfaces";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (builder) => ({
    getUsers: builder.query<Array<UserInterface>, void>({
      query: () => "users/",
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
    }),
    getInkSystems: builder.query<Array<InkSystemInterface>, void>({
      query: () => "inkSystems/",
    }),
    getSeries: builder.query<Array<{ seriesName: string }>, void>({
      query: () => "components/GetSeries",
    }),
    getSeriesFormulaCodes: builder.query<Array<string>, string>({
      query: (seriesName) => "components/GetSeriesFormulaCodes/" + seriesName,
    }),
    getPigments: builder.query<Array<PigmentInterface>, void>({
      query: () => "components/GetPigments",
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulaComponentsQuery,
  useGetGivenComponentsQuery,
  useGetSeriesQuery,
  useGetInkSystemsQuery,
  useGetSeriesFormulaCodesQuery,
  useGetPigmentsQuery,
} = api;
