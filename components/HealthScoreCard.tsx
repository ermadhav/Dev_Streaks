import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  score: number;
  breakdown: {
    consistency: number;
    trend: number;
    gaps: number;
  };
  explanation: string;
};

export default function HealthScoreCard({
  score,
  breakdown,
  explanation,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Streak Health</Text>

      <Text style={styles.score}>{score}/100</Text>

      <View style={styles.breakdown}>
        <Text style={styles.item}>
          Consistency: {breakdown.consistency}/50
        </Text>
        <Text style={styles.item}>
          Trend: {breakdown.trend}/30
        </Text>
        <Text style={styles.item}>
          Gaps: {breakdown.gaps}/20
        </Text>
      </View>

      <Text style={styles.explanation}>{explanation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 8,
  },

  score: {
    fontSize: 34,
    fontWeight: "800",
    color: "#22c55e",
    marginBottom: 10,
  },

  breakdown: {
    marginBottom: 10,
  },

  item: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 4,
  },

  explanation: {
    fontSize: 13,
    color: "#d1d5db",
    lineHeight: 18,
  },
});
