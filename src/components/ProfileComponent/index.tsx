import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import "./styles.scss";

export const ProfilePage = () => {
  const { state } = useContext<any>(GlobalContext);
  console.log(state.user);

  return (
    <main className="profile-container">
      <h1>Hi from profile page</h1>
    </main>
  );
};
