export const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const YYYYMMDD = dateObject.toISOString().split("T")[0];
    return YYYYMMDD;
};
