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

/* ===== Stat Chip ===== */

const StatChip = ({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <View style={[styles.statChip, highlight && styles.statChipHighlight]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
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
            {/* ================= GITHUB ================= */}
            <View style={styles.card}>
              <StreakCard
                title={`GitHub · ${github || "N/A"}`}
                streak={githubData.currentStreak}
                loading={githubData.loading}
              />

              {!githubData.loading && (
                <View style={styles.statsRow}>
                  <StatChip
                    icon="🏆"
                    label="Longest"
                    value={`${githubData.longestStreak}d`}
                  />
                  <StatChip
                    icon="📦"
                    label="Commits"
                    value={githubData.totalCommits}
                  />
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

            {/* ================= LEETCODE ================= */}
            <View style={styles.card}>
              <StreakCard
                title={`LeetCode · ${leetcode || "N/A"}`}
                streak={leetcodeData.currentStreak}
                loading={leetcodeData.loading}
              />

              {!leetcodeData.loading && (
                <>
                  {/* Row 1 */}
                  <View style={styles.statsRow}>
                    <StatChip
                      icon="🟢"
                      label="Easy"
                      value={leetcodeData.solved.easy}
                    />
                    <StatChip
                      icon="🟡"
                      label="Medium"
                      value={leetcodeData.solved.medium}
                    />
                  </View>

                  {/* Row 2 */}
                  <View style={styles.statsRow}>
                    <StatChip
                      icon="🔴"
                      label="Hard"
                      value={leetcodeData.solved.hard}
                    />
                    <StatChip
                      icon="📊"
                      label="Total"
                      value={leetcodeData.solved.total}
                      highlight
                    />
                  </View>
                </>
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
    paddingHorizontal: moderateScale(22),
    paddingTop: verticalScale(46),
    paddingBottom: verticalScale(60),
  },

  tabletContent: {
    alignSelf: "center",
    maxWidth: 920,
    width: "100%",
  },

  header: { marginBottom: verticalScale(18) },

  title: {
    fontSize: moderateScale(30),
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: 8,
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 6,
  },

  toolbarBtn: {
    marginRight: 10,
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    minWidth: 64,
  },

  toolbarIcon: { fontSize: moderateScale(16) },

  toolbarLabel: {
    marginTop: 2,
    fontSize: 10,
    color: "#9ca3af",
  },

  cardsWrapper: { marginBottom: verticalScale(6) },

  cardsWrapperWide: {
    flexDirection: "row",
    gap: 14,
  },

  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderRadius: moderateScale(22),
    padding: moderateScale(14),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: verticalScale(14),
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
    marginBottom: 6,
  },

  statChip: {
    flexGrow: 1,
    minWidth: 110,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  statChipHighlight: {
    backgroundColor: "rgba(250,204,21,0.18)", // soft yellow
    borderColor: "rgba(250,204,21,0.5)",
  },

  statIcon: {
    fontSize: 15,
    marginBottom: 2,
  },

  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e5e7eb",
  },

  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },

  heatmapWrapper: {
    marginTop: verticalScale(10),
    padding: moderateScale(10),
    borderRadius: moderateScale(14),
    backgroundColor: "rgba(0,0,0,0.32)",
    minHeight: 78,
  },

  footer: {
    marginTop: verticalScale(22),
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: verticalScale(12),
  },

  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
