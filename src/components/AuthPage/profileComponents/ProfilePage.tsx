import { useCallback, useState, useMemo, useContext, useEffect, useRef } from "react";
import "./../../../styles/components/AuthComponent/styles.scss";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import confetti from "./../../../assets/confetti.json";

//components
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { NormalButton } from "../../../styles/styled-components/Button";
import ScaleLoader from "react-spinners/ClipLoader";
import { GoBackBtn } from "./../../../styles/styled-components/GoBackBtn";

//utils
import { updateCurrentlyLoggedInUserProfile, findUserByEmailOrPhoneNumber } from "./../../../utils/firebaseUserHelpers";
import { checkPhoneNumberValid } from "../../../utils/regexHelpers";
import { handleEmptyInputFields, handleSuccessfulProfileUpdate } from "../../../utils/toastHelpers";
import { IDefaultProfileInfo } from "./../../../models/IDefaultProfileInfo";
import { GlobalContext, IContext } from "../../../context/GlobalContext";

const defaultProfileInfo: IDefaultProfileInfo = {
  photoURL: `https://avatars.dicebear.com/api/bottts/${Date.now()}.svg`,
  displayName: "",
  phoneNumber: "",
};

export const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState<IDefaultProfileInfo>(defaultProfileInfo);
  const [isLoading, setIsLoading] = useState(false);
  const { photoURL: avatarUrl, displayName, phoneNumber } = profileInfo;

  const navigateTo = useNavigate();
  const location = useLocation();

  const lottieContainerRef = useRef<HTMLDivElement | null>(null);

  const { state } = useContext<IContext>(GlobalContext);

  const isUserComingFromChatComponent: boolean = useMemo(() => {
    return location.pathname.includes("chat");
  }, [location.pathname]);

  useEffect(() => {
    if (state.user) {
      //Due to restrictions in firebase, storing and updating phone numbers is a lot more complicated than normal data
      //therefore I'm chosing to get the data (including the phone number) from the cloudstore database instead of firebase auth service
      const getUserInfo = async () => {
        const { foundUser } = await findUserByEmailOrPhoneNumber("email", state.user?.email!);
        if (!foundUser) return;
        setProfileInfo({
          photoURL: foundUser.photoURL || `https://avatars.dicebear.com/api/bottts/${Date.now()}.svg`,
          displayName: foundUser.displayName || "",
          phoneNumber: foundUser.phoneNumber || "",
        });
      };
      getUserInfo();
    }
  }, [state?.user]);

  const isDisplayNameError = useMemo(() => {
    return displayName !== "" && displayName.length < 4;
  }, [displayName]);

  const isPhoneNumberError = useMemo(() => {
    return !!phoneNumber && !checkPhoneNumberValid(phoneNumber);
  }, [phoneNumber]);

  const getAvatarUrl = useCallback(() => {
    const randomSeed = Date.now();
    return `https://avatars.dicebear.com/api/bottts/${randomSeed}.svg`;
  }, []);

  //Handlers -------------------------
  const handleChange = useCallback(e => {
    setProfileInfo(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isDisplayNameError || isPhoneNumberError || displayName === "" || phoneNumber === "") {
      return handleEmptyInputFields();
    }
    setIsLoading(true);
    await updateCurrentlyLoggedInUserProfile(profileInfo);
    !isUserComingFromChatComponent && handleSuccessfulProfileUpdate();
    setTimeout(() => {
      isUserComingFromChatComponent ? navigateTo(location.pathname.replace("/profile", "")) : navigateTo("/chat");
    }, 2000);
  }, [profileInfo]);

  return (
    <motion.div
      ref={lottieContainerRef}
      initial={!isUserComingFromChatComponent ? { x: 300, opacity: 0 } : { translateX: -300, opacity: 0 }}
      animate={!isUserComingFromChatComponent ? { x: 0, opacity: 1 } : { translateX: 0, opacity: 1 }}
      exit={!isUserComingFromChatComponent ? { x: -300, opacity: 0 } : { translateX: 300, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.4 }}>
      <main className={`profile-container ${isUserComingFromChatComponent && "from-chat"}`}>
        {isUserComingFromChatComponent && <GoBackBtn to={location.pathname.replace("/profile", "")} />}
        <section className="profile-container__title">
          {!isUserComingFromChatComponent ? (
            <>
              {!isUserComingFromChatComponent && (
                <Lottie
                  container={lottieContainerRef?.current!}
                  animationData={confetti}
                  loop
                  className="lottie-confetti"
                />
              )}
              <h1>Thank you for signing up to ReactChat</h1>
              <p>Please take a moment to fill out your profile details</p>
            </>
          ) : (
            <h1 style={{ fontSize: "1.15rem" }}>Please fill out the following information and click submit</h1>
          )}
        </section>
        <section className="profile-container__body">
          <div className="image-container">
            <img src={avatarUrl} alt="Profile avatar" />
            <div
              className="image-overlay"
              onClick={_ => setProfileInfo(prevState => ({ ...prevState, photoURL: getAvatarUrl() }))}>
              Change me
            </div>
          </div>
          <FormControl id="profileInfoForm">
            <TextField
              label="Display Name"
              id="displayName"
              size="small"
              className="authForm--input-field"
              name="displayName"
              value={displayName}
              onChange={handleChange}
              autoComplete="off"
              sx={!isUserComingFromChatComponent ? { minWidth: "85%" } : { width: "85%" }}
              error={isDisplayNameError}
              helperText={"Your name should at least be 4 characters long"}
            />
            <TextField
              label="Phone Number"
              id="phoneNumber"
              size="small"
              className="authForm--input-field"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              autoComplete="off"
              sx={!isUserComingFromChatComponent ? { minWidth: "85%" } : { width: "85%" }}
              error={isPhoneNumberError}
              helperText={"Enter a valid telephone number"}
            />
          </FormControl>
          <div className="button-container">
            <NormalButton width="70%" bgColor="#6246ea" hoverShadowColor="251deg 68% 36%" onClick={handleSubmit}>
              {isLoading ? <ScaleLoader color="white" /> : "Submit and continue"}
            </NormalButton>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
