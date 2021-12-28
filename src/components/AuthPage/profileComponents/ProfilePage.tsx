import { useCallback, useState, useMemo } from "react";
import "./../styles.scss";
import { motion } from "framer-motion";

export const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState(`https://avatars.dicebear.com/api/bottts/${Date.now()}.svg`);

  const getAvatarUrl = useCallback(() => {
    const randomSeed = Date.now();
    console.log("rerendered");
    return `https://avatars.dicebear.com/api/bottts/${randomSeed}.svg`;
  }, []);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.4 }}>
      <main className="profile-container">
        <section className="profile-container__title">
          <h1>Thank you for signing up to ReactChat</h1>
          <p>Please take a moment to fill out your profile details</p>
        </section>
        <section className="profile-container__body">
          <img src={avatarUrl} alt="Profile avatar" />
        </section>
        <button onClick={() => setAvatarUrl(getAvatarUrl())}>Change url</button>
      </main>
    </motion.div>
  );
};
