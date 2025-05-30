import { FirestoreDataConverter } from "firebase-admin/firestore";
import { formatDBDate } from "../utils/date-utils";
import { NFTDB } from "../models/nft";

export const nftConverter: FirestoreDataConverter<NFTDB> = {
  toFirestore(nft: NFTDB) {
    return {
      ...nft,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();

    const nft = {
      ...data,
      startDate: formatDBDate(data.startDate),
      endDate: formatDBDate(data.endDate),
    } as NFTDB;

    console.log(nft);
    return nft;
  },
};
