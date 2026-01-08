import "dotenv/config";

export default {
  expo: {
    name: "Dev Streaks",
    slug: "streak-tracker",
    scheme: "streaktracker",
    userInterfaceStyle: "automatic",

    // App Icon
    icon: "./assets/images/icon.png",

    // Splash Screen
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#020617",
    },

    android: {
      package: "com.cosmocoder.devstreaks",

      // Adaptive Icon
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#020617",
      },
    },

    plugins: ["expo-router"],

    extra: {
      githubToken: process.env.GITHUB_TOKEN,

      eas: {
        projectId: "1fb30904-c2b7-4df7-9ca4-9f5cfe77f60a",
      },
    },
  },
};
