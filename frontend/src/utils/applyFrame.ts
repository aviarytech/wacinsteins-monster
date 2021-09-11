import jsonld from "jsonld";
import { documentLoader } from "./documentLoader";

export const applyFrame = async (document: object, frame: object) => {
  return await jsonld.frame(document, frame, {
    documentLoader,
  });
};
