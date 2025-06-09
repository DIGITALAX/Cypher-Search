import { getDictionary } from "../[lang]/dictionaries";
import NotFoundEntry from "../components/Common/modules/NotFoundEntry";
import Wrapper from "../components/Common/modules/Wrapper";

export default async function NotFound() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<NotFoundEntry dict={dict} />}></Wrapper>;
}
