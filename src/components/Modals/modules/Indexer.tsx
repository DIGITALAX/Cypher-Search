import { FunctionComponent } from "react";
import { IndexProps } from "../types/modals.types";

const Index: FunctionComponent<IndexProps> = ({ message }): JSX.Element => {
  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit z-30">
      <div className="w-fit h-16 flex items-center justify-center bg-gradient-to-r from-white to-offBlack rounded-lg border border-black">
        <div className="relative w-fit h-fit flex items-center justify-center px-4 py-2 text-black font-earl">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Index;
