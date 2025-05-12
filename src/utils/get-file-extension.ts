export function getFileExtension(url: string) {
  const parts = url.split("/");

  const fileName = parts[parts.length - 1];

  const extension = fileName.split(".").pop();

  return extension;
}

export async function createFileObjectFromUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.split("/").pop();
  return new File([blob], filename as string, { type: blob.type });
}
