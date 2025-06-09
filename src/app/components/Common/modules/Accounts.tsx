import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  PiArrowFatLinesLeftFill,
  PiArrowFatLinesRightFill,
} from "react-icons/pi";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY, LANGS } from "@/app/lib/constants";
import { AccountsProps } from "../types/common.types";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import useLens from "../hooks/useLens";
import CartList from "./CartList";

const Accounts: FunctionComponent<AccountsProps> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { isConnected, chainId, address } = useAccount();
  const {
    handleConectarse,
    lensCargando,
    salir,
    cartListOpen,
    setCartListOpen,
    openAccount,
    setOpenAccount,
    changeLanguage,
  } = useLens(isConnected, address, dict);
  const { openOnboarding, openSwitchNetworks, openProfile } = useModal();
  const router = useRouter();
  const path = usePathname();
  return (
    <>
      <div
        className={`w-full pre:w-fit h-fit pre:h-10 flex flex-col pre:flex-row gap-4 items-center justify-center ${
          (context?.searchActive || context?.filtersOpen?.value) &&
          typeof window !== "undefined" &&
          window.innerWidth < 1024
            ? "relative pre:absolute pre:top-2 pre:right-2 lg:top-auto lg:right-auto lg:relative"
            : "relative"
        }`}
      >
        <div className="relative w-fit h-fit flex items-center justify-center text-sol flex-col text-center font-vcr uppercase">
          <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
            <div
              className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
              onClick={() => changeLanguage()}
            >
              <PiArrowFatLinesLeftFill size={15} />
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="relative w-8 h-10 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    path.includes("/es/")
                      ? "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem"
                      : "QmXdyvCYjZ7FkPjgFX5BPi98WTpPdJT5FHhzhtbyzkJuNs"
                  }`}
                  draggable={false}
                />
              </div>
            </div>
            <div
              className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
              onClick={() => changeLanguage()}
            >
              <PiArrowFatLinesRightFill size={15} />
            </div>
          </div>
        </div>

        {!context?.lensConectado?.profile && (
          <div
            className={`w-24 h-8 relative flex items-center justify-center p-px rounded-sm text-center cursor-pointer active:scale-95 hover:opacity-70`}
            id="borderSearch"
            onClick={() =>
              !isConnected
                ? openOnboarding()
                : chainId !== 232
                ? openSwitchNetworks()
                : isConnected && !context?.lensConectado?.profile
                ? handleConectarse()
                : openProfile()
            }
          >
            <div
              className={`relative w-full h-full rounded-sm font-vcr flex items-center justify-center text-sm bg-offBlack text-sol`}
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  lensCargando && "animate-spin"
                }`}
              >
                {lensCargando ? (
                  <AiOutlineLoading size={15} color={"white"} />
                ) : !isConnected ? (
                  dict?.con
                ) : (
                  isConnected && !context?.lensConectado?.profile && dict?.len
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          id={context?.cartAnim ? "cartAnim" : ""}
          title={dict?.car}
          onClick={() => {
            setOpenAccount(false);
            setCartListOpen(!cartListOpen);
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
        {Number(context?.cartItems?.length) > 0 && (
          <div
            className={`absolute rounded-full border border-mar bg-black w-5 flex items-center justify-center pre:top-auto top-32 pre:-bottom-1 h-5 p-1 font-vcr text-mar text-xxs z-1 pre:left-auto ${
              context?.lensConectado?.profile
                ? "pre:right-[8.5rem]"
                : "pre:right-[5.5rem]"
            }`}
          >
            {context?.cartItems?.length}
          </div>
        )}

        <div
          className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          onClick={() =>
            context?.setFullScreenVideo((prev) => ({
              ...prev,
              open: prev?.open ? false : true,
            }))
          }
          title={dict?.rad}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmUkpLp5Jf9NB9eT6dCupJa9fGvA2NkuzTKkqA1uaNFqXL`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div
          className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          onClick={() =>
            !isConnected
              ? openOnboarding()
              : chainId !== 232
              ? openSwitchNetworks()
              : isConnected && !context?.lensConectado?.profile
              ? handleConectarse()
              : context?.setPostBox({ open: true })
          }
          title={dict?.posT}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmeNsRR8iiJBZgyeMsnESEKbZPDMB8RFKXxBYC3xYfPovK`}
            layout="fill"
            draggable={false}
          />
        </div>
        {context?.lensConectado && (
          <div
            className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer rounded-full"
            id="pfp"
            onClick={() => {
              context?.lensConectado?.profile && setOpenAccount(!openAccount);
              setCartListOpen(false);
            }}
          >
            <Image
              src={handleProfilePicture(
                context?.lensConectado?.profile?.metadata?.picture
              )}
              key={context?.lensConectado?.profile?.metadata?.picture}
              className="rounded-full"
              layout="fill"
              draggable={false}
              objectFit="cover"
            />
          </div>
        )}
      </div>
      {openAccount && !context?.filtersOpen?.value && (
        <div
          className={`absolute w-32 h-fit right-3 top-14 tablet:top-16 flex items-center justify-center text-sol flex-col font-bit rounded-sm bg-black text-xs z-30 border border-sol ${
            path?.includes("/checkout") ||
            (!context?.searchActive && LANGS.some((lang) => path === lang))
              ? "pre:top-14"
              : "pre:top-24"
          }`}
        >
          <div
            className="relative w-full h-full flex items-center justify-center border-sol cursor-pointer hover:opacity-80 border-b"
            onClick={() => {
              setOpenAccount(false);
              context?.setFiltersOpen({ value: false, allow: false });
              router.push(
                `/autograph/${context?.lensConectado?.profile?.username?.localName}`
              );
            }}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              {dict?.aut}
            </div>
          </div>
          <div
            className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-80"
            onClick={() => salir()}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              {dict?.log}
            </div>
          </div>
        </div>
      )}
      {cartListOpen && !context?.filtersOpen?.value && (
        <CartList dict={dict} setCartListOpen={setCartListOpen} />
      )}
    </>
  );
};

export default Accounts;
