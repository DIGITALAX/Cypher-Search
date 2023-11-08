import { FunctionComponent } from "react";

const Orders: FunctionComponent = ({
  allOrders,
  allOrdersLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full pt-4 flex items-center justify-center">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div className="relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center overflow-y-scroll min-h-[70vh] max-h-[70vh]"></div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
