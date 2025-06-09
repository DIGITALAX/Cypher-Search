import { Suspense } from "react";
import Entry from "../components/Common/modules/Entry";
import { getDictionary } from "./dictionaries";
import RouterChange from "../components/Common/modules/RouterChange";
import { tParams } from "../layout";

export default async function IndexPage({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <Entry dict={dict} />
    </Suspense>
  );
}
