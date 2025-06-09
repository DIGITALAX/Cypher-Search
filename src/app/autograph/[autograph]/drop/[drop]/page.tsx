import { getDictionary } from "@/app/[lang]/dictionaries";
import DropEntry from "@/app/components/Autograph/modules/DropEntry";
import { Drop as DropType } from "@/app/components/Autograph/types/autograph.types";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import findDrop from "@/app/lib/helpers/findDrop";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    autograph: string;
    drop: string;
  }>;
}): Promise<Metadata> => {
  const { autograph, drop } = await params;
  let res: DropType | undefined | void = undefined;

  if (drop && autograph) {
    res = await findDrop(drop);
  }

  return {
    title: `Drop | ${res?.metadata?.title}`,
    openGraph: {
      title: `Drop | ${res?.metadata?.title}`,
      images: `${INFURA_GATEWAY}/ipfs/${
        res?.metadata?.cover?.split("ipfs://")?.[1]
      }`,
    },
  };
};

export default async function Drop({
  params,
}: {
  params: Promise<{
    autograph: string;
    drop: string;
  }>;
}) {
  const { autograph, drop } = await params;
  let res: DropType | undefined | void = undefined;

  if (drop && autograph) {
    res = await findDrop(decodeURIComponent(drop?.replaceAll("_", " ")));
  }

  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper dict={dict} page={<DropEntry dict={dict} drop={res} />}></Wrapper>
  );
}
