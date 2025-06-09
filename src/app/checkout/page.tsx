import { getDictionary } from "../[lang]/dictionaries";
import CheckoutEntry from "../components/Checkout/modules/CheckoutEntry";
import Wrapper from "../components/Common/modules/Wrapper";


export default async function Checkout() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<CheckoutEntry dict={dict} />}></Wrapper>;
}
