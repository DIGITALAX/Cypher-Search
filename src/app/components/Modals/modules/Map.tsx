import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";

const Map: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-[40vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => context?.setMap(false)}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center text-center break-words font-bit text-sol text-lg">
            {dict?.map}
          </div>
          <MapContainer
            center={[40.7477249, -73.9903851]}
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
            <Marker
              icon={
                new Icon({
                  iconUrl: `${INFURA_GATEWAY_INTERNAL}QmUFprxSMc6pQTbXkV5eZtwC4v2ksTzRkGZ19Yk9i244gY`,
                  iconSize: [25, 41],
                  iconAnchor: [12.5, 41],
                  popupAnchor: [0, -41],
                })
              }
              position={[40.7477249, -73.9903851]}
              eventHandlers={{
                click: () => {
                  if (context?.filters?.fulfiller != "the manufactory") {
                    context?.setFilterChange(true);
                  }

                  context?.setFilters((prev) => ({
                    ...prev,
                    fulfiller: "the manufactory",
                  }));
                },
              }}
            >
              <Popup className="bg-offBlack border border-white text-white">
                {dict?.manu}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;
