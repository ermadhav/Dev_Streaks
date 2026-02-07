import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUsernames } from "../hooks/useUsernames";
import { verticalScale } from "../utils/responsive";

import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

/* ================= APP VERSION  ================= */
const APP_VERSION = "2.6.0"; 

export default function Settings() {
  const { github, leetcode, setGithub, setLeetcode, save, loaded } =
    useUsernames();

  const user = auth.currentUser;

  if (!loaded) return null;

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await signOut(auth);
            router.replace("/auth/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient
      colors={["#050505", "#0b1220", "#020617"]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== HEADER ===== */}
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage your account and preferences
        </Text>

        {/* ================= ACCOUNT INFO ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {user?.email || "Not available"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.uid || "Unknown"}
            </Text>
          </View>
        </View>

        {/* ================= PROFILE SETTINGS ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profiles</Text>

          {/* GitHub */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>GitHub Username</Text>
            <TextInput
              value={github}
              onChangeText={setGithub}
              placeholder="e.g. ermadhav"
              placeholderTextColor="#6b7280"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          {/* LeetCode */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>LeetCode Username</Text>
            <TextInput
              value={leetcode}
              onChangeText={setLeetcode}
              placeholder="e.g. cosmocoders"
              placeholderTextColor="#6b7280"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <Pressable
            style={styles.button}
            onPress={async () => {
              await save();
              router.back();
            }}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </View>

        {/* ================= APP INFO ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>Expo · React Native</Text>
          </View>
        </View>

        {/* ================= LOGOUT ================= */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

        {/* ================= FOOTER ================= */}
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
    paddingHorizontal: 22,
    paddingTop: 70,
  },

  scrollContent: {
    paddingBottom: verticalScale(60), // prevents footer cut-off
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: 6,
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: 30,
  },

  section: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  infoLabel: {
    color: "#9ca3af",
    fontSize: 12,
  },

  infoValue: {
    color: "#e5e7eb",
    fontSize: 12,
    maxWidth: "60%",
    textAlign: "right",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#052e16",
    fontSize: 15,
    fontWeight: "800",
  },

  logoutSection: {
    marginTop: 10,
    marginBottom: 30,
  },

  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.6)",
  },

  logoutText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
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