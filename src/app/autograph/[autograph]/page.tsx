import { getDictionary } from "@/app/[lang]/dictionaries";
import AutographEntry from "@/app/components/Autograph/modules/AutographEntry";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    autograph: string;
  }>;
}): Promise<Metadata> => {
  const { autograph } = await params;

  return {
    title: `Autograph | ${autograph}`,
    openGraph: { title: `Autograph | ${autograph}` },
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    autograph: string;
  }>;
}) {
  const { autograph } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={<AutographEntry dict={dict} autograph={autograph} />}
    ></Wrapper>
  );
}
