import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { BASE_URL } from "../constants";
import {
  AccessToken,
  IdToken,
  RefreshToken,
  Result,
  UnexpectedError,
} from "@lens-protocol/client";

const httpLink = new HttpLink({ uri: BASE_URL });

const retryLink = new RetryLink();
export const getApolloLens = (
  creds: Result<
    {
      accessToken: AccessToken;
      idToken: IdToken;
      refreshToken: RefreshToken;
    } | null,
    UnexpectedError
  >
): ApolloClient<NormalizedCacheObject> => {
  if (creds?.isOk() && creds.value) {
    const staticAuthLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          "x-access-token": `Bearer ${creds.value?.accessToken}`,
        },
      });

      return forward(operation);
    });

    const dynamicLink = ApolloLink.from([
      retryLink,
      staticAuthLink.concat(httpLink),
    ]);

    return new ApolloClient({
      link: dynamicLink,
      uri: BASE_URL,
      cache: new InMemoryCache(),
    });
  } else {
    return new ApolloClient({
      link: ApolloLink.from([retryLink, httpLink]),
      uri: BASE_URL,
      cache: new InMemoryCache(),
    });
  }
};
