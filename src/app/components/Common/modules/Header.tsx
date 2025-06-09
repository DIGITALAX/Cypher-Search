import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { HeaderProps } from "../types/common.types";
import Accounts from "./Accounts";
import SearchBar from "./SearchBar";

const Header: FunctionComponent<HeaderProps> = ({
  dict,
  includeSearch,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return !context?.header &&
    typeof window !== "undefined" &&
    window.innerWidth < 400 ? (
    <div
      className={`fixed w-full h-fit flex p-2 top-0 z-50 bg-offBlack justify-center items-center`}
    >
      <div
        className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95"
        onClick={() => context?.setHeader(true)}
      >
        <SlArrowDown color="white" size={15} />
      </div>
    </div>
  ) : (
    <div
      className={`fixed w-full h-fit flex p-2 top-0 z-30 flex-col lg:flex-row bg-offBlack ${
        context?.searchActive || context?.filtersOpen?.value
          ? "justify-start items-start lg:justify-between gap-6 galaxy:gap-8"
          : "items-center justify-center lg:justify-between lg:gap-auto gap-3"
      } `}
    >
      <div
        className={`relative h-fit flex items-center justify-center pre:w-fit w-full flex-row gap-2`}
      >
        <div
          className={`relative cursor-pointer active:scale-95 w-10 h-10 flex items-center justify-center`}
          onClick={(e) => {
            e.stopPropagation();
            router.push("/");
            context?.setSearchActive(false);

            context?.setFiltersOpen({
              value: false,
              allow: false,
            });

            context?.setSearchItems({
              items: [],
              hasMore: true,
              input: "",
              searchLoading: false,
              moreSearchLoading: false,
              moreSearch: false,
            });
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
            layout="fill"
            draggable={false}
          />
        </div>
        {context?.header &&
          typeof window !== "undefined" &&
          window.innerWidth < 400 && (
            <div
              className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => context?.setHeader(false)}
            >
              <SlArrowUp color="white" size={15} />
            </div>
          )}
      </div>
      {includeSearch && <SearchBar dict={dict} />}
      <Accounts dict={dict} />
    </div>
  );
};

export default Header;
