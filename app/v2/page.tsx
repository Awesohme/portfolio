import Link from "next/link";
import SpecMotion from "@/components/SpecMotion";
import SpecTagline from "@/components/SpecTagline";
import SpecNav from "@/components/SpecNav";
import SpecSocials from "@/components/SpecSocials";
import SpecToolField from "@/components/SpecToolField";
import { getProjects } from "@/lib/projectsCms";

export const dynamic = "force-dynamic";

// one-line outcome shown in the §04 shipped index, per project
const OUTCOME: Record<string, string> = {
  qshop: "59,700+ stores",
  "imperium-utilities": "multi-tenant ERP",
  "morph-ops": "live role-aware PWA",
  tracta: "offline-first field",
  atia: "two-sided marketplace",
  "sunset-haven": "resort + RBAC admin",
  impactops: "programme ops, secured",
  mikano: "self-refreshing guide",
  qtrack: "500+ users / 2mo",
  "sugar-guest-pro": "check-in −50%",
  jarvis: "second-brain AI OS",
  "claude-skills": "13 dev-skills",
};

export default async function SpecHome() {
  const projects = await getProjects();
  // split for §04: product cases primary, tool/personal builds in "Also built"
  const productCases = projects.filter((p) => p.category === "product");
  const toolCases = projects.filter((p) => p.category === "tool");

  return (
    <>
      <SpecToolField />
      <main className="spec-doc">
        <SpecMotion />
        <SpecNav />

      <div className="spec-hero">
        <div className="spec-doctype">Product Requirements Document · Self</div>
        <h1 className="spec-name">
          Olamide
          <br />
          Irojah
        </h1>
        <div className="spec-meta-row">
          <span>
            ROLE · <b>Product Manager</b>
          </span>
          <span>
            EXP · <b>4+ yrs B2B SaaS</b>
          </span>
          <span>
            MARKET · <b>Emerging</b>
          </span>
          <span>
            STATUS · <b>Still a builder</b>
          </span>
        </div>
        <p
          style={{
            marginTop: 18,
            maxWidth: "62ch",
            color: "#3b372e",
            lineHeight: 1.6,
            fontSize: "1.02rem",
          }}
        >
          I&apos;m a <b style={{ color: "var(--ink)" }}>product manager who designs and builds</b>. I think
          in outcomes, not features. It starts with discovery: I sit with users, learn the problem deeper
          than the brief, then prototype the bet and put it in front of them before the team spends a sprint
          on a guess. Strategy, design, code, I&apos;ve shipped all three.
        </p>
        <SpecTagline />
      </div>

      <section className="spec-sec spec-reveal">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> Problem
          </h2>
          <div className="spec-lead">Most products ship features. Few move the number that matters.</div>
          <p>
            The job isn&apos;t to build. It&apos;s to find the problem worth solving and chase the
            outcome that proves it. I start with the <i>user&apos;s problem</i>, then build the
            business around it.
          </p>
        </div>
      </section>

      <section className="spec-sec spec-reveal">
        <div className="ln">02</div>
        <div className="body">
          <h2>
            <span className="n">02 ·</span> Bet
          </h2>
          <div className="spec-lead">At QShop, onboarding leaked 70% of new businesses.</div>
          <p>
            The obvious fix was to strip out onboarding steps. I tested the activation flow and read the
            results <mark>quantitatively and qualitatively</mark>, and the data pointed somewhere subtler:
            people wanted to explore the product before committing their own data. So I let them, and cut
            time-to-value instead of just cutting steps.
          </p>
        </div>
      </section>

      <section className="spec-sec spec-reveal">
        <div className="ln">03</div>
        <div className="body">
          <h2>
            <span className="n">03 ·</span> Outcome
          </h2>
          <div className="spec-lead">One change. Compounded across activation, retention, revenue.</div>
          <div className="spec-otable">
            <div className="spec-orow">
              <div className="k">Onboarding drop-off</div>
              <div className="v" data-w="55">
                <span>70% → 45%</span>
              </div>
            </div>
            <div className="spec-orow">
              <div className="k">Stores scaled to</div>
              <div className="v" data-w="95">
                <span>59,700+</span>
              </div>
            </div>
            <div className="spec-orow">
              <div className="k">Annual GMV</div>
              <div className="v" data-w="80">
                <span>$5.2M</span>
              </div>
            </div>
            <div className="spec-orow">
              <div className="k">Sprint velocity</div>
              <div className="v" data-w="70">
                <span>+30%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shipped" className="spec-sec spec-reveal" style={{ scrollMarginTop: 72 }}>
        <div className="ln">04</div>
        <div className="body" style={{ paddingBottom: 0 }}>
          <h2>
            <span className="n">04 ·</span> Shipped
          </h2>
          <div className="spec-lead" style={{ marginBottom: 8 }}>
            Five products. One operating instinct.
          </div>
        </div>
      </section>

      <div className="spec-windex">
        {productCases.map((p, i) => (
          <Link key={p.slug} href={`/v2/work/${p.slug}`} className="wrow">
            <span className="id">{String(i + 1).padStart(2, "0")}</span>
            <div className="nm">
              {p.name}
              <small>
                {p.roleLabel} · {p.period}
              </small>
            </div>
            <span className="out">{OUTCOME[p.slug] ?? p.tag} →</span>
          </Link>
        ))}
      </div>

      {/* Also built — tools & experiments (kept distinct from the product cases) */}
      <section className="spec-sec spec-reveal">
        <div className="ln">05</div>
        <div className="body" style={{ paddingBottom: 0 }}>
          <h2>
            <span className="n">05 ·</span> Also built
          </h2>
          <div className="spec-lead" style={{ marginBottom: 8 }}>
            Side projects, tools, and systems I have shipped along the way.
          </div>
        </div>
      </section>

      <div className="spec-windex">
        {toolCases.map((p) => (
          <Link key={p.slug} href={`/v2/work/${p.slug}`} className="wrow">
            <span className="id">▦</span>
            <div className="nm">
              {p.name}
              <small>
                {p.roleLabel} · {p.period}
              </small>
            </div>
            <span className="out">{OUTCOME[p.slug] ?? p.tag} →</span>
          </Link>
        ))}
      </div>

      <div className="spec-signoff spec-reveal">
        <div className="spec-lead">
          I&apos;m looking for the next hard problem. Somewhere that wants a PM who&apos;ll do the thinking
          and ship the prototype to prove it.
        </div>
        <div className="spec-cta">
          <Link href="/v2/about" className="spec-btn spec-btn-fill">
            My Background →
          </Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="spec-btn spec-btn-out">
            ⬇ Résumé.pdf
          </a>
        </div>
        <div className="spec-stamp">
          SIGNED · OLAMIDE IROJAH · PRODUCT MANAGER · irojaholamide@gmail.com · REV 2026.06
        </div>
        <SpecSocials className="spec-stamp-socials" />
      </div>
      </main>
    </>
  );
}
