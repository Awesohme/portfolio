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

/** an organic, irregular landmass outline as a flat THREE.Shape */
function makeContinentShape(rng: () => number) {
  const pts = 9 + Math.floor(rng() * 4);
  const base = 0.32 + rng() * 0.16;
  const shape = new THREE.Shape();
  const radii: number[] = [];
  for (let i = 0; i < pts; i++) radii.push(base * (0.55 + rng() * 0.9));
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const r = radii[i % pts];
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * (0.7 + rng() * 0.5);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return shape;
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

  // seeded, randomized continent layout — distinct per project, stable across renders
  const layout = useMemo(() => {
    const n = project.continents.length;
    return project.continents.map((_, i) => {
      const { lat, lng } = continentLatLng(project.slug, i, n);
      const v = latLngToVec(lat, lng, R);
      const normal = v.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      const rng = makeRng(`${project.slug}-shape-${i}`);
      // randomize spin of the landmass on the surface
      const spin = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        rng() * Math.PI * 2
      );
      quat.multiply(spin);
      const shape = makeContinentShape(rng);
      const geometry = new THREE.ShapeGeometry(shape, 24);
      const scale = 0.85 + rng() * 0.7;
      return { v, quat, geometry, scale };
    });
  }, [project]);

  return (
    <group ref={group}>
      {/* ocean / base */}
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.85}
          metalness={0.1}
          emissive={baseColor}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshBasicMaterial
          color={project.planet.atmosphere}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* continents = features/outcomes */}
      {project.continents.map((c, i) => {
        const { v, quat, geometry, scale } = layout[i];
        const surf = v.clone().normalize().multiplyScalar(R * 1.002);
        const isActive = hover === i || selectedIdx === i;
        return (
          <group key={i}>
            {/* organic landmass */}
            <mesh
              geometry={geometry}
              position={surf.toArray()}
              quaternion={quat}
              scale={isActive ? scale * 1.12 : scale}
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
                emissiveIntensity={isActive ? 1.1 : 0.45}
                roughness={0.6}
                transparent
                opacity={0.96}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* marker pin + label */}
            <Html position={v.clone().multiplyScalar(1.16).toArray()} center distanceFactor={8}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(i);
                }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`pointer-events-auto whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur transition ${
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
          </group>
        );
      })}
    </group>
  );
}

function CameraRig({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  const home = useMemo(() => new THREE.Vector3(0, 0, 6), []);
  useFrame(() => {
    const dest = target ? target.clone().normalize().multiplyScalar(4.2) : home;
    camera.position.lerp(dest, 0.06);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Planet({ project }: { project: Project }) {
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
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.6} color="#d8fff0" />
          <pointLight position={[-6, -2, -4]} intensity={0.6} color={project.planet.atmosphere} />
          <Stars radius={80} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />
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
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1 text-xs text-emerald-soft"
            >
              {s}
            </span>
          ))}
        </div>
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

      {/* detail panel */}
      {active && (
        <div className="absolute right-0 top-0 z-20 flex h-full w-full max-w-md flex-col justify-center border-l border-white/10 bg-black/70 px-9 backdrop-blur-xl animate-[slideIn_.4s_ease]">
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              active.kind === "outcome"
                ? "bg-amber-300/15 text-amber-200"
                : "bg-emerald/15 text-emerald-soft"
            }`}
          >
            {active.kind === "outcome" ? "★ Outcome" : "◆ Feature"}
          </span>
          <h2 className="mt-4 font-sora text-3xl font-bold">{active.name}</h2>
          <p className="mt-2 text-lg font-semibold text-emerald-soft">{active.blurb}</p>
          <p className="mt-4 leading-relaxed text-[#cfe3da]">{active.detail}</p>
          <button
            onClick={() => setSelected(null)}
            className="mt-8 w-fit rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition hover:border-emerald hover:text-white"
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
      `}</style>
    </div>
  );
}
