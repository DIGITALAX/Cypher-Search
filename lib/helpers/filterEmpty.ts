import { Filter } from "@/components/Search/types/search.types";

const filterEmpty = (filter: Filter): boolean => {
  return (
    !filter.hashtag &&
    !filter.community &&
    !filter.microbrand &&
    !filter.catalog &&
    !filter.access &&
    !filter.format &&
    !filter.origin &&
    filter.editions === 0 &&
    !filter.available &&
    !filter.fulfiller &&
    !filter.drop &&
    filter.size.apparel.length === 0 &&
    filter.size.poster.length === 0 &&
    filter.size.sticker.length === 0 &&
    filter.color.length === 0 &&
    filter.price.min === 0 &&
    filter.price.max === 0 &&
    !filter.token &&
    filter.printType.length === 0
  );
};

export default filterEmpty;
