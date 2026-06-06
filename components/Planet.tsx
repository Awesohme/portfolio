"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Project, Continent } from "@/lib/projects";

const R = 2; // planet radius

/** lat/long (deg) -> point just above the surface */
function latLngToVec(lat: number, lng: number, radius = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** deterministic PRNG so each project's planet looks distinct but stable */
function makeRng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** per-continent lat/lng — independent seed per index so it's reproducible anywhere */
function continentLatLng(slug: string, i: number, n: number) {
  const rng = makeRng(`${slug}-pos-${i}`);
  return {
    lng: (i / n) * 360 - 180 + (rng() - 0.5) * 50,
    lat: (rng() - 0.5) * 110,
  };
}

/** an organic, irregular landmass outline as a flat THREE.Shape (local 2D coords) */
function makeContinentShape(rng: () => number, baseSize: number) {
  const pts = 10 + Math.floor(rng() * 5);
  const base = baseSize * (0.85 + rng() * 0.4);
  const shape = new THREE.Shape();
  const radii: number[] = [];
  for (let i = 0; i < pts; i++) radii.push(base * (0.6 + rng() * 0.85));
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const r = radii[i % pts];
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * (0.7 + rng() * 0.6);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return shape;
}

/**
 * Build a landmass mesh that HUGS the sphere surface: take a flat 2D blob shape,
 * triangulate it, then map every vertex from the tangent plane (at the given
 * lat/lng) onto the sphere of radius `radius`. Result is a curved continent that
 * never slivers at the limb.
 */
function makeSphericalLandGeometry(
  shape: THREE.Shape,
  lat: number,
  lng: number,
  radius: number
) {
  const flat = new THREE.ShapeGeometry(shape, 18);
  const pos = flat.attributes.position;
  // tangent basis at this lat/lng
  const center = latLngToVec(lat, lng, 1).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const east = new THREE.Vector3().crossVectors(up, center).normalize();
  const north = new THREE.Vector3().crossVectors(center, east).normalize();
  const out = new THREE.BufferGeometry();
  const verts: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // point on tangent plane, then normalize to the sphere (slightly raised)
    const p = center
      .clone()
      .add(east.clone().multiplyScalar(x))
      .add(north.clone().multiplyScalar(y))
      .normalize()
      .multiplyScalar(radius * 1.012);
    verts.push(p.x, p.y, p.z);
  }
  out.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  out.setIndex(flat.getIndex());
  out.computeVertexNormals();
  flat.dispose();
  return out;
}

