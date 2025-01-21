export function getFileExtension(url: string) {
    const parts = url.split("/");

    const fileName = parts[parts.length - 1];

    const extension = fileName.split(".").pop();

    return extension;
}
