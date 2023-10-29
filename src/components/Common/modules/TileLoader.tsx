import { FunctionComponent } from "react";
import { TileLoaderProps } from "../types/common.types";
import { Masonry } from "masonic";

const TileLoader: FunctionComponent<TileLoaderProps> = ({
  layoutAmount,
}): JSX.Element => {
  const renderTile = ({
    index,
    data,
  }: {
    index: number;
    data: {
      id: string;
    };
  }) => {
    return (
      <div
        key={index}
        className="relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4"
      >
        <div className="relative flex flex-col h-fit w-full border border-white">
          <div
            className={`relative w-full flex`}
            style={{
              height: `${
                index % 2 == 0 ? "10rem" : index % 3 == 0 ? "20rem" : "40rem"
              }`,
            }}
            id="staticLoad"
          ></div>
        </div>
      </div>
    );
  };
  return (
    <div className="relative w-full h-full items-start justify-center">
      <Masonry
        key={0}
        items={Array.from({ length: 15 }, (_, index) => ({
          id: String(index),
        }))}
        render={renderTile}
        columnGutter={50}
        maxColumnCount={layoutAmount}
      />
    </div>
  );
};

export default TileLoader;
