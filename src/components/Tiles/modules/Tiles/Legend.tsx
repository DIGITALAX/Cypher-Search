import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { LegendProps } from "../../types/tiles.types";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Bar from "../../../Common/modules/Bar";
import CollectItem from "../CollectItem";
import LevelOne from "./LevelOne";

const Legend: FunctionComponent<LegendProps> = ({
  publication,
  imageIndex,
  setImageIndex,
  index,
  collectChoice,
  setCollectChoice,
  cartItems,
  dispatch,
  router,
  showComments,
  showLikes,
  showMirrors,
  milestoneCovers,
  layoutAmount,
  mirror,
  like,
  comment,
  quote,
  interactionsLoading,
}): JSX.Element => {
  return (
    <div className="relative h-fit w-full border border-black flex flex-col items-center justify-center">
      <Bar title={publication?.marketplace?.name!} />
      <div className="relative w-full h-fit flex flex-col gap-8 bg-legend bg-contain">
        <div className="p-5 relative w-full h-fit flex items-center justify-center flex-row gap-5 bg-grant bg-contain">
          <div className="relative w-full h-fit flex break-words font-vcr text-black p-2 justify-start items-center rounded-sm border border-black bg-virg p-2 flex-col gap-4">
            <div className="relative w-full h-40 flex items-center justify-start gap-6">
              <div className="relative w-full overflow-y-scroll h-full ustify-start items-center">
                {publication?.marketplace?.description}
              </div>
              <div className="relative w-24 h-fit border border-black rounded-md flex flex-col gap-2 p-2 items-center justify-center">
                {[
                  "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
                  "QmVFm5onDqzKCV6v9XbGTQirXsWFmRgihsYcXVBbLMxneL",
                  "QmRsAM1oJfiv1Py92uoYk7VMdrnPfWDsgH3Y2tPWVDqxHw",
                ].map((image: string, index: number) => {
                  const functions = [like, comment, mirror];
                  const show = [showLikes, showComments, showMirrors];
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit flex flex-row items-center justify-center gap-3 font-vcr text-black text-center"
                      onClick={() => functions[index](publication?.id)}
                    >
                      <div className="relative w-4 h-3 flex items-center justify-center cursor-pointer active:scale-95">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${image}`}
                          draggable={false}
                        />
                      </div>
                      <div
                        className="relative w-fit h-fit items-center justify-center flex cursor-pointer"
                        onClick={() => show[index](publication?.id)}
                      >
                        2K
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative w-full h-fit flex justify-start items-start flex-col ml-0 gap-2">
              <div className="relative text-black font-gam text-4xl justify-start items-start flex">
                Grant Team
              </div>
              <div className="relative w-full items-center justify-between flex flex-row gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmPe1QiaErMPHPRU3hQK4HsW4KeKjXVG8y8x7aKHNXcRh8`}
                  />
                </div>
                <div className="relative mr-0 w-fit h-fit items-center justify-end flex flex-row gap-2">
                  {Array.from({ length: 3 }).map((_, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-10 h-10 rounded-sm border border-black cursor-pointer"
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-fit h-full items-end justify-center flex">
            <div className="relative w-8 rounded-lg h-72 flex items-end justify-center border-2 border-black bg-zana"></div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col justify-start items-center gap-4 text-black border bg-white/60 p-2 border-black font-dog">
          <div className="relative flex flex-col gap-1.5 items-center justify-start">
            <div className="relative w-fit h-fit text-sm">
              Maintenance Strategy
            </div>
            <div className="relative w-fit h-fit text-sm"></div>
          </div>
          <div className="relative flex flex-col gap-1.5 items-center justify-start">
            <div className="relative w-fit h-fit text-sm">Tech Stack</div>
            <div className="relative w-fit h-fit text-sm"></div>
          </div>
          <div className="relative flex flex-col gap-1.5 items-center justify-start">
            <div className="relative w-fit h-fit text-sm">Team Experience</div>
            <div className="relative w-fit h-fit text-sm"></div>
          </div>
        </div>
        <div
          className="relative w-full h-80 overflow-y-scroll bg-virg border-y border-black flex flex-col gap-4 p-4"
          id="milestone"
        >
          {Array.from({ length: 3 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative bg-cafe border border-marron rounded-sm flex flex-col justify-start items-start p-1.5 font-dog text-amar h-fit gap-4"
              >
                <div className="relative w-fit h-fit flex items-center justify-start text-sm">
                  {`Milestone ${index + 1}`}
                </div>
                <div className="relative w-full h-72 flex items-center justify-between flex-row gap-2">
                  <div className="relative h-full overflow-y-scroll w-full flex items-start justify-start p-1.5"></div>
                  <div className="relative w-60 h-full border border-marron flex items-center justify-center rounded-sm bg-virg">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${milestoneCovers?.[index]}`}
                      layout="fill"
                      className="rounded-sm w-full h-full"
                      objectFit="cover"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="relative flex flex-col items-start justify-start gap-8 border border-white rounded-sm w-full h-fit p-2">
                  <div className="relative w-full h-fit flex items-center justify-between flex-row text-xxs text-white font-dog">
                    <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start">
                      <div>Amount:</div>
                      <div>$5000</div>
                    </div>
                    <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start">
                      <div>Submit By:</div>
                      <div>{new Date().toDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2 p-5 bg-grant bg-contain">
          <div
            className={`relative w-fit px-2 py-1 text-center flex items-center justify-center bg-lima border border-black font-gam uppercase text-fondo h-fit ${
              layoutAmount === 4 ? "text-4xl" : "text-6xl"
            }`}
          >
            collect grant
          </div>
          <div className="relative w-full h-fit bg-virg p-2 rounded-sm border border-black items-center justify-center flex flex-col gap-3">
            <div
              className="relative w-full h-full flex overflow-x-scroll  items-center justify-start"
              id="legend"
            >
              <div className="relative w-fit h-full flex flex-row gap-2 pb-2 items-center justify-center">
                {[
                  ...[
                    { level: 1 },
                    { level: 2 },
                    { level: 3 },
                    { level: 4 },
                    { level: 5 },
                    { level: 6 },
                    { level: 7 },
                  ].slice(imageIndex?.[index]),
                  ...[
                    { level: 1 },
                    { level: 2 },
                    { level: 3 },
                    { level: 4 },
                    { level: 5 },
                    { level: 6 },
                    { level: 7 },
                  ].slice(0, imageIndex?.[index]),
                ].map((_, index: number) => {
                  if (index == 0) {
                    return <LevelOne key={index} />;
                  } else {
                    return (
                      <CollectItem
                        key={index}
                        index={_.level}
                        collectChoice={collectChoice}
                        setCollectChoice={setCollectChoice}
                        dispatch={dispatch}
                        cartItems={cartItems}
                        item={publication}
                        router={router}
                      />
                    );
                  }
                })}
              </div>
            </div>
            <div className="relative w-12 h-7 flex flex-row bg-white border border-black rounded-x-xl items-center justify-between">
              <div className="relative w-fit h-fit flex items-center justify-center p-1">
                <div
                  className="relative w-3 h-3 flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={() => {
                    const newImageIndex = [...imageIndex];
                    newImageIndex[index] =
                      newImageIndex[index] === 0 ? 6 : newImageIndex[index] - 1;
                    setImageIndex(newImageIndex);
                  }}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmcwhhhhfjDag6vJ6F5f9U25oGruB8kMiHzUL4yPQ9txyG`}
                    draggable={false}
                  />
                </div>
              </div>
              <div className="relative bg-black h-full w-px flex"></div>
              <div className="relative w-fit h-fit flex items-center justify-center p-1">
                <div
                  className="relative w-3 h-3 flex items-center justify-center rotate-180 cursor-pointer active:scale-95"
                  onClick={() => {
                    const newImageIndex = [...imageIndex];
                    newImageIndex[index] =
                      newImageIndex[index] === 6 ? 0 : newImageIndex[index] + 1;
                    setImageIndex(newImageIndex);
                  }}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmcwhhhhfjDag6vJ6F5f9U25oGruB8kMiHzUL4yPQ9txyG`}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;
