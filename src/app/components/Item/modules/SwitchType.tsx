"use client";

import { FunctionComponent } from "react";
import { SwitchTypeProps } from "../types/items.type";
import {
  AutographCollection,
  Catalogo as CatalogoTipo,
  Collection,
  Quest,
} from "../../Common/types/common.types";
import Chromadin from "./Chromadin";
import Pub from "./Pub";
import { Account, Post } from "@lens-protocol/client";
import Microbrand from "./Microbrand";
import Autografo from "./Autografo";
import Catalogo from "./Catalogo";
import Kinora from "./Kinora";
import TripleA from "./TripleA";
import { NFTData } from "../../Tiles/types/tiles.types";

const SwitchType: FunctionComponent<SwitchTypeProps> = ({
  type,
  itemData,
  dict,
  relatedData,
}) => {
  switch (type.toLowerCase()) {
    case "chromadin":
    case "coinop":
    case "listener":
    case "f3m":
      return (
        <Chromadin
          dict={dict}
          itemData={{
            ...itemData,
            post: itemData?.post as Collection,
          }}
          type={type}
        />
      );

    case "triplea":
      return (
        <TripleA
          dict={dict}
          itemData={{
            ...itemData,
            post: itemData?.post as NFTData,
          }}
        />
      );

    case "kinora":
      return (
        <Kinora
          itemData={{
            ...itemData,
            post: itemData?.post as Quest,
          }}
          dict={dict}
        />
      );

    case "catalog":
      switch ((itemData?.post as CatalogoTipo | AutographCollection)?.tipo) {
        case "Catalog":
          return (
            <Catalogo
              dict={dict}
              itemData={{
                ...itemData,
                post: itemData?.post as CatalogoTipo,
              }}
            />
          );
        default:
          return (
            <Autografo
              dict={dict}
              itemData={{
                ...itemData,
                post: itemData?.post as AutographCollection,
              }}
            />
          );
      }

    case "pub":
      return (
        <Pub
          dict={dict}
          itemData={{
            ...itemData,
            post: itemData?.post as Post,
          }}
        />
      );

    case "microbrand":
      return (
        <Microbrand
          relatedData={relatedData}
          dict={dict}
          itemData={{
            ...itemData,
            post: itemData?.post as Account,
          }}
        />
      );
  }
};

export default SwitchType;
