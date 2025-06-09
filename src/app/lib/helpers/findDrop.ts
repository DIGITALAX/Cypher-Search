import { Drop } from "@/app/components/Autograph/types/autograph.types";
import {
  getPrintDrop,
  getTripleADrop,
} from "../../../../graphql/queries/getDrop";

const findDrop = async (drop: string): Promise<Drop | void | undefined> => {
  const res = await getTripleADrop(drop);

  if (Number(res?.data?.dropCreateds?.length) < 1) {
    const res = await getPrintDrop(drop);

    if (Number(res?.data?.dropCreateds?.length) < 1) {
      return undefined;
    }

    return res?.data?.dropCreateds?.[0];
  }

  return res?.data?.dropCreateds?.[0];
};

export default findDrop;
