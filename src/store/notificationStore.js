import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set) => ({
      scheduledNotifications: [],
      
      addScheduledNotification: (notification) =>
        set((state) => ({
          scheduledNotifications: [
            ...state.scheduledNotifications,
            { ...notification, id: Date.now() },
          ],
        })),
      
      removeScheduledNotification: (id) =>
        set((state) => ({
          scheduledNotifications: state.scheduledNotifications.filter(
            (n) => n.id !== id
          ),
        })),
      
      clearAllScheduled: () => set({ scheduledNotifications: [] }),
    }),
    {
      name: "scheduled-notifications",
    }
  )
);

