/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */

import baseAPI from "..";

const BASE_URL = "/config/states/";

const StateAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStates: builder.query<string[], void>({
      query: () => {
        return {
          url: `${BASE_URL}`,
        };
      },
    }),
  }),
});
export default StateAPI;
