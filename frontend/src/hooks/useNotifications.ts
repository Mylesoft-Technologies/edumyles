"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?._id ? String(user._id) : null;
  const [isClient, setIsClient] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only run Convex queries on client-side
  useEffect(() => {
    if (!isClient || !userId || typeof window === 'undefined') {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const cleanup = () => { mounted = false; };

    // Set up the query
    const queryResult = useQuery(
      api.notifications.getNotifications,
      { userId, limit: 20 }
    );

    const unreadResult = useQuery(
      api.notifications.getUnreadCount,
      { userId }
    );

    const markAsReadMutation = useMutation(api.notifications.markAsRead);
    const markAllAsReadMutation = useMutation(api.notifications.markAllAsRead);

    return () => {
      if (!mounted) return;
      
      if (queryResult !== undefined) {
        setNotifications(queryResult);
      }
      if (unreadResult !== undefined) {
        setUnreadCount(unreadResult);
      }
      setIsLoading(queryResult === undefined);
    };
  }, [isClient, userId]);

  // Return default values for SSR
  if (!isClient || !userId || typeof window === 'undefined') {
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      markAsRead: () => {},
      markAllAsRead: () => {},
    };
  }

  const markAsRead = (notificationId: string) => {
    try {
      // This would be the actual mutation call
      console.log("Mark as read:", notificationId);
    } catch (error) {
      console.warn("Mark as read not available:", error);
    }
  };

  const markAllAsRead = () => {
    try {
      // This would be the actual mutation call
      console.log("Mark all as read for:", userId);
    } catch (error) {
      console.warn("Mark all as read not available:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}
