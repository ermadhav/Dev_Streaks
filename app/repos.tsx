import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import React from "react";

import { useUsernames } from "../hooks/useUsernames";
import { useGithubRepos } from "../hooks/useGithubRepos";
import RepoCard from "../components/RepoCard";

type Mode = "starred" | "popular";

export default function Repos() {
  const { github } = useUsernames();
  const { starred, popular, loading } = useGithubRepos(github);

  const [mode, setMode] = useState<Mode>("starred");
  const repos = mode === "starred" ? starred : popular;

  return (
    <LinearGradient
      colors={["#050505", "#0b1220", "#020617"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.title}>GitHub Repositories</Text>
          <Text style={styles.subtitle}>
            What you value & what you’ve built
          </Text>
        </View>

        {/* ===== TOGGLE WITH COUNT ===== */}
        <View style={styles.toggleRow}>
          <Pressable onPress={() => setMode("starred")}>
            <Text
              style={[
                styles.toggleLabel,
                mode === "starred" && styles.toggleActive,
              ]}
            >
              ⭐ Starred ({starred.length})
            </Text>
            {mode === "starred" && (
              <View
                style={[
                  styles.underline,
                  { backgroundColor: "#facc15" },
                ]}
              />
            )}
          </Pressable>

          <Pressable onPress={() => setMode("popular")}>
            <Text
              style={[
                styles.toggleLabel,
                mode === "popular" && styles.toggleActive,
              ]}
            >
              🔥 Popular ({popular.length})
            </Text>
            {mode === "popular" && (
              <View
                style={[
                  styles.underline,
                  { backgroundColor: "#ef4444" },
                ]}
              />
            )}
          </Pressable>
        </View>

        {/* ===== LIST ===== */}
        {loading ? (
          <Text style={styles.stateText}>
            Loading repositories…
          </Text>
        ) : repos.length === 0 ? (
          <Text style={styles.stateText}>
            No repositories to show
          </Text>
        ) : (
          <View style={styles.list}>
            {repos.map((repo) => (
              <RepoCard key={repo.id} {...repo} />
            ))}
          </View>
        )}

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by Cosmo Coder
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  /* HEADER */
  header: {
    marginTop: 25,
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#e5e7eb",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#9ca3af",
  },

  /* TOGGLE */
  toggleRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 26,
  },

  toggleLabel: {
    fontSize: 14.3,
    fontWeight: "600",
    color: "#9ca3af",
  },

  toggleActive: {
    color: "#e5e7eb",
  },

  underline: {
    height: 2,
    marginTop: 6,
    borderRadius: 2,
  },

  /* LIST */
  list: {
    marginTop: 4,
  },

  stateText: {
    marginTop: 40,
    fontSize: 14,
    color: "#6b7280",
  },

  /* FOOTER */
  footer: {
    marginTop: 40,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 14,
  },

  footerText: {
    color: "#9ca3af",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
