import { useState } from "react";
import getProfile from "../../../../graphql/lens/queries/profile";
import { useDispatch, useSelector } from "react-redux";
import { setAutograph } from "../../../../redux/reducers/autographSlice";
import { RootState } from "../../../../redux/store";
import { ScreenDisplay, SortType } from "../types/autograph.types";

const useAutograph = () => {
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
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
        setNotFound(true);
        return;
      }

      dispatch(
        setAutograph({
          actionProfile: data?.profile,
          actionCollected: [],
          actionCreated: [],
          actionOwner:
            lensConnected?.handle?.fullHandle ===
            data?.profile?.handle?.fullHandle,
        })
      );
    } catch (err: any) {
      setNotFound(true);
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  return {
    profileLoading,
    notFound,
    getProfileData,
    setScreenDisplay,
    screenDisplay,
    sortType,
    setSortType,
  };
};

export default useAutograph;
