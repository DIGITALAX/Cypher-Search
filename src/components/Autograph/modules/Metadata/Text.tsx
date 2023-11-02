import { FunctionComponent } from "react";
import { TextProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { Post, Quote } from "../../../../../graphql/generated";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";

const Text: FunctionComponent<TextProps> = ({ item, quote }): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-center gap-3">
      {
        //   (item?.__typename === "Mirror" || item?.__typename === "Quote") &&
        <div className="flex relative w-full h-fit items-center justify-end">
          {item?.__typename === "Mirror" ? (
            <div className="relative flex flex-row gap-1.5 items-center justify-center text-white font-earl text-sm">
              <div className="relative flex items-center justify-center w-5 h-4">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3`}
                  draggable={false}
                />
              </div>
              <div className="relative flex items-center justify-center w-fit h-fit">
                Mirrored By
              </div>
              <div className="relative flex items-center justify-center w-fit h-fit">
                {item?.by?.handle?.localName}
              </div>
            </div>
          ) : (
            <div className="relative flex flex-row gap-1.5 items-center justify-center text-white font-earl text-sm">
              <div className="relative flex items-center justify-center w-5 h-5">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM`}
                  draggable={false}
                />
              </div>
              <div className="relative flex items-center justify-center w-fit h-fit">
                Quote Remix
              </div>
              {(item as Quote)?.quoteOn?.metadata?.marketplace?.name && (
                <div className="relative flex items-center justify-center w-fit h-fit">
                  On{" "}
                  {(item as Quote)?.quoteOn?.metadata?.marketplace?.name?.slice(
                    0,
                    8
                  ) + "..."}
                </div>
              )}
            </div>
          )}
        </div>
      }
      <div
        className="relative w-full h-full bg-black font-aust text-white text-left item-start justify-start break-words flex overflow-y-scroll p-2 text-sm whitespace-preline"
        id="feed"
        // dangerouslySetInnerHTML={{
        //   __html: descriptionRegex(
        //     item?.__typename === "Mirror"
        //       ? item?.mirrorOn?.metadata?.marketplace?.description
        //       : (item as Post)?.metadata?.marketplace?.description
        //   ),
        // }}
      >
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est
        laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
        distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
        cumque nihil impedit quo minus id quod maxime placeat facere possimus,
        omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
        quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
        ut et voluptates repudiandae sint et molestiae non recusandae. Itaque
        earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
        voluptatibus maiores alias consequatur aut perferendis doloribus
        asperiores repellat.
      </div>
    </div>
  );
};

export default Text;
