import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { ChromadinProps } from "../../types/tiles.types";
import PopUp from "@/components/Common/modules/PopUp";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import { ItemType } from "@/components/Layout/types/footer.types";

const Chromadin: FunctionComponent<ChromadinProps> = ({
  layoutAmount,
  apparel,
  setApparel,
  index,
  dispatch,
  router,
  setPopUpOpen,
  popUpOpen,
  cartItems,
  publication,
  mirror,
  like,
  comment,
  quote,
  interactionsLoading,
  setOpenMirrorChoice,
  openMirrorChoice,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4">
      <InteractBar
        mirror={mirror}
        like={like}
        comment={comment}
        quote={quote}
        interactionsLoading={interactionsLoading}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        index={index}
        publication={publication}
      />
      <div className="relative flex flex-col items-center justify-start w-full h-fit gap-5">
        <div className="relative flex flex-row w-full justifty-between items-start h-fit gap-4">
          <div
            className="w-full h-72 rounded-sm bg-amo/30 border border-white cursor-pointer"
            onClick={() =>
              dispatch(
                setImageViewer({
                  actionValue: true,
                  actionType:
                    publication?.metadata?.marketplace?.image?.raw?.mimeType,
                  actionImage:
                    publication?.metadata?.marketplace?.image?.raw?.uri,
                })
              )
            }
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/`}
              className="rounded-sm"
              draggable={false}
            />
          </div>
          <div className="relative flex flex-col gap-2 justify-start items-center w-fit h-full mt-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  apparel?.[index]
                    ? "QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj"
                    : "QmbjKczJYHKu6FkZMoBRBg2ZuszkJ5CA74x8YF2rYzmA7b"
                }`}
                draggable={false}
              />
            </div>
            <div
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => {
                const newArray = [...apparel];
                apparel[index] = !newArray[index];
                setApparel(newArray);
              }}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-row justify-between gap-2 w-full h-fit items-center">
          <div className="relative gap-1 flex flex-col items-start justify-center">
            <div className="relative flex w-fit h-fit break-words text-nuba font-bit text-lg uppercase">
              soul food for thought
            </div>
            <div className="relative w-fit h-fit flex text-mos text-sm font-bit uppercase">
              @hiro.lens
            </div>
          </div>
          <div
            className="relative w-10 h-10 flex items-end justify-center mb-0 cursor-pointer active:scale-95"
            onClick={() => {
              const openPopUps = [...popUpOpen];
              openPopUps[index] = !openPopUps[index];
              setPopUpOpen(openPopUps);
            }}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
              draggable={false}
            />
          </div>
          {popUpOpen?.[index] && (
            <PopUp
              cartItems={cartItems}
              id={publication?.id}
              type={ItemType.Chromadin}
              dispatch={dispatch}
              router={router}
              index={index}
              level={undefined}
              right={"-5px"}
              bottom={"60px"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chromadin;
