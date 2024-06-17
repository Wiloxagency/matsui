import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  FormulaComponentInterface,
  GetFormulasResultInterface,
  InkSystemInterface,
  PigmentInterface,
  UserInterface,
} from "../interfaces/interfaces";
import authStore from "./authStore";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const auth = authStore.getState().auth;
    const token = auth?.accessToken;
    console.log("token: ", token)

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  console.log("BASE QUERY RUNS");

  if (result.error && result.error.status === 403) {
    // If access token is expired, attempt to refresh it
    const refreshResult = await baseQuery(
      {
        url: "/refreshToken",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Retry the original query with the new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh failed, log out the user
      // Optionally, clear user state or redirect to login
      console.error("Failed to refresh token");
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  tagTypes: [],
  endpoints: (builder) => ({
    getUsers: builder.query<Array<UserInterface>, void>({
      query: () => "users/",
    }),
    getFormulas: builder.query<
      GetFormulasResultInterface[],
      {
        formulaSeries: string;
        formulaSearchQuery: string;
      }
    >({
      query: (arg) => ({
        method: "POST",
        url: "components/GetFormulas",
        body: {
          formulaSeries: arg.formulaSeries,
          formulaSearchQuery: arg.formulaSearchQuery,
        },
        headers: {
          Authorization: "",
          // Authorization: `Bearer ${accessToken}`, // Example: Access token from context
          "Content-Type": "application/json",
        },
      }),
    }),
    // getGivenComponents: builder.query<
    //   Array<FormulaComponentInterface>,
    //   string[]
    // >({
    //   query: (body) => ({
    //     url: "components/",
    //     method: "POST",
    //     body: body,
    //   }),
    // }),
    getInkSystems: builder.query<Array<InkSystemInterface>, void>({
      query: () => "inkSystems/",
    }),
    getSeries: builder.query<Array<{ seriesName: string }>, void>({
      query: () => "components/GetSeries",
    }),
    // getCodesOfFormulasInSeries: builder.query<Array<string>, string>({
    //   query: (seriesName) =>
    //     "components/GetCodesOfFormulasInSeries/" + seriesName,
    // }),
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
    addSeries: builder.mutation<void, { seriesName: string }>({
      query: (payload) => ({
        url: "series",
        method: "POST",
        body: payload,
      }),
    }),
    importFormulas: builder.mutation<void, FormulaComponentInterface[]>({
      query: (payload) => ({
        url: "components/ImportFormulas",
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
    verifyEmail: builder.query<
      void,
      {
        encryptedId: string;
      }
    >({
      query: (arg) => {
        const { encryptedId } = arg;
        return {
          method: "POST",
          url: "/emailVerification",
          body: { encryptedId },
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulasQuery,
  // useGetGivenComponentsQuery,
  useGetSeriesQuery,
  useGetInkSystemsQuery,
  // useGetCodesOfFormulasInSeriesQuery,
  useGetPigmentsQuery,
  useAddFormulaMutation,
  useDeleteSeriesMutation,
  useAddSeriesMutation,
  useImportFormulasMutation,
  useVerifyEmailQuery,
} = api;
