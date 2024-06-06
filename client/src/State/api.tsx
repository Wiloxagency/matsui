import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FormulaComponentInterface,
  GetFormulasResultInterface,
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
    getFormulas: builder.query<
      GetFormulasResultInterface[],
      {
        isInitialRequest: boolean;
        formulaSeries: string;
        formulaCodes?: string[];
      }
    >({
      query: (arg) => {
        const { formulaSeries, formulaCodes, isInitialRequest } = arg;
        return {
          method: "POST",
          url: "components/GetFormulas",
          body: { formulaSeries, formulaCodes, isInitialRequest },
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
    getCodesOfFormulasInSeries: builder.query<Array<string>, string>({
      query: (seriesName) =>
        "components/GetCodesOfFormulasInSeries/" + seriesName,
    }),
    getPigments: builder.query<Array<PigmentInterface>, void>({
      query: () => "components/GetPigments",
    }),
    addFormula: builder.mutation<void, FormulaComponentInterface[]>({
      query: (payload) => ({
        url: "components/CreateFormula",
        method: "POST",
        body: payload,
      }),
    }),
    deleteSeries: builder.mutation<void, { seriesName: string }>({
      query: (payload) => ({
        url: "series",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulasQuery,
  useGetGivenComponentsQuery,
  useGetSeriesQuery,
  useGetInkSystemsQuery,
  useGetCodesOfFormulasInSeriesQuery,
  useGetPigmentsQuery,
  useAddFormulaMutation,
  useDeleteSeriesMutation,
} = api;
