import { FunctionComponent } from "react";
import { ScreenDisplay, ScreenSwitchProps } from "../types/autograph.types";
import Display from "./Screen/Display";
import Settings from "./Screen/Settings";
import Circuits from "./Screen/Circuits";
import Gallery from "./Screen/Gallery";

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
  owner,
}): JSX.Element => {
  switch (screenDisplay) {
    case ScreenDisplay.Circuits:
      return <Circuits gallery={gallery} />;

    case ScreenDisplay.Gallery:
      return <Gallery gallery={gallery} />;

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
          display={display}
          handleSetDisplay={handleSetDisplay}
          displayLoading={displayLoading}
          owner={owner}
        />
      );
  }
};

export default ScreenSwitch;
