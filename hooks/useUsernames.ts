import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export function useUsernames() {
  const [github, setGithub] = useState<string>("");
  const [leetcode, setLeetcode] = useState<string>("");

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
          setGithub(data.github || "");
          setLeetcode(data.leetcode || "");
        }
        setLoaded(true);
      });

      return unsubProfile;
    });

    return unsubAuth;
  }, []);

  // Save changes to Firestore
  const save = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      github,
      leetcode,
    });
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
