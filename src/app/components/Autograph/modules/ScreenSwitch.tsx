import { FunctionComponent, JSX, useContext } from "react";
import { ScreenDisplay, ScreenSwitchProps } from "../types/autograph.types";
import Display from "./Display";
import { ModalContext } from "@/app/providers";
import Circuits from "./Circuits";
import Bookmarks from "./Bookmarks";
import ScreenPost from "./ScreenPost";
import Settings from "./Settings";
import GalleryScreen from "./GalleryScreen";
import Orders from "./Orders";
import Sales from "./Sales";

const ScreenSwitch: FunctionComponent<ScreenSwitchProps> = ({
  dict,
  profile,
}): JSX.Element => {
  const context = useContext(ModalContext);
  if (!context?.lensConectado?.profile?.address === profile?.address) {
    return (
      <Display
        dict={dict}
        owner={context?.lensConectado?.profile?.address === profile?.address}
      />
    );
  } else {
    switch (context?.screenDisplay) {
      case ScreenDisplay.Circuits:
        return <Circuits dict={dict} />;

      case ScreenDisplay.Gallery:
        return <GalleryScreen dict={dict} profile={profile} />;

      case ScreenDisplay.Post:
        return <ScreenPost dict={dict} />;

      case ScreenDisplay.Bookmarks:
        return <Bookmarks dict={dict} />;

      case ScreenDisplay.Settings:
        return <Settings dict={dict} />;

      case ScreenDisplay.Orders:
        return <Orders dict={dict} profile={profile} />;

      case ScreenDisplay.Sales:
        return <Sales dict={dict} profile={profile} />;

      default:
        return (
          <Display
            owner={
              context?.lensConectado?.profile?.address === profile?.address
            }
            dict={dict}
          />
        );
    }
  }
};

export default ScreenSwitch;
