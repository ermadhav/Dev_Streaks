import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { moderateScale, verticalScale } from "../utils/responsive";

import { useUsernames } from "../hooks/useUsernames";
import { useGithubStreak } from "../hooks/useGithubStreak";
import { useLeetCodeStreak } from "../hooks/useLeetCodeStreak";

import StatCard from "../components/StatCard";
import HealthScoreCard from "../components/HealthScoreCard";

import {
  getWeeklySummary,
  getMonthlySummary,
  getComparison,
  getLastActiveDay,
} from "../utils/stats";

import { calculateHealthScore } from "../utils/healthScore";
import React from "react";

type Platform = "github" | "leetcode";

export default function Stats() {
  const { github, leetcode } = useUsernames();
  const githubData = useGithubStreak(github);
  const leetcodeData = useLeetCodeStreak(leetcode);

  const [platform, setPlatform] = useState<Platform>("github");

  if (githubData.loading || leetcodeData.loading) return null;

  const isGithub = platform === "github";
  const data = isGithub ? githubData.heatmap : leetcodeData.heatmap;
  const accent = isGithub ? "#facc15" : "#f59e0b";

  const week = getWeeklySummary(data);
  const month = getMonthlySummary(data);
  const compare = getComparison(data.slice(-7), data.slice(-14, -7));
  const health = calculateHealthScore(data);

  return (
    <LinearGradient
      colors={["#050505", "#0b1220", "#020617"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Consistency over competition</Text>
        </View>

        {/* ===== PLATFORM TOGGLE ===== */}
        <View style={styles.toggleRow}>
          <Pressable onPress={() => setPlatform("github")}>
            <Text style={[styles.toggleLabel, isGithub && styles.toggleActive]}>
              GitHub · {github}
            </Text>
            {isGithub && (
              <View
                style={[styles.underline, { backgroundColor: "#facc15" }]}
              />
            )}
          </Pressable>

          <Pressable onPress={() => setPlatform("leetcode")}>
            <Text
              style={[styles.toggleLabel, !isGithub && styles.toggleActive]}
            >
              LeetCode · {leetcode}
            </Text>
            {!isGithub && (
              <View
                style={[styles.underline, { backgroundColor: "#f59e0b" }]}
              />
            )}
          </Pressable>
        </View>

        {/* ===== STREAKS ===== */}
        <Text style={styles.section}>Streaks</Text>
        <View style={styles.row}>
          <StatCard
            label="Current Streak"
            value={`${
              isGithub ? githubData.currentStreak : leetcodeData.currentStreak
            } days`}
            accent={accent}
          />
          <StatCard
            label={
              isGithub ? "Longest Commit Streak" : "Longest Solving Streak"
            }
            value={`${
              isGithub ? githubData.longestStreak : leetcodeData.longestStreak
            } days`}
            accent={accent}
          />
        </View>

        {/* ===== TOTALS ===== */}
        <Text style={styles.section}>Totals</Text>

        {isGithub ? (
          <View style={styles.row}>
            <StatCard
              label="Total Commits"
              value={`${githubData.totalCommits}`}
              accent="#22c55e"
            />
          </View>
        ) : (
          <>
            <View style={styles.row}>
              <StatCard
                label="Easy Solved"
                value={leetcodeData.solved.easy}
                accent="#22c55e"
              />
              <StatCard
                label="Medium Solved"
                value={leetcodeData.solved.medium}
                accent="#facc15"
              />
            </View>
            <View style={styles.row}>
              <StatCard
                label="Hard Solved"
                value={leetcodeData.solved.hard}
                accent="#ef4444"
              />
              <StatCard
                label="Total Solved"
                value={leetcodeData.solved.total}
                accent="#22c55e"
              />
            </View>
          </>
        )}

        {/* ===== WEEKLY ===== */}
        <Text style={styles.section}>This Week</Text>
        <View style={styles.row}>
          <StatCard
            label="Active Days"
            value={`${week.activeDays}/7`}
            accent={accent}
          />
          <StatCard
            label="Total Activity"
            value={`${week.total}`}
            accent={accent}
          />
        </View>

        {/* ===== MONTHLY ===== */}
        <Text style={styles.section}>This Month</Text>
        <View style={styles.row}>
          <StatCard
            label="Active Days"
            value={`${month.activeDays}/30`}
            accent={accent}
          />
          <StatCard
            label="Total Activity"
            value={`${month.total}`}
            accent={accent}
          />
        </View>

        {/* ===== CONSISTENCY ===== */}
        <Text style={styles.section}>Consistency</Text>
        <View style={styles.row}>
          <StatCard
            label="Week-over-week"
            value={`${compare}%`}
            accent={compare >= 0 ? "#22c55e" : "#ef4444"}
          />
          <StatCard
            label="Last Active"
            value={getLastActiveDay(data)}
            accent={accent}
          />
        </View>

        {/* ===== HEALTH SCORE ===== */}
        <Text style={styles.section}>Streak Health</Text>
        <HealthScoreCard
          score={health.score}
          breakdown={health.breakdown}
          explanation={health.explanation}
        />

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
    padding: 20,
  },

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

  toggleRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 28,
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

  section: {
    marginBottom: 10,
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  row: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
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
    letterSpacing: 0.3,
  },
});
