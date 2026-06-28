import { project } from "./project";
import { musing } from "./musing";
import { experience } from "./experience";
import { siteSettings } from "./siteSettings";
import { section } from "./section";
import { feature } from "./feature";

export const schemaTypes = [
  // documents
  project,
  musing,
  experience,
  siteSettings,
  // objects
  section,
  feature,
];
