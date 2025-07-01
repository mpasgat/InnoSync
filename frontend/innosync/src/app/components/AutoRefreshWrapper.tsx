"use client";
import useAutoRefreshToken from "@/app/utils/useAutoRefreshToken";

export default function AutoRefreshWrapper() {
  useAutoRefreshToken();

  return null; // nothing visual — it just runs the hook
}
