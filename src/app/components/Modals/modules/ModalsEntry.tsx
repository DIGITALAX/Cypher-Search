"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import FullScreenVideo from "./FullScreenVideo";
import ModalOpen from "./ModalOpen";
import Filters from "./Filters";
import dynamic from "next/dynamic";
import { Indexar as IndexarType } from "../../Search/types/search.types";
import Indexar from "./Indexar";
import ImageLarge from "./ImageLarge";
import ReportPub from "./ReportPub";
import Who from "./Who";
import DisplaySearch from "./DisplaySearch";
import Signless from "./Signless";
import CrearCuenta from "./CrearCuenta";
import PostSuccess from "./PostSuccess";
import SuccessCheckout from "./SuccessCheckout";
import PostBox from "./PostBox";
import Gifs from "./Gifs";
import CollectOptions from "./CollectOptions";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function ModalsEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  return (
    <>
      {context?.fullScreenVideo?.open && <FullScreenVideo />}
      {context?.filtersOpen?.value && <Filters dict={dict} />}
      {context?.map && <Map dict={dict} />}
      {context?.reportPub && <ReportPub dict={dict} />}
      {context?.reactBox && <Who dict={dict} />}
      {context?.imageViewer && <ImageLarge />}
      {context?.displaySearch !== undefined && <DisplaySearch dict={dict} />}
      {context?.postSuccess && <PostSuccess dict={dict} />}
      {context?.signless && <Signless dict={dict} />}
      {context?.crearCuenta && <CrearCuenta dict={dict} />}
      {context?.successCheckout && <SuccessCheckout dict={dict} />}
      {context?.postBox?.open && <PostBox dict={dict} />}
      {context?.gif?.open && <Gifs dict={dict} />}
      {context?.collectOptions?.open && <CollectOptions dict={dict} />}
      {context?.modalOpen && <ModalOpen />}
      {context?.indexar !== IndexarType.Inactive && <Indexar dict={dict} />}
    </>
  );
}
