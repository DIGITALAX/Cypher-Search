import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useRouter } from "next/navigation";
import Creation from "../../Autograph/modules/Creation";
import { MicrobrandProps } from "../types/items.type";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const Microbrand: FunctionComponent<MicrobrandProps> = ({
  relatedData,
  dict,
  itemData,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  return (
    <div
      className={`relative w-full min-h-[50rem] flex items-center justify-start flex-col pre:pt-60 tablet:pt-48 px-12 gap-7 h-fit ${
        context?.header ? "pt-96" : "pt-0"
      }`}
    >
      <div className="relative w-full h-fit flex flex-col gap-6 items-center justify-center">
        <div className="relative w-full h-[10rem] flex items-center justify-center">
          {relatedData?.microbrand?.[0]?.microbrandCover && (
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/${
                relatedData?.microbrand?.[0]?.microbrandCover?.split(
                  "ipfs://"
                )?.[1]
              }`}
              draggable={false}
              objectFit="contain"
              onError={(e) => handleImageError(e)}
            />
          )}
        </div>
        <div className="relative w-fit h-fit flex flex-col items-center justify-center">
          <div className="relative w-fit h-fit text-3xl text-white font-aust flex items-center justify-center">
            {relatedData?.microbrand?.[0]?.microbrand}
          </div>
          <div
            className="relative w-fit h-fit gap-2 flex items-center justify-center flex-row text-sm cursor-pointer"
            onClick={() => {
              context?.setFiltersOpen({ value: false, allow: false });
              router.push(`/autograph/${itemData?.post?.username?.localName}`);
            }}
          >
            <div className="relative w-fit h-fit flex items-center">
              <div
                className="relative w-5 h-5 font-aust flex items-center rounded-full justify-center"
                id="pfp"
              >
                <Image
                  layout="fill"
                  src={handleProfilePicture(itemData?.post?.metadata?.picture)}
                  key={itemData?.post?.metadata?.picture}
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            </div>
            <div className="relative w-fit h-fit text-white font-aust flex items-center justify-center">
              {itemData?.post?.username?.localName}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex gap-2 items-start justify-center w-full h-[40rem] overflow-y-scroll">
          <div className="relative flex items-start justify-center flex-wrap gap-4">
            {relatedData?.collections?.map((item, index: number) => {
              return (
                <Creation dict={dict} key={index} item={item} created={true} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Microbrand;
