import { Profile } from "../../graphql/generated";
import getProfile from "../../graphql/lens/queries/profile";
import { DIGITALAX_PROFILE_ID_LENS } from "../constants";

const cachedProfiles = async (): Promise<
  { [key: string]: Profile } | undefined
> => {
  try {
    const profileCache: { [key: string]: Profile } = {};
    const { data: digiData } = await getProfile({
      forProfileId: DIGITALAX_PROFILE_ID_LENS,
    });
    profileCache[DIGITALAX_PROFILE_ID_LENS] = digiData?.profile?.id;
    return profileCache;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default cachedProfiles;
