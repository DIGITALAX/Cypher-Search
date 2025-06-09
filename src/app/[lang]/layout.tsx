import Modals from "../components/Modals/modules/Modals";
import Footer from "../components/Common/modules/Footer";
import Cart from "../components/Common/modules/Cart";

export type tParams = Promise<{ lang: string }>;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <>
      {children}
      <Modals params={params} />
      <Cart params={params} />
      <Footer params={params} />
    </>
  );
}
