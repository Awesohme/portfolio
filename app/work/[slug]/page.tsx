import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import ProjectExperience from "@/components/ProjectExperience";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  return {
    title: p ? `${p.name} — Olamide Irojah` : "Project — Olamide Irojah",
    description: p?.tagline,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectExperience project={project} />;
}
