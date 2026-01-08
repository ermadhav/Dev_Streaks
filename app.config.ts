import "dotenv/config";

export default {
  expo: {
    name: "Dev Streaks",
    slug: "streak-tracker",
    scheme: "streaktracker",
    userInterfaceStyle: "automatic",

    icon: "./assets/images/icon.png",

    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#020617",
    },

    android: {
      package: "com.cosmocoder.devstreaks",

      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
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
