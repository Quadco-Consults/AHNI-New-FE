export function getAssetInfo(src) {
  const result = { name: "src", type: "" };
  if (src instanceof File) {
    result.name = src.name;
    result.type = src.name.slice(src.name.lastIndexOf(".") + 1);
  } else if (typeof src === "string") {
    result.name = src.slice(src.lastIndexOf("/") + 1);
    result.type = src.slice(src.lastIndexOf(".") + 1);
  }
  return result;
}
