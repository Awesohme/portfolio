/**
 * Site-wide settings: editable copy, file refs (resume/profile image), and
 * show/hide toggles for sections. Read from Strapi's Site Settings single-type.
 * Falls back to sensible defaults (all sections ON, copy = current, files = /public)
 * if the CMS is unreachable.
 */

export type SiteSettings = {
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
  heroThesis:
    "I'm a product manager who designs and builds. I think in outcomes, not features. It starts with discovery: I sit with users, learn the problem deeper than the brief, then prototype the bet and put it in front of them before the team spends a sprint on a guess. Strategy, design, code, I've shipped all three.",
  problemLead: "Most products ship features. Few move the number that matters.",
  problemBody:
    "The job isn't to build. It's to find the problem worth solving and chase the outcome that proves it. I start with the user's problem, then build the business around it.",
  betLead: "At QShop, onboarding leaked 70% of new businesses.",
  betBody:
    "The obvious fix was to strip out onboarding steps. I tested the activation flow and read the results quantitatively and qualitatively, and the data pointed somewhere subtler: people wanted to explore the product before committing their own data. So I let them, and cut time-to-value instead of just cutting steps.",
  outcomeLead: "One change. Compounded across activation, retention, revenue.",
  aboutHero: "Start with the user's problem. Build the business around it.",
  aboutOrigin:
    "I started in agriculture. Literally, a B.Sc. in Agricultural Administration. Then I became COO of an EdTech and scaled it to 9,000+ users across West Africa with no playbook to copy. That zero-to-one taught me the thing I still build on: start with the user's problem, then build the business around it.",
  aboutOperatingInstinct:
    "It was deciding what not to build. The real work is killing the twenty requests that didn't earn their place so the few that matter can actually land. I ship fast, validate before I spend a team's engineering, and I build the tools that build the products too.\n\nHonestly, the part I love is the people. I enjoy sitting with users, understanding their problems, and learning more than I expect to, then turning that into how we'll actually solve it without ever losing sight of the business we're trying to build. And I'm always watching the industry: spotting trends, noticing patterns, connecting dots other people walk past. That's the work I'd do for free.",
  fullName: "Olamide Irojah",
  jobTitle: "Product Manager",
  email: "irojaholamide@gmail.com",
  whatsapp: "2348121364213",
  githubUrl: "https://github.com/awesohme",
  linkedinUrl: "https://www.linkedin.com/in/irojaholamide/",
  contactMessage:
    "Hi Olamide, I came across your portfolio and I'd love to talk about a product role / opportunity. When are you free for a quick chat?",
  signoffText:
    "I'm looking for the next hard problem. Somewhere that wants a PM who'll do the thinking and ship the prototype to prove it.",
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

function mediaUrl(base: string, m: any, fallback: string): string {
  const url = m?.url || m?.data?.attributes?.url;
  if (!url) return fallback;
  return url.startsWith("http") ? url : `${base}${url}`;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) return FALLBACK;
  try {
    const res = await fetch(`${base}/api/site-setting?populate=*`, { cache: "no-store" });
    if (!res.ok) return FALLBACK;
    const json = await res.json();
    const s = json?.data;
    if (!s) return FALLBACK;
    const pick = (v: any, fb: string) => (typeof v === "string" && v.trim() ? v : fb);
    const bool = (v: any, fb: boolean) => (typeof v === "boolean" ? v : fb);
    return {
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
      resumeUrl: mediaUrl(base, s.resume, FALLBACK.resumeUrl),
      profileImageUrl: mediaUrl(base, s.profileImage, FALLBACK.profileImageUrl),
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
