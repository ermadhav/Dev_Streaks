import { Slot, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useEffect, useState } from "react";
import React from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  // ✅ Handle navigation safely AFTER mount
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    // Not logged in → go to login
    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    }

    // Logged in → prevent going back to auth screens
    if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, loading, segments]);

  if (loading) return null;

  return <Slot />;
}
