function isBase64DataURL(dataURL) {
  if (typeof dataURL !== "string") return false;
  // Extract the base64 part from the data URL
  const base64Match = dataURL.match(/^data:[^;]+;base64,([^,]+)$/);

  if (base64Match) {
    const base64Data = base64Match[1];

    try {
      // Decode the base64 data to check if it's valid
      atob(base64Data);
      return true;
    } catch (e) {
      // If decoding fails, it's not a valid base64
      return false;
    }
  } else {
    // If there is no base64 part in the data URL
    return false;
  }
}

/**
 *
 * @param {string} dataUrl
 * @returns
 */
export function getBase64FileType(dataUrl) {
  if (dataUrl === undefined) return "";
  if (!isBase64DataURL(dataUrl)) return dataUrl;

  const fileType = dataUrl?.substring(
    dataUrl?.indexOf("/") + 1,
    dataUrl?.indexOf(";base64")
  );
  return fileType;
}

export function downloadFile(blob, fileName = "file") {
  if (blob instanceof Blob) {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }
}

/**
 *
 * @param {Blob} blob
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    if (blob instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    } else {
      resolve("");
    }
  });
}

export function getFileExtension(fileName) {
  return fileName?.split(".")?.pop();
}
