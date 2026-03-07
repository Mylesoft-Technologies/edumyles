"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?._id ? String(user._id) : null;

  // Try to use the notifications query, but handle errors gracefully
  let notifications = [];
  let unreadCount = 0;
  let isLoading = false;

  try {
    const notificationsResult = useQuery(
      api.notifications.getNotifications,
      userId ? { userId, limit: 20 } : "skip"
    );
    const unreadCountResult = useQuery(
      api.notifications.getUnreadCount,
      userId ? { userId } : "skip"
    );

    // If the query throws an error (function not found), use fallback values
    if (notificationsResult !== undefined) {
      notifications = notificationsResult;
    }
    if (unreadCountResult !== undefined) {
      unreadCount = unreadCountResult;
    }
    isLoading = notificationsResult === undefined;
  } catch (error) {
    console.warn("Notifications not available:", error);
    // Use fallback values
    notifications = [];
    unreadCount = 0;
    isLoading = false;
  }

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: (notificationId: string) => {
      try {
        markAsRead({ notificationId: notificationId as any });
      } catch (error) {
        console.warn("Mark as read not available:", error);
      }
    },
    markAllAsRead: () => {
      if (userId) {
        try {
          markAllAsRead({ userId });
        } catch (error) {
          console.warn("Mark all as read not available:", error);
        }
      }
    },
  };
}
