import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import React from "react";

type Props = {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
};

export default function RepoCard({
  name,
  description,
  stars,
  language,
  url,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => Linking.openURL(url)}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.stars}>⭐ {stars}</Text>
      </View>

      <Text style={styles.desc} numberOfLines={2}>
        {description}
      </Text>

      <Text style={styles.lang}>{language}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 6,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#e5e7eb",
  },

  stars: {
    fontSize: 13,
    color: "#facc15",
  },

  desc: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 8,
  },

  lang: {
    fontSize: 12,
    color: "#6b7280",
  },
});
