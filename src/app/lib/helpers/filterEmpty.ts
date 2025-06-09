import { Filter } from "@/app/components/Common/types/common.types";

const filterEmpty = (filter: Filter): boolean => {
  return (
    filter?.hashtag == "" &&
    filter?.microbrand == "" &&
    filter?.catalog == "" &&
    filter?.access == "" &&
    filter?.format == "" &&
    filter?.origin == "" &&
    filter?.fulfiller == "" &&
    filter?.drop == "" &&
    filter?.available &&
    filter?.editions === 1 &&
    filter?.price?.min === 0 &&
    filter?.price?.max === 500 &&
    filter?.size?.apparel?.length === 0 &&
    filter?.size?.poster?.length === 0 &&
    filter?.size?.sticker?.length === 0 &&
    filter?.color?.length === 0 &&
    filter?.token == "" &&
    filter?.printType?.length === 0
  );
};

export default filterEmpty;
