import { FunctionComponent, JSX, KeyboardEvent, useContext } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, LANGS } from "@/app/lib/constants";
import { SearchBarProps } from "../types/common.types";
import { usePathname, useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import useSearch from "../hooks/useSearch";

const SearchBar: FunctionComponent<SearchBarProps> = ({
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const path = usePathname();
  const { handleSearch, handleShuffleSearch, placeholder } = useSearch();

  return (
    <div
      className={`w-full z-40 h-fit flex py-0 px-1 sm:py-3 sm:px-3 ${
        context?.searchActive ||
        context?.filtersOpen?.value ||
        path?.includes("item") ||
        path?.includes("drop")
          ? "searchTransition relative items-start justify-start pre:items-center pre:justify-center"
          : "absolute top-[35vh] sm:right-auto right-0 items-center justify-center"
      }`}
    >
      <div className="relative h-fit tablet:h-10 w-full lg:w-3/5 flex flex-col tablet:flex-row gap-3 tablet:gap-2 items-center justify-center">
        <div className="relative flex w-fit h-fit">
          <div
            className="relative tablet:w-9 w-6 h-5 tablet:h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
            onClick={() => handleShuffleSearch()}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmP6jdmuQXERDQ7dtUWjkQaAmeKZtSRmW6gCFT9SmVLgbg`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-full flex items-center justify-center flex-col galaxy:flex-row gap-3">
          <div
            className="relative flex items-center justify-center w-full h-full p-px rounded-sm"
            id="borderSearch"
          >
            <input
              className="bg-black text-offWhite p-1.5 rounded-sm w-full h-full font-bit flex items-center justify-start relative text-sm"
              id="searchBar"
              key={placeholder}
              placeholder={
                context?.searchItems?.input?.trim() !== "" &&
                context?.searchItems?.input
                  ? context?.searchItems?.input
                  : placeholder
              }
              onKeyDown={(e) =>
                (e as KeyboardEvent).key === "Enter" &&
                context?.searchItems?.input?.trim() !== "" &&
                handleSearch(e)
              }
              onChange={(e) =>
                context?.setSearchItems((prev) => ({
                  ...prev,
                  input: e.target.value,
                }))
              }
              value={context?.searchItems?.input}
            />
          </div>
          <div
            className={`relative tablet:absolute tablet:right-2 flex items-center justify-center rounded-sm font-bit text-brill uppercase text-center p-px active:scale-95 h-7 hover:opacity-70 cursor-pointer ${
              path?.includes("/es/") ? "w-fit" : "w-12"
            }`}
            id="borderSearch"
            onClick={(e) => handleSearch(e, true)}
          >
            <div
              className={`relative w-full h-full flex items-center justify-center text-center bg-black rounded-sm  ${
                path?.includes("/es/") ? "text-sm px-1" : "text-lg"
              } `}
            >
              {dict?.go}
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
          <div className="relative flex w-fit h-fit">
            <div
              className="relative tablet:w-9 w-6 h-5 tablet:h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
              onClick={() => {
                if (
                  LANGS.some((lang) => lang == path) &&
                  context?.filtersOpen?.value &&
                  context?.filterChange
                )
                  router.push("/");

                context?.setFiltersOpen((prev) => ({
                  allow: !prev.allow,
                  value: !prev.value,
                }));

                context?.setFilterChange(false);
              }}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmdAeKBRKxgPrnpQzFbXtvnRZ8pUU3DkFMQnBKosYFJhX1`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
          <div className="relative flex w-fit h-fit">
            <div
              className="relative tablet:w-9 w-6 h-5 tablet:h-7 flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
              onClick={() =>
                context?.setLayoutSwitch(
                  context?.layoutSwitch <
                    (typeof window !== "undefined" && window.innerWidth < 648
                      ? 1
                      : typeof window !== "undefined" &&
                        window.innerWidth < 1000
                      ? 2
                      : typeof window !== "undefined" &&
                        window.innerWidth < 1200
                      ? 3
                      : 4)
                    ? context?.layoutSwitch + 1
                    : typeof window !== "undefined" && window.innerWidth < 1200
                    ? 1
                    : 2
                )
              }
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmeVN7HiJ6K2gfVx3QfXQoCcpS8ijHr7tJpyonZNV9HLBt`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
