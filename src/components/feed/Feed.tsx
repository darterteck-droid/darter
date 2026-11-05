"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Bookmark, Check, Heart, MessageCircle, Music2, Send } from "lucide-react";
import { useRef, useState } from "react";
import { SCENES } from "@/components/reel/scenes";
import BlobMark from "@/components/ui/BlobMark";
import { FEED, type FeedItem } from "@/lib/content";
import { sfx } from "@/lib/sfx";
import { addViews, unlock } from "@/lib/views";

type HeartPop = { id: number; x: number; y: number; tilt: number };

// The doom scroll, from the inside. Each stretch of page scroll swipes the phone to the next short.
export default function Feed() {
  const section = useRef<HTMLElement>(null);
  const current = useRef(0);
  const seen = useRef(new Set<number>([0]));
  const uid = useRef(0);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [watched, setWatched] = useState(1);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [hearts, setHearts] = useState<HeartPop[]>([]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(FEED.length - 1, Math.max(0, Math.floor(p * FEED.length * 0.999)));
    if (next === current.current) return;
    setDir(next > current.current ? 1 : -1);
    current.current = next;
    setIndex(next);
    sfx.whoosh();
    if (!seen.current.has(next)) {
      seen.current.add(next);
      setWatched(seen.current.size);
      addViews(150);
      if (seen.current.size === FEED.length) unlock("doom-scroller");
    }
  });

  const item = FEED[index];

  const like = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++uid.current;
    setHearts((list) => [...list.slice(-5), { id, x: e.clientX - r.left, y: e.clientY - r.top, tilt: Math.random() * 40 - 20 }]);
    window.setTimeout(() => setHearts((list) => list.filter((h) => h.id !== id)), 900);
    sfx.pop();
    if (!liked[item.id]) {
      setLiked((all) => ({ ...all, [item.id]: true }));
      addViews(100, { x: e.clientX, y: e.clientY, label: "Liked" });
      unlock("double-tap");
    }
  };

  const done = watched === FEED.length;

  return (
    <section
      id="feed"
      ref={section}
      className="relative"
      style={{ height: `calc(100svh + ${FEED.length * 62}svh)` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,170,90,0.16),transparent_55%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(91,120,255,0.14),transparent_50%)]" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-5 px-4 pt-16 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:pt-10">
          {/* Copy */}
          <div className="w-full text-center lg:text-left">
            <div className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-gold lg:block">The feed</div>
            <h2 className="font-display text-[9vw] font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:mt-4 lg:text-[5.6rem]">
              Just <span className="text-chroma pr-[0.1em] font-serif font-semibold normal-case italic tracking-[-0.03em]">one more.</span>
            </h2>
            <p className="mx-auto mt-5 hidden max-w-sm text-lg leading-relaxed text-mist lg:mx-0 lg:block">
              This is what the doom scroll feels like from the inside. Keep scrolling. Tap the screen if you like one. We&apos;ll
              wait.
            </p>
            <div className="mt-3 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mist lg:mt-8">
              <span>
                Watched <span className="tabular-nums text-paper">{String(watched).padStart(2, "0")}</span> /{" "}
                {String(FEED.length).padStart(2, "0")}
              </span>
              <span className="relative h-[3px] w-20 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="bg-chroma absolute inset-y-0 left-0 rounded-full"
                  animate={{ width: `${(watched / FEED.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                />
              </span>
            </div>
            <AnimatePresence>
              {done && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 hidden font-serif text-xl italic text-gold lg:block"
                >
                  That&apos;s the whole feed. You could scroll back up. You want to.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* The phone */}
          <div className="relative shrink-0">
            <div className="rounded-[46px] border border-white/15 bg-[#04060b] p-2 shadow-[0_60px_140px_-30px_rgba(255,170,90,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:p-2.5">
              <div
                onClick={like}
                data-cursor="Like"
                className="phone-screen relative aspect-[9/16] overflow-hidden rounded-[38px] bg-ink-3"
              >
                <AnimatePresence initial={false} custom={dir}>
                  <motion.div
                    key={index}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%" }),
                      center: { y: "0%" },
                      exit: (d: number) => ({ y: d > 0 ? "-100%" : "100%" }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 240, damping: 32 }}
                    className="absolute inset-0"
                  >
                    <Screen item={item} />
                  </motion.div>
                </AnimatePresence>

                {/* App chrome */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/2 top-2.5 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
                  <div className="absolute inset-x-0 top-10 flex justify-center gap-5 text-[13px] font-semibold text-white/60">
                    <span>Following</span>
                    <span className="relative text-white">
                      For You
                      <span className="absolute -bottom-1.5 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-white" />
                    </span>
                  </div>

                  <div className="absolute bottom-24 right-2.5 flex flex-col items-center gap-4 text-white">
                    <div className="relative mb-1">
                      <BlobMark className="h-10 w-10 rounded-full border-2 border-white bg-ink" />
                      <span className="absolute -bottom-2 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-rose text-[11px] font-bold leading-none text-white">
                        +
                      </span>
                    </div>
                    <motion.span
                      key={`${item.id}-${liked[item.id] ? 1 : 0}`}
                      initial={{ scale: liked[item.id] ? 0.4 : 1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <Heart className={`h-7 w-7 drop-shadow ${liked[item.id] ? "fill-rose text-rose" : ""}`} />
                    </motion.span>
                    <MessageCircle className="h-7 w-7 drop-shadow" />
                    <Bookmark className="h-7 w-7 drop-shadow" />
                    <Send className="h-6 w-6 drop-shadow" />
                    <span className="a-spin flex h-9 w-9 items-center justify-center rounded-full bg-[conic-gradient(#222,#555,#222,#555,#222)] ring-4 ring-black/40">
                      <span className="h-3.5 w-3.5 rounded-full bg-gold" />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 pr-16 pt-16 text-white">
                    <div className="text-[14px] font-bold">@darter</div>
                    <p className="mt-1 text-[12.5px] leading-snug text-white/90">
                      {item.caption}{" "}
                      {item.tags.map((t) => (
                        <span key={t} className="font-semibold">
                          #{t.replace(/\s+/g, "")}{" "}
                        </span>
                      ))}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 overflow-hidden text-[11.5px] text-white/85">
                      <Music2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="whitespace-nowrap">original sound · DARTER · {item.title}</span>
                    </div>
                  </div>

                  {/* Swipe hint on the first one */}
                  <AnimatePresence>
                    {index === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.6 } }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 top-[38%] flex flex-col items-center text-white"
                      >
                        <motion.span
                          animate={{ y: [12, -12, 12], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                          className="text-3xl"
                        >
                          ↑
                        </motion.span>
                        <span className="rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur">
                          Keep scrolling
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {hearts.map((h) => (
                    <motion.span
                      key={h.id}
                      className="absolute -ml-10 -mt-10"
                      style={{ left: h.x, top: h.y }}
                      initial={{ scale: 0.2, opacity: 0, rotate: h.tilt }}
                      animate={{ scale: [0.2, 1.25, 1], opacity: [0, 1, 0], y: -60 }}
                      transition={{ duration: 0.85, times: [0, 0.3, 1] }}
                    >
                      <Heart className="h-20 w-20 fill-rose text-rose drop-shadow-[0_6px_20px_rgba(255,122,143,0.7)]" />
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Up next, on wide screens */}
          <ol className="hidden w-full max-w-xs justify-self-end lg:block">
            {FEED.map((f, i) => {
              const on = i === index;
              const was = i < index;
              return (
                <li key={f.id} className="relative flex items-center gap-4 py-2.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] tabular-nums transition-colors ${
                      on ? "border-gold bg-gold text-ink" : was ? "border-white/20 text-mist" : "border-white/10 text-dim"
                    }`}
                  >
                    {was ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`transition-all duration-300 ${on ? "font-serif text-2xl italic text-paper" : "text-sm text-dim"}`}>
                    {f.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Screen({ item }: { item: FeedItem }) {
  if (item.video && item.vertical) {
    return (
      <video
        src={item.video}
        poster={item.poster}
        className="absolute inset-0 h-full w-full bg-black object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-label={item.title}
      />
    );
  }
  if (item.video) {
    return (
      <div className="absolute inset-0 bg-black">
        {item.poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.poster} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl" />
        )}
        <video
          src={item.video}
          poster={item.poster}
          className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
          autoPlay
          muted
          loop
          playsInline
          aria-label={item.title}
        />
      </div>
    );
  }
  const Scene = item.scene ? SCENES[item.scene] : null;
  return (
    <div className="absolute inset-0">
      {Scene && <Scene />}
      <div className="film-grade absolute inset-0" />
      <div className="vignette absolute inset-0 opacity-60" />
    </div>
  );
}
