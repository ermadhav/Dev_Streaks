import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { moderateScale, verticalScale } from "../utils/responsive";

import { useUsernames } from "../hooks/useUsernames";
import React from "react";

export default function ProfileShare() {
  const { github, leetcode } = useUsernames();

  const githubUrl = `https://github.com/${github}`;
  const leetcodeUrl = `https://leetcode.com/${leetcode}`;

  const githubRef = useRef<ViewShot>(null);
  const leetcodeRef = useRef<ViewShot>(null);

  async function shareQR(ref: any, name: string) {
    try {
      const uri = await ref.current.capture();
      await Sharing.shareAsync(uri, {
        dialogTitle: `Share ${name} Profile`,
      });
    } catch (e) {
      console.log("Share error", e);
    }
  }

  return (
    <LinearGradient
      colors={["#050505", "#0b1220", "#020617"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Share Profile</Text>
          <Text style={styles.subtitle}>
            Scan or share your coding profiles
          </Text>
        </View>

        {/* GITHUB */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.platform}>GitHub</Text>
            <Text style={[styles.username, { color: "#facc15" }]}>
              @{github}
            </Text>
          </View>

          <ViewShot ref={githubRef} options={{ format: "png", quality: 1 }}>
            <View style={styles.qrContainer}>
              <QRCode
                value={githubUrl}
                size={150}
                backgroundColor="transparent"
                color="#facc15"
              />
            </View>
          </ViewShot>

          <Pressable
            onPress={() => Linking.openURL(githubUrl)}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>{githubUrl}</Text>
          </Pressable>

          <Pressable
            onPress={() => shareQR(githubRef, "GitHub")}
            style={[styles.shareBtn, { borderColor: "#facc15" }]}
          >
            <Text style={[styles.shareText, { color: "#facc15" }]}>
              Share GitHub QR
            </Text>
          </Pressable>
        </View>

        {/* LEETCODE */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.platform}>LeetCode</Text>
            <Text style={[styles.username, { color: "#f59e0b" }]}>
              @{leetcode}
            </Text>
          </View>

          <ViewShot ref={leetcodeRef} options={{ format: "png", quality: 1 }}>
            <View style={styles.qrContainer}>
              <QRCode
                value={leetcodeUrl}
                size={150}
                backgroundColor="transparent"
                color="#f59e0b"
              />
            </View>
          </ViewShot>

          <Pressable
            onPress={() => Linking.openURL(leetcodeUrl)}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>{leetcodeUrl}</Text>
          </Pressable>

          <Pressable
            onPress={() => shareQR(leetcodeRef, "LeetCode")}
            style={[styles.shareBtn, { borderColor: "#f59e0b" }]}
          >
            <Text style={[styles.shareText, { color: "#f59e0b" }]}>
              Share LeetCode QR
            </Text>
          </Pressable>
        </View>

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
  container: { flex: 1 },

  content: {
    padding: 20,
    paddingBottom: 80,
  },

  header: {
    marginTop: 18,
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  cardHeader: {
    marginBottom: 16,
  },

  platform: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e7eb",
  },

  username: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },

  qrContainer: {
    alignSelf: "center",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    marginBottom: 16,
  },

  linkBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },

  linkText: {
    fontSize: 13,
    color: "#93c5fd",
    textAlign: "center",
  },

  shareBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  shareText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
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
