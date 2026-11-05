"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  MeshDistortMaterial,
  RoundedBox,
} from "@react-three/drei";
import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { setCursorLabel } from "@/lib/intro";

const QUIPS: Record<number, string> = {
  1: "hi!",
  3: "hehe",
  5: "wheee",
  8: "that tickles",
  12: "again!",
  20: "best friends now",
  35: "ok you're my favorite",
  50: "we should make a show",
};

const BODY = "#ff6fb8";
const BODY_DARK = "#e04f9d";
const INK = "#140a22";

type BoopHandler = (clientX: number, clientY: number) => void;

type SceneProps = {
  eventSource: RefObject<HTMLElement | null>;
  boops: number;
  onBoop: BoopHandler;
  play: boolean;
};

export default function HeroScene({ eventSource, boops, onBoop, play }: SceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering once the hero scrolls away.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        eventSource={eventSource as RefObject<HTMLElement>}
        eventPrefix="client"
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 6, 5]} intensity={2.4} color="#fff1e8" />
        <pointLight position={[-4, 2.5, -1.5]} intensity={40} color="#4df3ff" />
        <pointLight position={[4.5, -0.5, 2.5]} intensity={22} color="#ff5fd2" />

        <Dot boops={boops} onBoop={onBoop} play={play} />
        <Toys play={play} />

        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, -4]} scale={[10, 4, 1]} />
          <Lightformer form="circle" intensity={4} position={[-5, 1, 3]} scale={3} color="#4df3ff" />
          <Lightformer form="circle" intensity={4} position={[5, 1.5, 3]} scale={3} color="#ff5fd2" />
          <Lightformer form="rect" intensity={1.5} position={[0, -4, 2]} scale={[10, 2, 1]} color="#8b6cff" />
        </Environment>
      </Canvas>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dot: the studio mascot. Squash, stretch, blinks, watches your cursor.
// ---------------------------------------------------------------------------

