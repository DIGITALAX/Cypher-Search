import { useEffect, useState } from "react";
import whoReactedPublication from "../../../../graphql/lens/queries/whoReacted";
import {
  LimitType,
  Profile,
  PublicationType,
} from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import whoActedPublication from "../../../../graphql/lens/queries/whoActed";
import following from "../../../../graphql/lens/queries/following";
import followers from "../../../../graphql/lens/queries/followers";
import { ReactBoxState } from "../../../../redux/reducers/reactBoxSlice";

const useWho = (
  lensConnected: Profile | undefined,
  reactBox: ReactBoxState
) => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [reactors, setReactors] = useState<any[]>([]);
  const [quoters, setQuoters] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreQuote, setHasMoreQuote] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState<string>();
  const [pageInfoQuote, setPageInfoQuote] = useState<string>();
  const [mirrorQuote, setMirrorQuote] = useState<boolean>(false);

  const showLikes = async () => {
    if (!reactBox.id) return;
    setDataLoading(true);
    try {
      const data = await whoReactedPublication({
        for: reactBox.id,
        limit: LimitType.Ten,
      });

      if (
        !data?.data?.whoReactedPublication?.items ||
        data?.data?.whoReactedPublication?.items?.length < 1
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.whoReactedPublication?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors(data?.data?.whoReactedPublication?.items);
      setPageInfo(data.data?.whoReactedPublication.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  // const showComments = async () => {
  //   if (!reactBox.id) return;
  //   setDataLoading(true);

  //   try {
  //     const data = await getPublications(
  //       {
  //         limit: LimitType.Ten,

  //         where: {
  //           publicationTypes: [PublicationType.Comment],
  //           commentOn: {
  //             id: reactBox.id,
  //             ranking: {
  //               filter: CommentRankingFilterType.Relevant,
  //             },
  //           },
  //         },
  //       },
  //       lensConnected
  //     );

  //     if (
  //       !data?.data?.publications?.items ||
  //       data?.data?.publications?.items?.length < 1
  //     ) {
  //       setHasMore(false);
  //       setDataLoading(false);
  //       return;
  //     } else if (data?.data?.publications?.items?.length === 10) {
  //       setHasMore(true);
  //     }

  //     setReactors(data?.data?.publications?.items);
  //     setPageInfo(data.data?.publications.pageInfo.next);
  //   } catch (err: any) {
  //     console.error(err.message);
  //   }

  //   setDataLoading(false);
  // };

  const showMirrorQuotes = async () => {
    if (!reactBox.id) return;

    setDataLoading(true);

    try {
      if (!mirrorQuote) {
        const mirrorData = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              publicationTypes: [PublicationType.Mirror],
              mirrorOn: reactBox.id,
            },
          },
          lensConnected?.id
        );
        if (
          !mirrorData?.data?.publications?.items ||
          mirrorData?.data?.publications?.items?.length < 1
        ) {
          setHasMore(false);
          setDataLoading(false);
          return;
        } else if (mirrorData?.data?.publications?.items?.length === 10) {
          setHasMore(true);
        }

        setReactors(mirrorData?.data?.publications?.items);
        setPageInfo(mirrorData.data?.publications.pageInfo.next);
      }

      if (mirrorQuote) {
        const quoteData = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              publicationTypes: [PublicationType.Quote],
              quoteOn: reactBox.id,
            },
          },
          lensConnected?.id
        );

        if (
          !quoteData?.data?.publications?.items ||
          quoteData?.data?.publications?.items?.length < 1
        ) {
          setHasMoreQuote(false);
          setDataLoading(false);
          return;
        } else if (quoteData?.data?.publications?.items?.length === 10) {
          setHasMoreQuote(true);
        }
        setQuoters(quoteData?.data?.publications?.items);
        setPageInfoQuote(quoteData.data?.publications.pageInfo.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showActors = async () => {
    if (!reactBox.id) return;
    setDataLoading(true);
    try {
      const data = await whoActedPublication({
        on: reactBox.id,
        limit: LimitType.Ten,
      });

      if (
        !data?.data?.whoActedOnPublication?.items ||
        data?.data?.whoActedOnPublication?.items?.length < 1
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.whoActedOnPublication?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors(data?.data?.whoActedOnPublication?.items);
      setPageInfo(data.data?.whoActedOnPublication.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showFollowing = async () => {
    if (!reactBox.id) return;
    setDataLoading(true);
    try {
      const data = await following({
        for: reactBox.id,
        limit: LimitType.Ten,
      });

      if (
        !data?.data?.following?.items ||
        data?.data?.following?.items?.length < 1
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.following?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors(data?.data?.following?.items);
      setPageInfo(data.data?.following.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showFollowers = async () => {
    if (!reactBox.id) return;
    setDataLoading(true);
    try {
      const data = await followers({
        of: reactBox.id,
        limit: LimitType.Ten,
      });

      if (
        !data?.data?.followers?.items ||
        data?.data?.followers?.items?.length < 1
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.followers?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors(data?.data?.followers?.items);
      setPageInfo(data.data?.followers.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreLikes = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await whoReactedPublication({
        for: reactBox.id,
        limit: LimitType.Ten,
        cursor: pageInfo,
      });

      if (
        !data?.data?.whoReactedPublication?.items ||
        data?.data?.whoReactedPublication?.items?.length < 1
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.whoReactedPublication?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors([
        ...reactors,
        ...(data?.data?.whoReactedPublication?.items || []),
      ]);
      setPageInfo(data.data?.whoReactedPublication.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreActors = async () => {
    if (!pageInfo || !hasMore) return;

    try {
      const data = await whoActedPublication({
        on: reactBox.id,
        limit: LimitType.Ten,
        cursor: pageInfo,
      });

      if (
        !data?.data?.whoActedOnPublication?.items ||
        data?.data?.whoActedOnPublication?.items?.length < 1
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.whoActedOnPublication?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors([
        ...reactors,
        ...(data?.data?.whoActedOnPublication?.items || []),
      ]);
      setPageInfo(data.data?.whoActedOnPublication.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreFollowing = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await following({
        for: reactBox.id,
        limit: LimitType.Ten,
        cursor: pageInfo,
      });

      if (
        !data?.data?.following?.items ||
        data?.data?.following?.items?.length < 1
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.following?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors([...reactors, ...(data?.data?.following?.items || [])]);
      setPageInfo(data.data?.following.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreFollowers = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await followers({
        of: reactBox.id,
        limit: LimitType.Ten,
        cursor: pageInfo,
      });

      if (
        !data?.data?.followers?.items ||
        data?.data?.followers?.items?.length < 1
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.followers?.items?.length === 10) {
        setHasMore(true);
      }

      setReactors([...reactors, ...(data?.data?.followers?.items || [])]);
      setPageInfo(data.data?.followers.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // const showMoreComments = async () => {
  //   if (!pageInfo || !hasMore) return;

  //   try {
  //     const data = await getPublications(
  //       {
  //         limit: LimitType.Ten,
  //         cursor: pageInfo,
  //         where: {
  //           publicationTypes: [PublicationType.Comment],
  //           commentOn: {
  //             id: reactBox?.id,
  //             ranking: { filter: CommentRankingFilterType.Relevant },
  //           },
  //         },
  //       },
  //       lensConnected
  //     );

  //     if (
  //       !data?.data?.publications?.items ||
  //       data?.data?.publications?.items?.length < 1
  //     ) {
  //       setHasMore(false);
  //       return;
  //     } else if (data?.data?.publications?.items?.length === 10) {
  //       setHasMore(true);
  //     }

  //     setReactors([...reactors, ...(data?.data?.publications?.items || [])]);
  //     setPageInfo(data.data?.publications.pageInfo.next);
  //   } catch (err: any) {
  //     console.error(err.message);
  //   }
  // };

  const showMoreQuoteMirrors = async () => {
    if ((!pageInfo || !hasMore) && (!pageInfoQuote || !hasMoreQuote)) return;

    try {
      const mirrorData = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Mirror],
            mirrorOn: reactBox?.id,
          },
          cursor: pageInfo,
        },
        lensConnected?.id
      );

      const quoteData = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Mirror],
            mirrorOn: reactBox?.id,
          },
          cursor: pageInfoQuote,
        },
        lensConnected?.id
      );

      if (
        !mirrorData?.data?.publications?.items ||
        mirrorData?.data?.publications?.items?.length < 1
      ) {
        setHasMore(false);
        return;
      } else if (mirrorData?.data?.publications?.items?.length === 10) {
        setHasMore(true);
      }

      if (
        !quoteData?.data?.publications?.items ||
        quoteData?.data?.publications?.items?.length < 1
      ) {
        setHasMoreQuote(false);
        return;
      } else if (quoteData?.data?.publications?.items?.length === 10) {
        setHasMoreQuote(true);
      }

      setReactors([
        ...reactors,
        ...(mirrorData?.data?.publications?.items || []),
      ]);
      setPageInfo(mirrorData.data?.publications.pageInfo.next);
      setQuoters([...quoters, ...(quoteData?.data?.publications?.items || [])]);
      setPageInfoQuote(quoteData.data?.publications.pageInfo.next);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMore = () => {
    switch (reactBox.type) {
      case "Likes":
        showMoreLikes();
        break;

      case "Acts":
        showMoreActors();
        break;

      case "Mirrors":
        showMoreQuoteMirrors();
        break;

      case "Followers":
        showMoreFollowers();
        break;

      case "Following":
        showMoreFollowing();
        break;
    }
  };

  useEffect(() => {
    if (reactBox.open) {
      switch (reactBox.type) {
        case "Likes":
          reactors?.length < 1 && showLikes();
          break;

        case "Acts":
          reactors?.length < 1 && showActors();
          break;

        case "Mirrors":
          quoters?.length < 1 && reactors?.length < 1 && showMirrorQuotes();
          break;

        case "Followers":
          reactors?.length < 1 && showFollowers();
          break;

        case "Following":
          reactors?.length < 1 && showFollowing();
          break;
      }
    } else {
      setPageInfo(undefined);
      setPageInfoQuote(undefined);
      setReactors([]);
      setQuoters([]);
      setHasMore(true);
      setHasMoreQuote(true);
    }
  }, [reactBox.open]);

  return {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
  };
};

export default useWho;