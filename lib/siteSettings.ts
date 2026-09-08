/**
 * Site-wide settings: editable copy, file refs (resume/profile image), and
 * show/hide toggles for sections. Read from Sanity's siteSettings singleton.
 * Falls back to sensible defaults (all sections ON, copy = current, files = /public)
 * if the CMS is unreachable.
 */

import resumeUpdate from "@/content/resume-update.json";
import { sanityFetch } from "@/lib/sanityFetch";
import { urlForImage, fileUrl } from "@/sanity/client";

export type SiteSettings = {
  heroExperience: string;
  heroMarket: string;
  heroStatus: string;
  aboutCommunity: string;
  contactCtaLabel: string;
  resumeCtaLabel: string;
  outcomeMetrics: { _key: string; label: string; value: string }[];
  heroThesis: string;
  problemLead: string;
  problemBody: string;
  betLead: string;
  betBody: string;
  outcomeLead: string;
  aboutHero: string;
  aboutOrigin: string;
  aboutOperatingInstinct: string;
  fullName: string;
  jobTitle: string;
  email: string;
  whatsapp: string;
  githubUrl: string;
  linkedinUrl: string;
  contactMessage: string;
  signoffText: string;
  resumeUrl: string;
  profileImageUrl: string;
  show: {
    profileImage: boolean;
    resume: boolean;
    problem: boolean;
    bet: boolean;
    outcome: boolean;
    shipped: boolean;
    alsoBuilt: boolean;
    timeline: boolean;
    musingsNav: boolean;
    socials: boolean;
    contact: boolean;
    signoff: boolean;
  };
};

// Defaults mirror the current hardcoded copy + /public files; all sections ON.
const FALLBACK: SiteSettings = {
  fullName: "Olamide Irojah",
  email: "irojaholamide@gmail.com",
  whatsapp: "2348121364213",
  githubUrl: "https://github.com/awesohme",
  linkedinUrl: "https://www.linkedin.com/in/irojaholamide/",
  contactMessage:
    "Hi Olamide, I came across your portfolio and I'd love to talk about a product role / opportunity. When are you free for a quick chat?",
  ...resumeUpdate.siteSettings,
  resumeUrl: "/resume.pdf",
  profileImageUrl: "/olamide.jpg",
  show: {
    profileImage: true,
    resume: true,
    problem: true,
    bet: true,
    outcome: true,
    shipped: true,
    alsoBuilt: true,
    timeline: true,
    musingsNav: true,
    socials: true,
    contact: true,
    signoff: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function imageUrl(img: any, fallback: string): string {
  try {
    if (img?.asset?._ref) return urlForImage(img) || fallback;
  } catch {
    /* ignore */
  }
  return fallback;
}

const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  heroExperience, heroMarket, heroStatus, aboutCommunity, contactCtaLabel, resumeCtaLabel,
  outcomeMetrics[]{_key, label, value},
  heroThesis, problemLead, problemBody, betLead, betBody, outcomeLead,
  aboutHero, aboutOrigin, aboutOperatingInstinct,
  fullName, jobTitle, email, whatsapp, githubUrl, linkedinUrl,
  contactMessage, signoffText,
  "resumeRef": resume.asset._ref,
  profileImage,
  showProfileImage, showResume, showProblem, showBet, showOutcome,
  showShipped, showAlsoBuilt, showTimeline, showMusingsNav, showSocials,
  showContact, showSignoff
}`;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return FALLBACK;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = await sanityFetch<any>(SITE_SETTINGS_QUERY);
    if (!s) return FALLBACK;
    const pick = (v: any, fb: string) => (typeof v === "string" && v.trim() ? v : fb);
    const bool = (v: any, fb: boolean) => (typeof v === "boolean" ? v : fb);
    return {
      heroExperience: pick(s.heroExperience, FALLBACK.heroExperience),
      heroMarket: pick(s.heroMarket, FALLBACK.heroMarket),
      heroStatus: pick(s.heroStatus, FALLBACK.heroStatus),
      aboutCommunity: pick(s.aboutCommunity, FALLBACK.aboutCommunity),
      contactCtaLabel: pick(s.contactCtaLabel, FALLBACK.contactCtaLabel),
      resumeCtaLabel: pick(s.resumeCtaLabel, FALLBACK.resumeCtaLabel),
      outcomeMetrics: Array.isArray(s.outcomeMetrics) && s.outcomeMetrics.length > 0 && s.outcomeMetrics.every((m: any) => m && typeof m.label === "string" && typeof m.value === "string") ? s.outcomeMetrics : FALLBACK.outcomeMetrics,
      heroThesis: pick(s.heroThesis, FALLBACK.heroThesis),
      problemLead: pick(s.problemLead, FALLBACK.problemLead),
      problemBody: pick(s.problemBody, FALLBACK.problemBody),
      betLead: pick(s.betLead, FALLBACK.betLead),
      betBody: pick(s.betBody, FALLBACK.betBody),
      outcomeLead: pick(s.outcomeLead, FALLBACK.outcomeLead),
      aboutHero: pick(s.aboutHero, FALLBACK.aboutHero),
      aboutOrigin: pick(s.aboutOrigin, FALLBACK.aboutOrigin),
      aboutOperatingInstinct: pick(s.aboutOperatingInstinct, FALLBACK.aboutOperatingInstinct),
      fullName: pick(s.fullName, FALLBACK.fullName),
      jobTitle: pick(s.jobTitle, FALLBACK.jobTitle),
      email: pick(s.email, FALLBACK.email),
      whatsapp: pick(s.whatsapp, FALLBACK.whatsapp),
      githubUrl: pick(s.githubUrl, FALLBACK.githubUrl),
      linkedinUrl: pick(s.linkedinUrl, FALLBACK.linkedinUrl),
      contactMessage: pick(s.contactMessage, FALLBACK.contactMessage),
      signoffText: pick(s.signoffText, FALLBACK.signoffText),
      resumeUrl: fileUrl(s.resumeRef) || FALLBACK.resumeUrl,
      profileImageUrl: imageUrl(s.profileImage, FALLBACK.profileImageUrl),
      show: {
        profileImage: bool(s.showProfileImage, true),
        resume: bool(s.showResume, true),
        problem: bool(s.showProblem, true),
        bet: bool(s.showBet, true),
        outcome: bool(s.showOutcome, true),
        shipped: bool(s.showShipped, true),
        alsoBuilt: bool(s.showAlsoBuilt, true),
        timeline: bool(s.showTimeline, true),
        musingsNav: bool(s.showMusingsNav, true),
        socials: bool(s.showSocials, true),
        contact: bool(s.showContact, true),
        signoff: bool(s.showSignoff, true),
      },
    };
  } catch {
    return FALLBACK;
  }
}
