import { FunctionComponent } from "react";
import { ScreenDisplay, ScreenSwitchProps } from "../types/autograph.types";
import Display from "./Screen/Display";
import Settings from "./Screen/Settings";
import Circuits from "./Screen/Circuits";

const ScreenSwitch: FunctionComponent<ScreenSwitchProps> = ({
  screenDisplay,
  mirror,
  like,
  comment,
  quote,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
  sortType,
  gallery,
  display,
  settingsData,
  setSettingsData,
  handleSettingsUpdate,
  settingsUpdateLoading,
  coverImage,
  dispatch,
  pfpImage,
  handleImage,
  handleSetDisplay,
  displayLoading,
}): JSX.Element => {
  switch (screenDisplay) {
    case ScreenDisplay.Circuits:
      return <Circuits gallery={gallery} />;

    case ScreenDisplay.Gallery:
      return <></>;

    case ScreenDisplay.Settings:
      return (
        <Settings
          settingsData={settingsData}
          setSettingsData={setSettingsData}
          handleSettingsUpdate={handleSettingsUpdate}
          settingsUpdateLoading={settingsUpdateLoading}
          handleImage={handleImage}
          pfpImage={pfpImage}
          coverImage={coverImage}
        />
      );

    default:
      return (
        <Display
          dispatch={dispatch}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          interactionsLoading={interactionsLoading}
          sortType={sortType}
          gallery={gallery}
          display={display}
          handleSetDisplay={handleSetDisplay}
          displayLoading={displayLoading}
        />
      );
  }
};

export default ScreenSwitch;
