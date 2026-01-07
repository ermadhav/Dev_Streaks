import "dotenv/config";

export default {
  expo: {
    name: "Dev Streaks",
    slug: "streak-tracker",
    scheme: "streaktracker",
    userInterfaceStyle: "automatic",

    // ✅ MAIN APP ICON
    icon: "./assets/images/icon.png",

    // ✅ SPLASH (optional but safe)
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#020617",
    },

    android: {
      package: "com.cosmocoder.devstreaks",

      // ✅ ANDROID ADAPTIVE ICON
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
      },
    },

    // ✅ NOTIFICATION ICON

    plugins: ["expo-router"],

    extra: {
      githubToken: process.env.GITHUB_TOKEN,
    },
  },
};