function usePointer() {
  const pointer = useRef({ x: 0, y: 0, last: -10_000 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.current.last = performance.now();
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function Dot({ boops, onBoop, play }: { boops: number; onBoop: BoopHandler; play: boolean }) {
  const { size } = useThree();
  const mobile = size.width < 640;
  const scale = mobile ? 0.6 : size.width < 1024 ? 0.72 : 0.8;

  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const eyeL = useRef<THREE.Group>(null!);
  const eyeR = useRef<THREE.Group>(null!);
  const armL = useRef<THREE.Group>(null!);
  const armR = useRef<THREE.Group>(null!);
  const antenna = useRef<THREE.Group>(null!);
  const smile = useRef<THREE.Mesh>(null!);
  const gasp = useRef<THREE.Mesh>(null!);

  const pointer = usePointer();
  const sim = useRef({
    started: false,
    y: 0,
    vy: 0,
    squash: 0,
    squashV: 0,
    ant: 0,
    antV: 0,
    arms: 0,
    spin: 0,
    spinTarget: 0,
    blinkAt: 1.2,
    shock: 0,
    lookX: 0,
    lookY: 0,
    nextHop: 6,
  });

  const [quip, setQuip] = useState<string | null>(null);
  const quipTimer = useRef(0);
  useEffect(() => () => clearTimeout(quipTimer.current), []);

  const boop = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const s = sim.current;
    if (!s.started) return;
    s.vy = 5.6;
    s.squashV -= 5;
    s.shock = 0.65;
    s.antV += 9;
    const next = boops + 1;
    if (next % 5 === 0) s.spinTarget += Math.PI * 2;
    if (QUIPS[next]) {
      setQuip(QUIPS[next]);
      clearTimeout(quipTimer.current);
      quipTimer.current = window.setTimeout(() => setQuip(null), 1600);
    }
    onBoop(e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const s = sim.current;

    // Drop in from above once the intro lifts.
    if (!play) {
      root.current.visible = false;
      return;
    }
    if (!s.started) {
      s.started = true;
      s.y = 4.5;
      s.vy = 0;
      s.nextHop = t + 7;
      root.current.visible = true;
    }

    // Idle hop now and then, so he never feels like a statue.
    if (t > s.nextHop && s.y === 0) {
      s.vy = 3.2;
      s.nextHop = t + 6 + Math.random() * 5;
    }

    // Jump physics.
    const prevVy = s.vy;
    s.vy -= 17 * dt;
    s.y += s.vy * dt;
    if (s.y <= 0) {
      if (prevVy < -2) {
        s.squashV += -prevVy * 1.6;
        s.antV -= prevVy * 1.2;
      }
      s.y = 0;
      s.vy = 0;
    }

    // Squash and stretch: positive squashes, negative stretches.
    const airStretch = s.y > 0 ? -Math.min(0.22, Math.abs(s.vy) * 0.035) : 0;
    s.squashV += ((airStretch - s.squash) * 260 - s.squashV * 11) * dt;
    s.squash += s.squashV * dt;
    const breathe = Math.sin(t * 2.4) * 0.018;
    const sy = 1 - s.squash * 0.55 + breathe;
    const sxz = 1 + s.squash * 0.4 - breathe * 0.6;
    body.current.scale.set(sxz, sy, sxz);
    body.current.position.y = s.y;

    // Look at the cursor, or wander when it goes quiet.
    const idle = performance.now() - pointer.current.last > 2500;
    const tx = idle ? Math.sin(t * 0.6) * 0.6 : pointer.current.x;
    const ty = idle ? Math.sin(t * 0.43) * 0.3 : pointer.current.y;
    const prevLook = s.lookX;
    s.lookX += (tx - s.lookX) * Math.min(1, dt * 5);
    s.lookY += (ty - s.lookY) * Math.min(1, dt * 5);
    head.current.rotation.y = s.lookX * 0.55;
    head.current.rotation.x = -s.lookY * 0.28;
    for (const eye of [eyeL.current, eyeR.current]) {
      eye.rotation.y = s.lookX * 0.45;
      eye.rotation.x = -s.lookY * 0.4;
    }

    // Blink every few seconds. Eyes go wide when booped.
    s.shock = Math.max(0, s.shock - dt);
    if (t > s.blinkAt + 0.16) s.blinkAt = t + 2 + Math.random() * 3.5;
    const phase = (t - s.blinkAt) / 0.16;
    const blink = phase >= 0 && phase <= 1 ? Math.sin(phase * Math.PI) * 0.92 : 0;
    const wide = s.shock > 0 ? 1.18 : 1;
    eyeL.current.scale.set(wide, wide * (1 - blink), wide);
    eyeR.current.scale.set(wide, wide * (1 - blink), wide);
    smile.current.visible = s.shock === 0;
    gasp.current.visible = s.shock > 0;

    // Arms fly up when booped, with a little wiggle.
    const armTarget = s.shock > 0 || s.y > 0.3 ? 1 : 0;
    s.arms += (armTarget - s.arms) * Math.min(1, dt * 12);
    const wiggle = Math.sin(t * 22) * 0.18 * s.arms;
    armL.current.rotation.z = -0.55 - s.arms * 1.9 + wiggle;
    armR.current.rotation.z = 0.55 + s.arms * 1.9 - wiggle;

    // Antenna lags behind every move.
    s.antV += (-s.ant * 90 - s.antV * 4.5) * dt + (prevLook - s.lookX) * 30;
    s.ant += s.antV * dt;
    antenna.current.rotation.z = s.ant * 0.5 + Math.sin(t * 1.7) * 0.06;

    // Every fifth boop, a full spin.
    s.spin += (s.spinTarget - s.spin) * Math.min(1, dt * 4.5);
    root.current.rotation.y = s.spin;
  });

  return (
    <group ref={root} scale={scale} position={[0, -1.3 * scale - (mobile ? 0.05 : 0.15), 0]}>
      <ContactShadows position={[0, 0.005, 0]} scale={5} far={3} blur={2.6} opacity={0.6} color="#1a0b2e" />

      <group ref={body}>
        {/* Feet stay outside the head so they don't turn with the look. */}
        <mesh position={[-0.42, 0.1, 0.25]} scale={[1, 0.5, 1.3]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshPhysicalMaterial color={BODY_DARK} roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} />
        </mesh>
        <mesh position={[0.42, 0.1, 0.25]} scale={[1, 0.5, 1.3]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshPhysicalMaterial color={BODY_DARK} roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} />
        </mesh>

        <group
          ref={head}
          position={[0, 1.1, 0]}
          onClick={boop}
          onPointerOver={() => {
            setCursorLabel("Boop");
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setCursorLabel(null);
            document.body.style.cursor = "";
          }}
        >
          {/* Bigger hit area so he's easy to boop on a phone. Hidden meshes still
              catch raycasts but skip rendering, so it casts no contact shadow. */}
          <mesh visible={false}>
            <sphereGeometry args={[1.45, 16, 16]} />
            <meshBasicMaterial />
          </mesh>

          <mesh scale={[1, 1.05, 1]}>
            <sphereGeometry args={[1, 96, 96]} />
            <MeshDistortMaterial
              color={BODY}
              roughness={0.28}
              clearcoat={1}
              clearcoatRoughness={0.08}
              sheen={0.7}
              sheenColor="#ffc6ea"
              iridescence={0.35}
              iridescenceIOR={1.3}
              distort={0.07}
              speed={1.6}
            />
          </mesh>

          <Eye ref={eyeL} position={[-0.35, 0.22, 0.86]} />
          <Eye ref={eyeR} position={[0.35, 0.22, 0.86]} />

          {/* Cheeks */}
          <mesh position={[-0.6, -0.12, 0.76]} rotation={[0, -0.65, 0]} scale={[1, 0.62, 0.3]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial color="#ff2f86" transparent opacity={0.5} roughness={0.7} />
          </mesh>
          <mesh position={[0.6, -0.12, 0.76]} rotation={[0, 0.65, 0]} scale={[1, 0.62, 0.3]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial color="#ff2f86" transparent opacity={0.5} roughness={0.7} />
          </mesh>

          {/* Mouth: a smile, or an "o" when booped */}
          <mesh ref={smile} position={[0, -0.16, 0.985]} rotation={[-0.16, 0, Math.PI]}>
            <torusGeometry args={[0.16, 0.038, 16, 40, Math.PI]} />
            <meshStandardMaterial color={INK} roughness={0.4} />
          </mesh>
          <mesh ref={gasp} position={[0, -0.2, 0.97]} rotation={[-0.2, 0, 0]} scale={[0.8, 1, 0.35]} visible={false}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color={INK} roughness={0.4} />
          </mesh>

          {/* Arms pivot at the shoulder */}
          <group ref={armL} position={[-0.93, -0.25, 0.15]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.11, 0.26, 8, 16]} />
              <meshPhysicalMaterial color={BODY} roughness={0.3} clearcoat={1} />
            </mesh>
          </group>
          <group ref={armR} position={[0.93, -0.25, 0.15]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.11, 0.26, 8, 16]} />
              <meshPhysicalMaterial color={BODY} roughness={0.3} clearcoat={1} />
            </mesh>
          </group>

          {/* Antenna with a glowing tip */}
          <group ref={antenna} position={[0, 1.0, 0]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.028, 0.035, 0.45, 12]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.11, 32, 32]} />
              <meshStandardMaterial color="#ffe14d" emissive="#ffd000" emissiveIntensity={1.6} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {quip && (
        <Html position={[1.15, 2.7, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
            key={quip}
            className="animate-[pop-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2 font-display text-sm font-bold text-ink shadow-[0_10px_30px_rgba(255,95,210,0.45)]"
          >
            {quip}
          </div>
        </Html>
      )}
    </group>
  );
}

type EyeProps = { position: [number, number, number]; ref: RefObject<THREE.Group> };

// Eyeball with iris, pupil and the all-important sparkle. The iris and pupil are
// sphere caps sitting just above the eyeball so they hug its curve as it rotates.
function Eye({ position, ref }: EyeProps) {
  return (
    <group position={position}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.25, 48, 48]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.252, 48, 16, 0, Math.PI * 2, 0, 0.62]} />
          <meshPhysicalMaterial color="#3a2a8c" roughness={0.2} clearcoat={1} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.254, 48, 16, 0, Math.PI * 2, 0, 0.36]} />
          <meshPhysicalMaterial color="#07030f" roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0.06, 0.07, 0.235]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.05, -0.05, 0.245]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Toys: glossy candy shapes floating around the set.
