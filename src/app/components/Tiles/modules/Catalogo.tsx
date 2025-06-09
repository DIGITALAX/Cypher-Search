import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { CatalogoProps } from "../types/tiles.types";

const Catalogo: FunctionComponent<CatalogoProps> = ({
  publication,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit sm:h-80 border border-cost rounded-sm p-2 flex flex-col gap-4">
      <div className="relative w-full h-fit flex items-center justify-center ">
        <div
          className="relative w-4 h-4 flex items-end justify-end cursor-pointer"
          onClick={() => {
            context?.setFiltersOpen({ value: false, allow: false });
            router.push(`/item/catalog/autograph-quarterly`);
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
            draggable={false}
            layout="fill"
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-fit break-all text-center font-bit text-white text-base">
        {dict?.auto}
      </div>
      <div className="relative w-full h-full overflow-y-scroll flex items-center justify-center gap-2 flex-row flex-wrap">
        {publication?.paginas?.map((p, indice) => {
          return (
            <div
              key={indice}
              className="relative w-14 h-10 flex items-center justify-center cursor-pointer hover:opacity-70"
              onClick={() =>
                context?.setImageViewer({
                  type: "png",
                  image: `${INFURA_GATEWAY}/ipfs/${p?.split("ipfs://")[1]}`,
                })
              }
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${p?.split("ipfs://")[1]}`}
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      <div className="relative text-xs text-white/80 flex items-center justify-center w-full text-center h-fit font-bit">
        {dict?.cata}
      </div>
    </div>
  );
};

export default Catalogo;
