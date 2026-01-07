```md
# 🔥 Dev Streaks Tracker

Track your **GitHub commits** and **LeetCode problem-solving streaks** in one beautiful mobile app.  
Built with **Expo + React Native**, designed for **developers who care about consistency**.

> _“Consistency beats intensity.”_

---

## ✨ Features

### 🧩 GitHub
- ✅ Current commit streak
- 🏆 Longest commit streak
- 📦 Total commits
- 📊 Contribution heatmap (last 90 days)
- 🔔 Smart streak reminder notifications

### 🧠 LeetCode
- ✅ Current solving streak
- 🏆 Longest solving streak
- 🟢 Easy / 🟡 Medium / 🔴 Hard solved count
- 🟰 Total problems solved
- 📊 Submission heatmap (last 90 days)
- ⏰ IST-based reminders (5:30 AM reset)

### 📈 Stats Dashboard
- Weekly & monthly activity summaries
- Active days vs total days
- Streak health score (0–100)
- Last active day
- Platform comparison (GitHub vs LeetCode)

### 🔗 Profile Sharing
- Auto-generated QR codes for:
  - GitHub profile
  - LeetCode profile
- One-tap profile links
- Share your coding journey instantly

### 🔔 Smart Notifications
- ⏳ 5 hours before day ends
- ⚠️ 1 hour before day ends
- Auto-cancels if streak is already saved
- Android-optimized notification channels

---

## 📱 Screenshots


```

---

## 🛠 Tech Stack

- **React Native**
- **Expo (Dev Client)**
- **TypeScript**
- **expo-router**
- **expo-notifications**
- **GitHub GraphQL API**
- **LeetCode GraphQL API**
- **react-native-svg**
- **Linear Gradients & Custom UI**

---

## 🧠 Architecture

```txt
app/
 ├── index.tsx            # Home screen
 ├── stats.tsx            # Stats dashboard
 ├── profile-share.tsx    # QR & sharing screen
 ├── repos.tsx            # Starred / popular repos
 ├── settings.tsx

hooks/
 ├── useGithubStreak.ts
 ├── useLeetCodeStreak.ts
 ├── useUsernames.ts

components/
 ├── Heatmap.tsx
 ├── StreakCard.tsx
 ├── StatCard.tsx

utils/
 ├── notifications.ts
 ├── scheduleNotifications.ts
 ├── stats.ts
 ├── healthScore.ts
````

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/ermadhav/L-G-tracker
cd L-G-tracker
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment variables

Create a `.env` file:

```env
EXPO_PUBLIC_GITHUB_TOKEN=your_github_token
EXPO_PUBLIC_LEETCODE_USERNAME=your_leetcode_username
```

### 4️⃣ Run on real device (required for notifications)

```bash
npx expo run:android
```

> ⚠️ Notifications **do not work in Expo Go**
> Use **Expo Dev Client** or a real device.

---

## 🔔 Notification Logic

| Platform | Timezone | Reminder Times         |
| -------- | -------- | ---------------------- |
| GitHub   | Local    | 5h & 1h before day end |
| LeetCode | IST      | 5h & 1h before 5:30 AM |

✔ Auto-cancelled if streak already completed
✔ Prevents duplicate notifications on reload

---

## 🌟 Why This App Stands Out

* Not just streaks → **behavior-driven insights**
* Time-zone-aware reminders
* GitHub + LeetCode in **one unified UX**
* Built with **scalable architecture**
* Resume-worthy real-world project

---

## 🧑‍💻 Author

**Cosmo Coder**
Engineering Student & Mobile App Developer

> Built with ❤️ to stay consistent every single day.

---

## 📄 License

MIT License — feel free to fork, improve, and build on it.

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🐛 Report issues
* 💡 Suggest features