// ---------------------------------------------------------------------------

function Toys({ play }: { play: boolean }) {
  const { viewport, size } = useThree();
  const group = useRef<THREE.Group>(null!);
  const appear = useRef(0);
  const mobile = size.width < 640;
  const w = viewport.width;
  const h = viewport.height;

  useFrame((state, delta) => {
    appear.current = play ? Math.min(1, appear.current + delta * 1.2) : 0;
    const e = 1 - Math.pow(1 - appear.current, 3);
    group.current.scale.setScalar(e);
    // Gentle parallax against the pointer.
    group.current.rotation.y += (state.pointer.x * 0.05 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-state.pointer.y * 0.04 - group.current.rotation.x) * 0.05;
  });

  // Everything stays in the band between the two headline lines. Positions live
  // on each Float so the bobbing spins a toy in place instead of swinging it
  // around the middle of the scene.
  const sx = mobile ? 0.36 : 0.34;
  const float = { floatIntensity: 0.8, floatingRange: [-0.1, 0.1] as [number, number] };

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={2} {...float} position={[-w * sx, h * 0.04, -2]}>
        <mesh scale={mobile ? 0.3 : 0.45}>
          <torusGeometry args={[0.7, 0.3, 32, 64]} />
          <meshPhysicalMaterial color="#4df3ff" roughness={0.15} clearcoat={1} iridescence={0.5} />
        </mesh>
      </Float>
      {/* On desktop the bottom headline sits on the right, so the right-hand toys float up into the sky. */}
      <Float speed={2} rotationIntensity={2.5} {...float} position={mobile ? [w * (sx + 0.1), 0, -2.5] : [w * 0.4, h * 0.22, -2.5]}>
        <mesh scale={mobile ? 0.28 : 0.42}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshPhysicalMaterial color="#ffe14d" roughness={0.2} clearcoat={1} flatShading />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={1.8} {...float} position={[-w * (sx - 0.12), -h * 0.12, -1.4]}>
        <RoundedBox args={[1, 1, 1]} radius={0.22} scale={mobile ? 0.26 : 0.4}>
          <meshPhysicalMaterial color="#8b6cff" roughness={0.18} clearcoat={1} />
        </RoundedBox>
      </Float>
      <Float speed={2.4} rotationIntensity={1} {...float} position={mobile ? [w * (sx - 0.1), -h * 0.1, -1] : [w * 0.27, h * 0.08, -1]}>
        <mesh scale={mobile ? 0.22 : 0.32}>
          <sphereGeometry args={[0.8, 48, 48]} />
          <meshPhysicalMaterial color="#b6ff5c" roughness={0.1} clearcoat={1} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={3} {...float} position={mobile ? [w * 0.47, -h * 0.17, -3.5] : [w * 0.5, h * 0.06, -3.5]}>
        <mesh scale={mobile ? 0.24 : 0.36} rotation={[0.4, 0, 0.6]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 24]} />
          <meshPhysicalMaterial color="#ff5fd2" roughness={0.15} clearcoat={1} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={2} {...float} position={[-w * 0.5, -h * 0.04, -3]}>
        <mesh scale={mobile ? 0.24 : 0.34}>
          <coneGeometry args={[0.6, 1.1, 32]} />
          <meshPhysicalMaterial color="#ff7a59" roughness={0.2} clearcoat={1} />
        </mesh>
      </Float>
    </group>
  );
}
