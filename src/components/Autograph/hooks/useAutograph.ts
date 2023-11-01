import { useState } from "react";
import getProfile from "../../../../graphql/lens/queries/profile";
import { ScreenDisplay, SortType } from "../types/autograph.types";
import { Profile } from "../../../../graphql/generated";
import { setAutographProfile } from "../../../../redux/reducers/autographProfileSlice";
import { useDispatch } from "react-redux";

const useAutograph = () => {
  const dispatch = useDispatch();
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [screenDisplay, setScreenDisplay] = useState<ScreenDisplay>(
    ScreenDisplay.Display
  );
  const [sortType, setSortType] = useState<SortType>(SortType.Public);

  const getProfileData = async (autograph: string) => {
    setProfileLoading(true);

    try {
      const { data } = await getProfile({
        forHandle: "test/" + autograph,
      });

      if (!data?.profile) {
        setProfileLoading(false);
        return;
      }
      dispatch(setAutographProfile(data?.profile as Profile));
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  return {
    profileLoading,
    getProfileData,
    setScreenDisplay,
    screenDisplay,
    sortType,
    setSortType,
  };
};

export default useAutograph;
