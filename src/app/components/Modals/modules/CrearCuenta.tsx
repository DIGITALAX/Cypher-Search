import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { AiOutlineLoading } from "react-icons/ai";
import useCrearCuenta from "../hooks/useCrearCuenta";

const CrearCuenta: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { account, setAccount, accountLoading, handleCreateAccount } =
    useCrearCuenta(dict);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[50vw] tablet:w-[30vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                context?.setSignless(false);
              }}
            />
          </div>
          <div
            className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4 font-bit text-sol"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words text-sm">
              {dict?.createLens}
            </div>
            <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center">
              <div className="relative items-center justify-center flex w-fit h-fit">
                <label
                  className="relative w-20 rounded-full h-20 flex items-center justify-center border border-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {account?.pfp && (
                    <Image
                      alt="pfp"
                      src={URL.createObjectURL(account.pfp)}
                      objectFit="cover"
                      layout="fill"
                      draggable={false}
                      className="rounded-full"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    hidden
                    required
                    id="files"
                    multiple={false}
                    name="pfp"
                    disabled={accountLoading}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!e.target.files || e.target.files.length === 0)
                        return;
                      setAccount({
                        ...account,
                        pfp: e?.target?.files?.[0],
                      });
                    }}
                  />
                </label>
              </div>
              <div className="relative w-full h-fit flex items-start justify-between flex-row gap-3">
                <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                  <div className="relative w-fit h-fit flex">
                    {dict?.username}
                  </div>
                  <input
                    disabled={accountLoading}
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        username: e.target.value,
                      })
                    }
                    className="relative w-full h-8 border border-white focus:outline-none p-1"
                    value={account?.username}
                  />
                </div>
                <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                  <div className="relative w-fit h-fit flex">
                    {dict?.localname}
                  </div>
                  <input
                    disabled={accountLoading}
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        localname: e.target.value,
                      })
                    }
                    className="relative w-full h-8 border border-white focus:outline-none p-1"
                    value={account?.localname}
                  />
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
                <div className="relative w-fit h-fit flex">Bio</div>
                <textarea
                  disabled={accountLoading}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      bio: e.target.value,
                    })
                  }
                  className="relative w-full h-14 overflow-y-scroll border border-white focus:outline-none p-1"
                  value={account?.bio}
                  style={{
                    resize: "none",
                  }}
                ></textarea>
              </div>
            </div>
            <div className="relative w-fit h-fit flex">
              <div
                className={`relative px-3 py-1 flex items-center justify-center rounded-md border border-white w-28 h-8 ${
                  !accountLoading &&
                  "cursor-pointer active:scale-95 hover:opacity-70"
                }`}
                onClick={() => !accountLoading && handleCreateAccount()}
              >
                {accountLoading ? (
                  <AiOutlineLoading
                    className="animate-spin"
                    color="white"
                    size={15}
                  />
                ) : (
                  dict?.create
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearCuenta;
