import { View, Text, StyleSheet } from "react-native";
import React from "react";

type Props = {
  title: string; // "GitHub username"
  streak: number;
  loading: boolean;
};

export default function StreakCard({ title, streak, loading }: Props) {
  const [platform, username] = title.split(" · ");

  const accent =
    platform.toLowerCase() === "leetcode" ? "#f59e0b" : "#f59e0b";

  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.platform}>{platform} · </Text>

        <View
          style={[
            styles.usernamePill,
            { borderColor: accent, backgroundColor: `${accent}22` },
          ]}
        >
          <Text style={[styles.username, { color: accent }]}>
            {username}
          </Text>
        </View>
      </View>

      {!loading && (
        <Text style={styles.streakText}>
          🔥 {streak} days
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  platform: {
    color: "#9ca3af",
    fontSize: 14,
  },

  usernamePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  username: {
    fontWeight: "600",
    fontSize: 13,
  },

  streakText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },
});
