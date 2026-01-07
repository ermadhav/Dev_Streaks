import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Heatmap } from "../components/Heatmap";
import StreakCard from "../components/StreakCard";
import { useGithubStreak } from "../hooks/useGithubStreak";
import { useLeetCodeStreak } from "../hooks/useLeetCodeStreak";
import { useUsernames } from "../hooks/useUsernames";
import { moderateScale, verticalScale } from "../utils/responsive";

import { auth } from "../utils/firebase";

/* ===== Toolbar Button ===== */

const ToolbarButton = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.toolbarBtn}>
    <Text style={[styles.toolbarIcon, { color }]}>{icon}</Text>
    <Text style={styles.toolbarLabel}>{label}</Text>
  </Pressable>
);

/* ===== Home ===== */

export default function Home() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isWide = width >= 1024;

  const [githubWidth, setGithubWidth] = useState(0);
  const [leetcodeWidth, setLeetcodeWidth] = useState(0);

  const router = useRouter();

  const { github, leetcode, loaded } = useUsernames();
  const githubData = useGithubStreak(github ?? "");
  const leetcodeData = useLeetCodeStreak(leetcode ?? "");

  if (!loaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#050505", "#0b1220", "#020617"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.content, isTablet && styles.tabletContent]}>
          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <Text style={styles.title}>Dev Streaks</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolbar}
            >
              <ToolbarButton
                icon="🔗"
                label="Share"
                color="#93c5fd"
                onPress={() => router.push("/profile-share")}
              />

              <ToolbarButton
                icon="📊"
                label="Stats"
                color="#facc15"
                onPress={() => router.push("/stats")}
              />

              <ToolbarButton
                icon="⚙️"
                label="Settings"
                color="#22c55e"
                onPress={() => router.push("/settings")}
              />

              <ToolbarButton
                icon="📂"
                label="Repos"
                color="#22c55e"
                onPress={() => router.push("/repos")}
              />
            </ScrollView>
          </View>

          {/* ===== CARDS ===== */}
          <View
            style={[styles.cardsWrapper, isWide && styles.cardsWrapperWide]}
          >
            {/* GitHub */}
            <View style={styles.card}>
              <StreakCard
                title={`GitHub · ${github || "N/A"}`}
                streak={githubData.currentStreak}
                loading={githubData.loading}
              />

              {!githubData.loading && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    🏆 Longest: {githubData.longestStreak} days
                  </Text>
                  <Text style={styles.metaText}>
                    📦 Commits: {githubData.totalCommits}
                  </Text>
                </View>
              )}

              {!githubData.loading && (
                <View
                  style={styles.heatmapWrapper}
                  onLayout={(e) =>
                    setGithubWidth(e.nativeEvent.layout.width)
                  }
                >
                  {githubData.heatmap.length > 0 && githubWidth > 0 && (
                    <Heatmap
                      data={githubData.heatmap}
                      containerWidth={githubWidth}
                    />
                  )}
                </View>
              )}
            </View>

            {/* LeetCode */}
            <View style={styles.card}>
              <StreakCard
                title={`LeetCode · ${leetcode || "N/A"}`}
                streak={leetcodeData.currentStreak}
                loading={leetcodeData.loading}
              />

              {!leetcodeData.loading && (
                <View style={styles.metaColumn}>
                  <Text style={styles.metaText}>
                    🏆 Longest: {leetcodeData.longestStreak} days
                  </Text>

                  <Text style={styles.metaText}>
                    🟢 Easy: {leetcodeData.solved.easy} · 🟡 Medium:{" "}
                    {leetcodeData.solved.medium} · 🔴 Hard:{" "}
                    {leetcodeData.solved.hard}
                  </Text>

                  <Text style={styles.metaText}>
                    🟰 Total Solved: {leetcodeData.solved.total}
                  </Text>
                </View>
              )}

              {!leetcodeData.loading && (
                <View
                  style={styles.heatmapWrapper}
                  onLayout={(e) =>
                    setLeetcodeWidth(e.nativeEvent.layout.width)
                  }
                >
                  {leetcodeData.heatmap.length > 0 &&
                    leetcodeWidth > 0 && (
                      <Heatmap
                        data={leetcodeData.heatmap}
                        containerWidth={leetcodeWidth}
                      />
                    )}
                </View>
              )}
            </View>
          </View>

          {/* ===== FOOTER ===== */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with ❤️ by Cosmo Coder
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },

  loadingText: { color: "#9ca3af", fontSize: 16 },

  content: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(80),
  },

  tabletContent: {
    alignSelf: "center",
    maxWidth: 900,
    width: "100%",
  },

  header: { marginBottom: verticalScale(24) },

  title: {
    fontSize: moderateScale(30),
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: 12,
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },

  toolbarBtn: {
    marginRight: 12,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(14),
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    minWidth: 70,
  },

  toolbarIcon: { fontSize: moderateScale(18) },

  toolbarLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#9ca3af",
  },

  cardsWrapper: { marginBottom: verticalScale(10) },

  cardsWrapperWide: {
    flexDirection: "row",
    gap: 16,
  },

  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: moderateScale(22),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: verticalScale(22),
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  metaColumn: { marginTop: 10 },

  metaText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 6,
  },

  heatmapWrapper: {
    marginTop: verticalScale(14),
    padding: moderateScale(12),
    borderRadius: moderateScale(14),
    backgroundColor: "rgba(0,0,0,0.35)",
    minHeight: 100,
  },

  footer: {
    marginTop: verticalScale(40),
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: verticalScale(14),
  },

  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
