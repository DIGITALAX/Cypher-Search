import { getDictionary } from "@/app/[lang]/dictionaries";
import AutographEntry from "@/app/components/Autograph/modules/AutographEntry";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import { Metadata } from "next";
import { Suspense } from "react";

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
    openGraph: {
      title: `Autograph | ${autograph}`,
    }
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    autograph: string;
    lang: string;
  }>;
}) {
  const { autograph, lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <AutographEntry autograph={autograph} dict={dict} />
    </Suspense>
  );
}
