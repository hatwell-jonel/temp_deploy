"use client";

import { useEffect } from "react";

function RequestNotification() {
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
  }, []);
  return <></>;
}

export default RequestNotification;
