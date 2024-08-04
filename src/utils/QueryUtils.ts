export function provideTags(tagType: any, resultsWithIds: any, error?: any, options = {}) {
  const { selectId = ({ id }: any) => id }: any = options;
  const listTag = { type: tagType };
  const result = error
    ? ["ERROR"]
    : Array.isArray(resultsWithIds)
    ? [
        ...resultsWithIds.map((result) => ({
          type: tagType,
          id: selectId(result || {}) || "",
        })),
        tagType,
      ]
    : typeof resultsWithIds === "object"
    ? [{ type: tagType, id: selectId(resultsWithIds) }]
    : [listTag];

  return result;
}

export function invalidateTags(tagType: any, ids?: any, error?: any) {
  const result = error ? [] : ids?.length ? [...ids.map((id: any) => ({ type: tagType, id }))] : [{ type: tagType }];

  return result;
}
