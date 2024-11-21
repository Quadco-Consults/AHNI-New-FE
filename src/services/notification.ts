import { NotificationType } from "definations/notification-types";
import baseAPI from ".";

const NotificationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            {
                count: number;
                next: number;
                previous: number;
                results: NotificationType[];
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
