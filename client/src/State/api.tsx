import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FormulaComponentInterface,
  FormulaSwatchInterface,
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
    // getFormulaComponents: builder.query<
    //   FormulaInterface,
    //   { formulaSeries: string; formulaCode: string }
    // >({
    //   query: (arg) => {
    //     const { formulaSeries, formulaCode } = arg;
    //     return {
    //       method: "POST",
    //       url: "components/",
    //       params: { formulaSeries, formulaCode },
    //     };
    //   },
    // }),
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
    getFormulaSwatchColors: builder.query<Array<FormulaSwatchInterface>, void>({
      query: () => "components/GetFormulaSwatchColors",
    }),
    addFormula: builder.mutation<void, FormulaComponentInterface[]>({
      query: (payload) => ({
        url: "components/CreateFormula",
        method: "POST",
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
  useGetFormulaSwatchColorsQuery,
  useAddFormulaMutation,
} = api;
