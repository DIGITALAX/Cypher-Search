import { FunctionComponent, useContext, useEffect } from "react";
import Header from "./Header";
import { SuggestedProps } from "../types/common.types";
import Tiles from "../../Tiles/modules/Tiles";
import RouterChange from "./RouterChange";
import NotFoundEntry from "./NotFoundEntry";
import { ModalContext } from "@/app/providers";
import useSuggested from "../hooks/useSuggested";

const Suggested: FunctionComponent<SuggestedProps> = ({
  dict,
  component,
  includeSearch,
  loader,
  notFound,
  data,
}) => {
  const context = useContext(ModalContext);
  const { getSuggestedItems } = useSuggested(data);

  useEffect(() => {
    if (
      !loader &&
      !notFound &&
      Number(context?.searchItems?.items?.length) < 1 &&
      data &&
      (context?.clienteLens || context?.lensConectado?.sessionClient)
    ) {
      getSuggestedItems();
    }
  }, [
    loader,
    notFound,
    data,
    context?.clienteLens,
    context?.lensConectado?.sessionClient,
  ]);

  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center gap-10 flex-col h-full`}
      id="results"
    >
      <Header dict={dict} includeSearch={includeSearch} />
      {loader && notFound ? (
        <RouterChange />
      ) : !loader && notFound ? (
        <NotFoundEntry dict={dict} />
      ) : (
        component
      )}
      <Tiles dict={dict} />
    </div>
  );
};

export default Suggested;
