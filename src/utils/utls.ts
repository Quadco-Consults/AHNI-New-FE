export function objectToFormData(data: any) {
  const fd = new FormData();
  for (const key in data) {
    fd.set(key, data[key]);
  }
  return fd;
}
