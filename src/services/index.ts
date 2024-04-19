import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "src/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const { auth } = getState() as RootState;

    if (auth.accessToken) {
      headers.set("Authorization", `Token ${auth.accessToken}`);
    }
    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 404) {
    return result.error;
  }

  // @ts-ignore
  //   if (result.error && result.error.originalStatus === 401) {
  //     const payload = {
  //       token: "",
  //     };

  //     try to get a new token

  //     const BEARER_VALUE = "";

  //     const resp = await fetch("", {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${BEARER_VALUE} `,
  //         // 'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     });

  //     const data = await resp.json();
  //     const refreshResult = await baseQuery(
  //       {
  //         url: '',
  //         method: 'POST',
  //         body: {
  //           token: "",
  //         },
  //         headers: {
  //           append: 'Authorization',
  //           set: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5UZG1aak00WkRrM05qWTBZemM1TW1abU9EZ3dNVEUzTVdZd05ERTVNV1JsWkRnNE56YzRaQT09In0.eyJhdWQiOiJodHRwOlwvXC9vcmcud3NvMi5hcGltZ3RcL2dhdGV3YXkiLCJzdWIiOiJ2aWN0b3JAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJ2aWN0b3IiLCJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJCYWFTUG9ydGFsIiwiaWQiOjEyNiwidXVpZCI6bnVsbH0sInNjb3BlIjoiYW1fYXBwbGljYXRpb25fc2NvcGUgZGVmYXVsdCIsImlzcyI6Imh0dHBzOlwvXC9wdWJzdG9yZS1kZXZhcHBzLnZmZGJhbmsuc3lzdGVtczo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJVbmxpbWl0ZWQiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkJhYVNBUElQcm9kdWN0IiwiY29udGV4dCI6Ilwvdi1iYWFzXC9hcGlcL3YxIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkJBQVMtUE9SVEFMLVBST0RVQ1QiLCJjb250ZXh0IjoiXC92ZmQtdGVjaFwvYmFhcy1wb3J0YWwiLCJwdWJsaXNoZXIiOiJ2aWN0b3IiLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn1dLCJjb25zdW1lcktleSI6IjJ0ZlZzWmJuaTEyMFFsQ05PcGZXWHFDUG9DVWEiLCJleHAiOjM4MTU1NjU0OTksImlhdCI6MTY2ODA4MTg1MiwianRpIjoiYzNiMGQ5NTAtYWQyOC00MTRjLWI3OGItODZlZTUwNTEwNDc1In0.pgqfVFZqYeH69JH7I2JAer6p6qeEFntoYwgFCge3210qMveACOIKYl8QkZJd1VrKLEiANkVetYuSPuN6n1boZffQwMT3iiX8OhoWY71NzezniEeF__vhoVkZRYxTo_THXnhbH29L-masB07I_b4KC8yqmeik01IDEpJ1dy51kv1CFZ_uwN_VQXY8PNx_tGIjAVynKA4nZE1An9KR1dP79E9pB-PjeUzhOzkkB510AhQiuvjmjaoUQDkM5lCvm5UFyP8t36Dbzy6ehy45P6Z0YHeJmowbsi4PlHTyDQpy8efzzJq1KLQEh78EEUDIpFrsmvBQfuHCh1hxmCRoS_Zasg',
  //         },

  //         // headers: {
  //         //   Authorization:
  //         //     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5UZG1aak00WkRrM05qWTBZemM1TW1abU9EZ3dNVEUzTVdZd05ERTVNV1JsWkRnNE56YzRaQT09In0.eyJhdWQiOiJodHRwOlwvXC9vcmcud3NvMi5hcGltZ3RcL2dhdGV3YXkiLCJzdWIiOiJ2aWN0b3JAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJ2aWN0b3IiLCJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJCYWFTUG9ydGFsIiwiaWQiOjEyNiwidXVpZCI6bnVsbH0sInNjb3BlIjoiYW1fYXBwbGljYXRpb25fc2NvcGUgZGVmYXVsdCIsImlzcyI6Imh0dHBzOlwvXC9wdWJzdG9yZS1kZXZhcHBzLnZmZGJhbmsuc3lzdGVtczo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJVbmxpbWl0ZWQiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkJhYVNBUElQcm9kdWN0IiwiY29udGV4dCI6Ilwvdi1iYWFzXC9hcGlcL3YxIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkJBQVMtUE9SVEFMLVBST0RVQ1QiLCJjb250ZXh0IjoiXC92ZmQtdGVjaFwvYmFhcy1wb3J0YWwiLCJwdWJsaXNoZXIiOiJ2aWN0b3IiLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn1dLCJjb25zdW1lcktleSI6IjJ0ZlZzWmJuaTEyMFFsQ05PcGZXWHFDUG9DVWEiLCJleHAiOjM4MTU1NjU0OTksImlhdCI6MTY2ODA4MTg1MiwianRpIjoiYzNiMGQ5NTAtYWQyOC00MTRjLWI3OGItODZlZTUwNTEwNDc1In0.pgqfVFZqYeH69JH7I2JAer6p6qeEFntoYwgFCge3210qMveACOIKYl8QkZJd1VrKLEiANkVetYuSPuN6n1boZffQwMT3iiX8OhoWY71NzezniEeF__vhoVkZRYxTo_THXnhbH29L-masB07I_b4KC8yqmeik01IDEpJ1dy51kv1CFZ_uwN_VQXY8PNx_tGIjAVynKA4nZE1An9KR1dP79E9pB-PjeUzhOzkkB510AhQiuvjmjaoUQDkM5lCvm5UFyP8t36Dbzy6ehy45P6Z0YHeJmowbsi4PlHTyDQpy8efzzJq1KLQEh78EEUDIpFrsmvBQfuHCh1hxmCRoS_Zasg',
  //         // },
  //       },
  //       api,
  //       extraOptions,
  //     );

  //     if (data.status === "00") {
  //       // store the new token
  //       api.dispatch(registerToken(""));
  //       // Retry the initial query
  //       result = await baseQuery(args, api, extraOptions);
  //     } else {
  //       api.dispatch(logOut());
  //     }
  //   }
  return result;
};

const baseAPI = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,

  //   extractRehydrationInfo(action, { reducerPath }) {
  //     if (action.type === REHYDRATE) {
  //       return action.payload[reducerPath];
  //     }
  //   },
  endpoints: () => ({}),
  //  cache , The default time is seconds , Default duration 60 second
  tagTypes: [],
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
});

export default baseAPI;
