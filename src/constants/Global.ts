export const EnvVarEnum = {
  // PROD: import.meta.env.PROD,
  // DEV: import.meta.env.DEV,
  AHNI_API_BASE_URL: import.meta.env.VITE_AHNI_API_BASE_URL,
  // SESSION_TIMEOUT: import.meta.env.VITE_SESSION_TIMEOUT,
};

export const PaginationParamsDefault = {
  offset: 0,
  limit: 20,
};

export const PaginationDefault = {
  pageIndex: 0,
  pageSize: 20,
};

export const ErrorMessages = {
  GENERIC_ERROR_MESSAGE: "Something Went wrong!",
};

export const DOCUMENT_TYPE = {
  PDF: "application/pdf",
  IMAGE: "image",
};
