import { View, Text, StyleSheet } from "react-native";
import React from "react";

type Props = {
  label: string;
  value: string;
  accent?: string;
};

export default function StatCard({
  label,
  value,
  accent = "#22c55e",
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accent }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
  },
});
