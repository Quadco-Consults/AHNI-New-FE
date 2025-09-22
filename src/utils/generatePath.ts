// Utility function to replace path parameters - similar to React Router's generatePath
export const generatePath = (path: string, params: Record<string, string>) => {
  let result = path;

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value);
  });

  return result;
};