function Globe({
  project,
  onSelect,
  selectedIdx,
}: {
  project: Project;
  onSelect: (i: number) => void;
  selectedIdx: number | null;
}) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<number | null>(null);

  useFrame((_, dt) => {
    // auto-rotate only when nothing is selected or hovered, so markers stay clickable
    if (group.current && selectedIdx === null && hover === null)
      group.current.rotation.y += dt * 0.08;
  });

  const landColor = new THREE.Color(project.planet.land);
  const baseColor = new THREE.Color(project.planet.base);

  // clickable feature/outcome continents — curved onto the sphere, sized to read big
  const layout = useMemo(() => {
    const n = project.continents.length;
    return project.continents.map((_, i) => {
      const { lat, lng } = continentLatLng(project.slug, i, n);
      const v = latLngToVec(lat, lng, R);
      const rng = makeRng(`${project.slug}-shape-${i}`);
      const shape = makeContinentShape(rng, 0.62 + rng() * 0.28);
      const geometry = makeSphericalLandGeometry(shape, lat, lng, R);
      return { v, geometry };
    });
  }, [project]);

  // decorative filler landmasses so the world looks populated (no labels/clicks)
  const fillerLand = useMemo(() => {
    const rng = makeRng(`${project.slug}-filler`);
    const count = 7 + Math.floor(rng() * 4); // 7–10
    const items: THREE.BufferGeometry[] = [];
    for (let i = 0; i < count; i++) {
      const lat = (rng() - 0.5) * 150;
      const lng = rng() * 360 - 180;
      const shape = makeContinentShape(rng, 0.3 + rng() * 0.35);
      items.push(makeSphericalLandGeometry(shape, lat, lng, R));
    }
    return items;
  }, [project]);

  const fillerColor = new THREE.Color(project.planet.land).lerp(baseColor, 0.45);

  return (
    <group ref={group}>
      {/* ocean / base — deepened for contrast against land */}
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial
          color={baseColor.clone().multiplyScalar(0.7)}
          roughness={0.9}
          metalness={0.1}
          emissive={baseColor}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshBasicMaterial
          color={project.planet.atmosphere}
          transparent
          opacity={0.14}
          side={THREE.BackSide}
        />
      </mesh>

      {/* decorative filler landmasses (non-interactive) */}
      {fillerLand.map((geo, i) => (
        <mesh key={`filler-${i}`} geometry={geo}>
          <meshStandardMaterial
            color={fillerColor}
            emissive={fillerColor}
            emissiveIntensity={0.25}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* continents = features/outcomes (clickable, brighter) */}
      {project.continents.map((c, i) => {
        const { v, geometry } = layout[i];
        const isActive = hover === i || selectedIdx === i;
        return (
          <group key={i}>
            {/* organic landmass hugging the sphere */}
            <mesh
              geometry={geometry}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHover(i);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHover(null);
                document.body.style.cursor = "auto";
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
            >
              <meshStandardMaterial
                color={landColor}
                emissive={landColor}
                emissiveIntensity={isActive ? 1.2 : 0.6}
                roughness={0.55}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* marker pin + label — hidden once a panel is open (panel shows the detail) */}
            {selectedIdx === null && (
              <Html
                position={v.clone().multiplyScalar(1.16).toArray()}
                center
                distanceFactor={8}
                // anchor label to the LEFT of its pin so chips never drift into the
                // right-side detail panel
                style={{ transform: "translateX(-50%)" }}
                zIndexRange={[40, 0]}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(i);
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className={`pointer-events-auto -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur transition ${
                    isActive
                      ? "border-emerald bg-emerald/30 text-white shadow-glow"
                      : "border-white/20 bg-black/40 text-emerald-soft hover:border-emerald"
                  }`}
                  style={{ fontFamily: "var(--font-grotesk)" }}
                >
                  <span
                    className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                      c.kind === "outcome" ? "bg-amber-300" : "bg-emerald"
                    }`}
                  />
                  {c.name}
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

/** Fires onReady after the scene has actually painted a couple of frames. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}

function CameraRig({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  const home = useMemo(() => new THREE.Vector3(0, 0, 6), []);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(() => {
    const dest = target ? target.clone().normalize().multiplyScalar(4.2) : home;
    camera.position.lerp(dest, 0.06);
    // Desktop: when a continent is selected, look slightly RIGHT so the globe
    // shifts LEFT, clear of the right-side panel. Mobile: panel is a bottom sheet,
    // so keep the planet centered (no horizontal shift).
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 768;
    const shiftX = target && isDesktop ? 1.6 : 0;
    look.lerp(new THREE.Vector3(shiftX, 0, 0), 0.08);
    camera.lookAt(look);
  });
  return null;
}

export default function Planet({
  project,
  onReady,
}: {
  project: Project;
  onReady?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const target = useMemo(() => {
    if (selected === null) return null;
    const { lat, lng } = continentLatLng(project.slug, selected, project.continents.length);
    return latLngToVec(lat, lng, R);
  }, [selected, project]);

  const active: Continent | null = selected !== null ? project.continents[selected] : null;

  return (
    <div className="relative h-screen w-full bg-ink">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ReadySignal onReady={onReady} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.6} color="#d8fff0" />
          <pointLight position={[-6, -2, -4]} intensity={0.6} color={project.planet.atmosphere} />
          <Stars radius={80} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
          <Globe project={project} onSelect={setSelected} selectedIdx={selected} />
          <CameraRig target={target} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
          />
        </Suspense>
      </Canvas>

      {/* header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-[6vw] pt-8">
        <a
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 text-sm text-muted transition hover:text-emerald-soft"
        >
          ← Back to the galaxy
        </a>
        <h1 className="mt-4 font-sora text-[clamp(1.8rem,5vw,3.2rem)] font-extrabold leading-none">
          {project.name}
        </h1>
        <p className="mt-2 max-w-xl text-muted">{project.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1 text-xs text-emerald-soft"
            >
              {s}
            </span>
          ))}
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full border border-emerald/40 bg-emerald/10 px-4 py-2 text-sm font-semibold text-emerald-soft transition hover:border-emerald hover:bg-emerald/20 hover:shadow-glow"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-glow" />
            Visit live site
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>

      {/* legend */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-[.72rem] uppercase tracking-[.18em] text-muted">
          Each continent is a feature or outcome — tap to explore
        </p>
        <div className="mt-2 flex justify-center gap-5 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald" /> Feature
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-300" /> Outcome
          </span>
        </div>
      </div>

      {/* detail panel — bottom sheet on mobile, right-side panel on desktop */}
      {active && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex max-h-[62vh] flex-col overflow-y-auto rounded-t-3xl border-t border-white/10 bg-black/80 px-6 py-7 backdrop-blur-xl animate-[sheetUp_.4s_ease] md:inset-x-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-full md:max-w-md md:justify-center md:rounded-none md:border-l md:border-t-0 md:px-9 md:py-0 md:animate-[slideIn_.4s_ease]">
          {/* grab handle (mobile only) */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 md:hidden" />
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              active.kind === "outcome"
                ? "bg-amber-300/15 text-amber-200"
                : "bg-emerald/15 text-emerald-soft"
            }`}
          >
            {active.kind === "outcome" ? "★ Outcome" : "◆ Feature"}
          </span>
          <h2 className="mt-4 font-sora text-2xl font-bold md:text-3xl">{active.name}</h2>
          <p className="mt-2 text-base font-semibold text-emerald-soft md:text-lg">
            {active.blurb}
          </p>
          <p className="mt-4 leading-relaxed text-[#cfe3da]">{active.detail}</p>
          <button
            onClick={() => setSelected(null)}
            className="mt-7 w-fit rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition hover:border-emerald hover:text-white md:mt-8"
          >
            ← Back to planet
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes sheetUp {
          from {
            transform: translateY(60px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
