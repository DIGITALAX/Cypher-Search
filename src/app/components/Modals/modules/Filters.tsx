import { FunctionComponent, JSX } from "react";
import PrerollSort from "../../Search/modules/PrerollSort";
import ContentSort from "../../Search/modules/ContentSort";
import TileSwitch from "../../Tiles/modules/TileSwitch";
import useFilterPost from "../../Search/hooks/useFilterPost";

const Filters: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { publication } = useFilterPost();
  return (
    <div
      className="fixed z-20 top-56 lg:top-20 left-0 right-0 bottom-0 overflow-y-auto h-auto bg-offBlack items-start"
      id="milestone"
    >
      <div className="relative flex flex-col lg:flex-row gap-10 mx-auto w-full p-4 h-fit lg:items-start items-center justify-start lg:justify-center">
        <div className="relative w-full h-fit flex lg:items-start items-center justify-start lg:justify-center lg:order-1 order-3">
          {publication?.post && (
            <TileSwitch
              dict={dict}
              type={publication?.type}
              publication={publication}
              index={0}
            />
          )}
        </div>
        <ContentSort dict={dict} />
        <PrerollSort dict={dict} />
      </div>
    </div>
  );
};

export default Filters;
