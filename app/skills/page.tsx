import type { Metadata } from "next";
import Link from "next/link";
import SpecNav from "@/components/SpecNav";
import Arrow from "@/components/Arrow";
import NotifyButton from "@/components/NotifyButton";
import SkillLibrary from "@/components/SkillLibrary";
import { getSkills } from "@/lib/skillsCms";
import { ALL_SKILLS_SLUG } from "@/lib/skills";
import { getSiteSettings, notifyProps } from "@/lib/siteSettings";
import { splitLines } from "@/lib/specText";

export const metadata: Metadata = {
  title: "Skills · Olamide Irojah",
  description: "Free AI coding skills to download: session memory, project audits, docs, handoffs and more. Works with Claude Code and other AI agents.",
};

// always render fresh so edits published in Studio show up on refresh
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const [skills, s] = await Promise.all([getSkills(), getSiteSettings()]);
  const c = s.copy;
  const [titleA, ...titleRest] = splitLines(c.skillsTitle);
  const tipUrl = /^https?:\/\//i.test(c.skillsTipUrl.trim()) ? c.skillsTipUrl.trim() : "";
  const notify = notifyProps(s);

  return (
    <main className="spec-doc editorial-skills">
      <SpecNav back={{ href: "/", label: "Back to home" }} />

      <div className="spec-hero">
        <div className="spec-doctype">{c.skillsEyebrow}</div>
        <h1 className="spec-name">
          <span>{titleA}</span>
          {titleRest.length > 0 && <span className="editorial-muted">{titleRest.join(" ")}</span>}
        </h1>
        <p className="skill-intro">{c.skillsIntro}</p>
      </div>

      <section className="spec-sec">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> {c.skillsLibraryTitle}
          </h2>
          <SkillLibrary
            skills={skills}
            allSlug={ALL_SKILLS_SLUG}
            labels={{
              download: c.skillsDownloadLabel,
              downloadAll: c.skillsDownloadAllLabel,
              allTitle: c.skillsAllTitle,
              allBody: c.skillsAllBody,
              thanks: c.skillsThanks,
            }}
          />
        </div>
      </section>

      <div className="spec-signoff">
        {tipUrl && (
          <p className="skill-cookie">
            <span>{c.skillsCookieText}</span>
            <a href={tipUrl} target="_blank" rel="noopener noreferrer" className="editorial-text-link">
              {c.skillsTipLabel} <span aria-hidden="true"><Arrow /></span>
            </a>
          </p>
        )}
        <div className="spec-cta editorial-paired-actions">
          <NotifyButton
            {...notify}
            label={c.skillsNotifyLabel}
            eyebrow="New from Olamide"
            signup={notify.signup && { ...notify.signup, title: c.skillsNotifyTitle, body: c.skillsNotifyBody }}
            className="spec-btn spec-btn-fill"
            style={{ textAlign: "center", border: "none", cursor: "pointer" }}
          />
          <Link href="/" className="spec-btn spec-btn-out" style={{ textAlign: "center" }}>
            <Arrow dir="left" />&nbsp;Back to home
          </Link>
        </div>
        <div className="spec-stamp">
          {s.fullName.toUpperCase()} · {s.jobTitle.toUpperCase()} · {s.email}
        </div>
      </div>
    </main>
  );
}
