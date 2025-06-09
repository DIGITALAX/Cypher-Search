import { Suspense } from "react";
import { tParams } from "../layout";
import NotFoundEntry from "@/app/components/Common/modules/NotFoundEntry";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import { getDictionary } from "../dictionaries";

export default async function IndexPage({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <NotFoundEntry dict={dict} />
    </Suspense>
  );
}
