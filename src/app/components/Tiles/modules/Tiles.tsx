import {
  FunctionComponent,
  JSX,
  memo,
  useCallback,
  useContext,
  useMemo,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Masonry } from "masonic";
import { debounce } from "lodash";
import stringify from "json-stable-stringify";
import { ModalContext } from "@/app/providers";
import { GeneralPub, TilesProps } from "../types/tiles.types";
import TileSwitch from "./TileSwitch";

const TileSwitchMemo = memo(TileSwitch);

const useDeepMemoize = (value: Object[]) => {
  const hash = useMemo(() => stringify(value), [value]);
  return hash;
};

const Tiles: FunctionComponent<TilesProps> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const searchItemsMemo = useDeepMemoize(context?.searchItems?.items || []);
  const debouncedHandleMoreSearch = useCallback(
    debounce(() => {
      if (
        context?.searchItems?.hasMore &&
        !context?.searchItems?.searchLoading &&
        !context?.searchItems?.moreSearchLoading
      ) {
        context?.setSearchItems((prev) => ({
          ...prev,
          moreSearch: true,
        }));
      }
    }, 300),
    [
      context?.searchItems?.items,
      context?.searchItems?.searchLoading,
      context?.searchItems?.moreSearchLoading,
      context?.searchItems?.moreSearch,
    ]
  );

  const renderTile = useCallback(
    ({ index, data }: { index: number; data: GeneralPub }) => {
      return (
        <TileSwitchMemo
          type={data?.type}
          dict={dict}
          publication={data}
          index={index}
        />
      );
    },
    [context?.layoutSwitch, searchItemsMemo]
  );

  return (
    <div
      className={`relative z-1 w-full min-h-screen h-fit overflow-y-scroll pb-6 px-4 ${
        context?.searchActive || context?.filtersOpen?.value
          ? "pt-[30rem] galaxy:pt-[28rem] pre:pt-56 tablet:pt-44"
          : "pt-24"
      }`}
      id="tileSearch"
    >
      <InfiniteScroll
        dataLength={
          context?.searchItems?.searchLoading
            ? 20
            : (context?.searchItems?.items || [])?.length +
              (context?.searchItems?.moreSearchLoading ? 20 : 0)
        }
        loader={<></>}
        scrollThreshold={1}
        hasMore={context?.searchItems?.hasMore!}
        next={debouncedHandleMoreSearch}
        className={`w-full h-screen items-start justify-center ${
          context?.searchActive && "fadeTiles"
        }`}
      >
        <Masonry
          overscanBy={5}
          key={
            context?.searchItems?.searchLoading
              ? 20
              : (context?.searchItems?.items || [])?.length +
                (context?.searchItems?.moreSearchLoading ? 20 : 0)
          }
          items={
            context?.searchItems?.moreSearchLoading
              ? [
                  ...(context?.searchItems?.items || []),
                  ...Array.from({ length: 20 }, (_) => ({
                    id: Math.random(),
                    type: "loader",
                  })),
                ]
              : context?.searchItems?.searchLoading
              ? Array.from({ length: 20 }, (_) => ({
                  id: Math.random(),
                  type: "loader",
                }))
              : context?.searchItems?.items || []
          }
          render={renderTile}
          columnGutter={50}
          maxColumnCount={context?.layoutSwitch}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Tiles;
