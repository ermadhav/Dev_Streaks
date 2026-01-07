import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        github,
        leetcode,
        createdAt: Date.now(),
      });

      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#050505", "#0b1220", "#020617"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account 🚀</Text>
        <Text style={styles.subtitle}>
          Start tracking your streaks
        </Text>

        {error.length > 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TextInput
          placeholder="GitHub Username"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={github}
          onChangeText={setGithub}
          style={styles.input}
        />

        <TextInput
          placeholder="LeetCode Username"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={leetcode}
          onChangeText={setLeetcode}
          style={styles.input}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>
            Already have an account? Login
          </Text>
        </Pressable>

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by Cosmo Coder
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 26,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: 6,
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: 18,
  },

  errorBox: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.4)",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },

  errorText: {
    color: "#f87171",
    fontSize: 13,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#22c55e",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },

  buttonText: {
    color: "#052e16",
    fontSize: 16,
    fontWeight: "800",
  },

  link: {
    marginTop: 24,
    textAlign: "center",
    color: "#93c5fd",
    fontSize: 13,
  },

  footer: {
    marginTop: 28,
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
