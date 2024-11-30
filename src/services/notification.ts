import baseAPI from ".";

export interface TNotification {
    id: string;
    user: string;
    module_type: string;
    title: string;
    message: string;
    status: string;
    created_datetime: string;
    due_date: null;
}

const NotificationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            {
                count: number;
                next: null;
                previous: null;
                results: TNotification[];
            },
            null
        >({
            query: () => ({
                method: "GET",
                url: "/notifications",
            }),
        }),
    }),
});

export const { useGetNotificationsQuery } = NotificationAPI;
