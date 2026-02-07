import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export function useUsernames() {
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setGithub("");
        setLeetcode("");
        setLoaded(true);
        return;
      }

      const ref = doc(db, "users", user.uid);

      const unsubProfile = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setGithub(typeof data.github === "string" ? data.github.trim() : "");
          setLeetcode(typeof data.leetcode === "string" ? data.leetcode.trim() : "");
        } else {
          setGithub("");
          setLeetcode("");
        }
        setLoaded(true);
      });

      return unsubProfile;
    });

    return unsubAuth;
  }, []);

  const save = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        github: github.trim(),
        leetcode: leetcode.trim(),
      },
      { merge: true }
    );
  };

  return {
    github,
    leetcode,
    setGithub,
    setLeetcode,
    save,
    loaded,
  };
}
