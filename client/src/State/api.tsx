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
// import authStore from "./authStore";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  // credentials: "include",
  // prepareHeaders: (headers) => {
  // const auth = authStore.getState().auth;
  // const token = auth?.accessToken;
  // console.log("token: ", token)

  // const accessToken = localStorage.getItem("accessToken");
  // console.log("accessToken: ", accessToken);

  // if (accessToken) {
  //   headers.set("authorization", `Bearer ${accessToken}`);
  // }

  // return headers;
  // },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // let result = await baseQuery(args, api, extraOptions);

  // if (result.error && result.error.originalStatus === 403) {
  // if (result.error) {
  // If access token is expired, attempt to refresh it
  // const refreshResult = await baseQuery(
  //   {
  //     url: "/refreshToken",
  //     method: "POST",
  //   },
  //   api,
  //   extraOptions
  // );

  // if (refreshResult.data) {
  // console.log(refreshResult.data);
  // Retry the original query with the new access token
  // result = await baseQuery(args, api, extraOptions);
  const result = await baseQuery(args, api, extraOptions);
  // } else {
  // If refresh failed, log out the user
  // Optionally, clear user state or redirect to login
  // console.error("Failed to refresh token");
  // }
  // }

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
        formulaSeries?: string;
        formulaSearchQuery?: string;
        userCompany?: string;
        selectedCompany?: string;
        userEmail?: string;
        includeSystemFormulas?: boolean;
      }
    >({
      query: (arg) => ({
        method: "POST",
        url: "components/GetFormulas",
        body: {
          formulaSeries: arg.formulaSeries,
          formulaSearchQuery: arg.formulaSearchQuery,
          userCompany: arg.userCompany,
          selectedCompany: arg.selectedCompany,
          userEmail: arg.userEmail,
        },
        headers: {
          Authorization: "",
          // Authorization: `Bearer ${accessToken}`, // Example: Access token from context
          "Content-Type": "application/json",
        },
      }),
    }),
    getInkSystems: builder.query<Array<InkSystemInterface>, void>({
      query: () => "inkSystems/",
    }),
    getSeries: builder.query<Array<{ seriesName: string }>, void>({
      query: () => "components/GetSeries",
    }),
    getSuppliers: builder.query<Array<{ name: string }>, void>({
      query: () => "/Supplier",
    }),
    getPigments: builder.query<Array<PigmentInterface>, void>({
      query: () => "components/GetPigments",
    }),
    addOrEditFormula: builder.mutation<
      void,
      {
        formulaComponents: FormulaComponentInterface[];
        company: string;
        createdBy: string;
        isEditOrCreate: "edit" | "create";
        isFormulaActive: boolean;
      }
    >({
      query: (payload) => ({
        url: "components/CreateOrEditFormula",
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
    importFormulas: builder.mutation<
      {
        formulasCreated: number;
        formulasNotCreated: string[];
      },
      {
        formulaComponents: FormulaComponentInterface[];
        company: string;
        createdBy: string;
      }
    >({
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
    updateUser: builder.mutation<void, UserInterface>({
      query: (payload) => ({
        url: "users/",
        method: "PUT",
        body: payload,
      }),
    }),
    sendEmail: builder.query<
      void,
      {
        recipients: string[];
        subject: string;
        message: string;
        isResetPasswordEmail?: boolean;
      }
    >({
      query: (payload) => {
        return {
          method: "POST",
          url: "users/SendEmail",
          body: payload,
        };
      },
    }),
    getSimilarFormulas: builder.query<
      GetFormulasResultInterface[],
      {
        formulaCode: string;
        formulaSeries: string;
      }
    >({
      query: (arg) => ({
        method: "POST",
        url: "components/GetClosestColors",
        body: {
          formulaCode: arg.formulaCode,
          formulaSeries: arg.formulaSeries,
        },
        headers: {
          Authorization: "",
          // Authorization: `Bearer ${accessToken}`, // Example: Access token from context
          "Content-Type": "application/json",
        },
      }),
    }),
    getAllComponents: builder.query<
      Array<FormulaComponentInterface>,
      { series?: string }
    >({
      query: (arg) => ({
        method: "POST",
        url: "components/GetComponents",
        body: {
          series: arg.series,
        },
      }),
    }),
    deleteUser: builder.mutation<void, { userEmail: string }>({
      query: (payload) => ({
        url: "users/",
        method: "DELETE",
        body: payload,
      }),
    }),
    resetUserPassword: builder.query<
      void,
      {
        encryptedId: string;
        newPassword: string;
      }
    >({
      query: (payload) => {
        return {
          method: "POST",
          url: "users/ResetPassword",
          body: payload,
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetFormulasQuery,
  useGetSeriesQuery,
  useGetInkSystemsQuery,
  useGetPigmentsQuery,
  useAddOrEditFormulaMutation,
  useDeleteSeriesMutation,
  useAddSeriesMutation,
  useImportFormulasMutation,
  useVerifyEmailQuery,
  useUpdateUserMutation,
  useSendEmailQuery,
  useGetSimilarFormulasQuery,
  useGetAllComponentsQuery,
  useDeleteUserMutation,
  useResetUserPasswordQuery,
  useGetSuppliersQuery,
} = api;
