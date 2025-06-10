import { Account, PublicClient } from "@lens-protocol/client";
import { INFURA_GATEWAY, numberToAutograph } from "../constants";
import {
  AutographCollection,
  AutographType,
  Catalogo,
  LensConnected,
} from "@/app/components/Common/types/common.types";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { getCatalogo } from "../../../../graphql/queries/getCatalogo";
import {
  getArticulo,
  getUnArticulo,
} from "../../../../graphql/queries/getArticulo";

export const manejearCatalogos = async (
  lensConectado: LensConnected | undefined,
  clienteLens: PublicClient,
  first: number,
  skip: number,
  solo?: string
): Promise<(AutographCollection | Catalogo)[] | undefined> => {
  try {
    let articulos: (AutographCollection | Catalogo)[] | undefined;
    let prof: Account | undefined;
    if (!solo || solo?.includes("autograph-quarterly")) {
      const datos = await getCatalogo();
      const res = await fetchAccountsAvailable(
        lensConectado?.sessionClient ?? clienteLens,
        {
          managedBy: datos?.data?.autographCreateds[0].designer,
          includeOwned: true,
        }
      );
      if (res?.isOk()) {
        prof = res?.value?.items?.[0]?.account as Account;
      }

      articulos = [
        {
          paginas: datos?.data?.autographCreateds[0].pages,
          tokenes: datos?.data?.autographCreateds[0].acceptedTokens,
          uri: datos?.data?.autographCreateds[0].uri,
          disenador: datos?.data?.autographCreateds[0].designer,
          precio: datos?.data?.autographCreateds[0].price,
          postId: datos?.data?.autographCreateds[0].postId,
          cantidad: datos?.data?.autographCreateds[0].amount,
          minteado: datos?.data?.autographCreateds[0].mintedTokens,
          paginasContadas: datos?.data?.autographCreateds[0].pageCount,
          profile: prof,
          tipo: AutographType.Catalog,
        },
      ];

      if (solo?.includes("autograph-quarterly")) {
        return articulos;
      }
    }

    let profs: Account[] = [];

    if (solo) {
      const todos = await getUnArticulo(solo?.replaceAll(/_/g, " "));

      const res = await fetchAccountsAvailable(
        lensConectado?.sessionClient ?? clienteLens,
        {
          managedBy: todos?.data?.collections?.[0]?.designer,
          includeOwned: true,
        }
      );

      if (res?.isOk()) {
        prof = res?.value?.items?.[0]?.account as Account;
      }

      const col = todos?.data?.collections?.[0];

      articulos = [
        {
          id: col.collectionId,
          cantidad: col.amount,
          tokenes: col.acceptedTokens,
          tokenesMinteados: col.mintedTokenIds,
          precio: Number(col.price),
          tipo: numberToAutograph[Number(col.type)],
          titulo: col.metadata?.title,
          descripcion: col.metadata?.description,
          etiquetas: col.metadata?.tags,
          imagenes: col.metadata?.images,
          npcs: col.metadata?.npcs,
          postIds: col.postIds,
          coleccionId: col.collectionId,
          galeriaId: col.galleryId,
          profile: prof,
        } as AutographCollection,
      ];

      return articulos;
    }

    const todos = await getArticulo(first, skip);
    const designersSet: { [key: string]: boolean } = {};

    todos?.data?.collections
      ?.map((d: { designer: string }) => d.designer)
      ?.forEach((d: string) => {
        if (d) {
          designersSet[d] = true;
        }
      });

    await Promise.all(
      Object.keys(designersSet)?.map(async (d) => {
        const res = await fetchAccountsAvailable(
          lensConectado?.sessionClient ?? clienteLens,
          {
            managedBy: d,
            includeOwned: true,
          }
        );
        if (res?.isOk()) {
          profs.push(res?.value?.items?.[0]?.account as Account);
        }
      })
    );

    await Promise.all(
      todos?.data?.collections?.map(async (col: any, ind: number) => {
        if (!col.collectionMetadata) {
          const cadena = await fetch(
            `${INFURA_GATEWAY}/ipfs/${col.uri.split("ipfs://")?.[1]}`
          );
          col.collectionMetadata = await cadena.json();
        }

        articulos?.push({
          id: col.collectionId,
          cantidad: col.amount,
          tokenes: col.acceptedTokens,
          tokenesMinteados: col.mintedTokenIds,
          precio: Number(col.price),
          tipo: numberToAutograph[Number(col.type)],
          titulo: col.metadata?.title,
          descripcion: col.metadata?.description,
          etiquetas: col.metadata?.tags,
          imagenes: col.metadata?.images,
          npcs: col.metadata?.npcs,
          postIds: col.postIds,
          coleccionId: col.collectionId,
          galeriaId: col.galleryId,
          profile: profs[ind],
        } as AutographCollection);
      })
    );

    return articulos;
  } catch (err: any) {
    console.error(err.message);
  }
};
