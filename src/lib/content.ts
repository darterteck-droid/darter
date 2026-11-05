// All the words on the page live here so they're easy to edit.

export type SceneKey = "race" | "hustle" | "patrol" | "cut" | "hut" | "maze";

export type Short = {
  ep: string;
  title: string;
  tags: string[];
  scene: SceneKey;
  /** Drop a real episode in /public and point at it here. It replaces the drawn scene. */
  video?: string;
  tilt: number;
};

export const SHORTS: Short[] = [
  { ep: "01", title: "Last to First", tags: ["come-up", "racing"], scene: "race", tilt: -2 },
  { ep: "02", title: "Penny to Penthouse", tags: ["come-up", "hustle"], scene: "hustle", tilt: 1.5 },
  { ep: "03", title: "Night Patrol", tags: ["hero", "action"], scene: "patrol", tilt: -1 },
  { ep: "04", title: "Fresh Cut", tags: ["satisfying", "asmr"], scene: "cut", tilt: 2 },
  { ep: "05", title: "The Hut", tags: ["satisfying", "build"], scene: "hut", tilt: -1.5 },
  { ep: "06", title: "Outrun", tags: ["maze", "thriller"], scene: "maze", tilt: 1 },
];

export const CONTACT_EMAIL = "darterteck@gmail.com";

export const FILM = {
  src: "/films/glow-up.mp4",
  poster: "/films/glow-up-poster.jpg",
  title: "The Glow-Up",
  kind: "Client film · Med spa",
  length: "0:45",
};

export type Beat = { id: string; at: number; label: string; name: string; still: string; body: string };

// The six beats of the glow-up film. `at` is seconds into the film.
export const BEATS: Beat[] = [
  {
    id: "hook",
    at: 0,
    label: "Hook",
    name: "The snub",
    still: "/films/beats/hook.jpg",
    body: "Two frenemies, one whisper. Three seconds in and you already want her to win.",
  },
  {
    id: "fall",
    at: 7.3,
    label: "Fall",
    name: "The crack",
    still: "/films/beats/fall.jpg",
    body: "Rock bottom in a cracked mirror. Now you can't leave.",
  },
  {
    id: "turn",
    at: 12.4,
    label: "Turn",
    name: "The card",
    still: "/films/beats/turn.jpg",
    body: "A stranger slides a business card across the table. Hope, on a café table.",
  },
  {
    id: "glow",
    at: 29.8,
    label: "Glow-up",
    name: "The mirror",
    still: "/films/beats/glow.jpg",
    body: "Same mirror, new woman. The moment the whole film was built for.",
  },
  {
    id: "payoff",
    at: 31.6,
    label: "Payoff",
    name: "The double take",
    still: "/films/beats/payoff.jpg",
    body: "She walks past the frenemies. Jaws, meet floor.",
  },
  {
    id: "loop",
    at: 39.6,
    label: "Loop",
    name: "The iris",
    still: "/films/beats/loop.jpg",
    body: "Out on the brand. Back to the top. You watch it again.",
  },
];

// The satisfying short that plays beside The Slice.
export const REAL_THING = {
  title: "Glass Fruit",
  caption: "Glass strawberries, a glass lime, a glass peach. Wait for the lime.",
  video: "/films/glass-fruit.mp4",
  poster: "/films/glass-fruit-poster.jpg",
};

export type FeedItem = {
  id: string;
  title: string;
  caption: string;
  tags: string[];
  /** A real film. Landscape films sit in the middle like a feed shows them; vertical ones fill the screen. */
  video?: string;
  poster?: string;
  vertical?: boolean;
  /** Otherwise a drawn placeholder episode. */
  scene?: SceneKey;
};

export const FEED: FeedItem[] = [
  {
    id: "glow-up",
    title: "The Glow-Up",
    caption: "She wasn't invited to win. Watch till the end.",
    tags: ["glow-up", "client film"],
    video: FILM.src,
    poster: FILM.poster,
  },
  {
    id: "glass-fruit",
    title: "Glass Fruit",
    caption: "Wait for the lime. Then try to stop watching.",
    tags: ["satisfying", "asmr"],
    video: REAL_THING.video,
    poster: REAL_THING.poster,
    vertical: true,
  },
  {
    id: "the-wallet",
    title: "The Wallet",
    caption: "He could've kept it. Watch what happens when he doesn't.",
    tags: ["hero", "kindness"],
    video: "/films/the-wallet.mp4",
    poster: "/films/the-wallet-poster.jpg",
    vertical: true,
  },
];

export const MARQUEE_TOP = ["Glow-ups", "Come-ups", "Hero stories", "Fruit cuts", "Jungle builds", "Posted daily"];

export const MARQUEE_BOTTOM = ["Not slop", "Stop the thumb", "Hook", "Turn", "Payoff", "Watch again"];

export type EngineStage = "write" | "animate" | "post" | "learn";

export const PIPELINE: { id: EngineStage; title: string; body: string }[] = [
  { id: "write", title: "Write", body: "A hook for the first second, a turn in the middle, a payoff worth the wait." },
  { id: "animate", title: "Animate", body: "Movie-quality 3D. Same characters, on model, episode after episode." },
  { id: "post", title: "Post", body: "Shorts, Reels and TikTok. Every day, on schedule, without being asked." },
  { id: "learn", title: "Learn", body: "It reads what held attention and makes tomorrow's one hit harder." },
];

// What the engine console prints, on a loop.
export const ENGINE_LOG: { stage: EngineStage; text: string }[] = [
  { stage: "write", text: "Hook drafted: \"She wasn't invited.\"" },
  { stage: "write", text: "Beats locked: hook, fall, turn, glow-up, payoff, loop" },
  { stage: "animate", text: "Scene 03 of 12 · blue hour · cracked mirror" },
  { stage: "animate", text: "Scene 07 of 12 · golden hour · the card" },
  { stage: "animate", text: "Character check: on model" },
  { stage: "post", text: "Posted to Shorts" },
  { stage: "post", text: "Posted to Reels" },
  { stage: "post", text: "Posted to TikTok" },
  { stage: "learn", text: "Reading retention on the first two seconds" },
  { stage: "learn", text: "Tightening tomorrow's hook" },
  { stage: "write", text: "Next episode queued" },
];

export const LANES = [
  {
    eyebrow: "For brands",
    title: "Your brand is the turning point.",
    body: "We put your business inside a story people actually finish. Like the business card in the glow-up. Nobody skips the part where things get better.",
  },
  {
    eyebrow: "For faceless accounts",
    title: "No face? We'll make one.",
    body: "We build the character, the world and the posting schedule. The channel is yours. The engine keeps it fed.",
  },
];

export const NOT_SLOP = [
  "Story first. Every short has a hook, a turn and a payoff.",
  "Same characters, on model, episode after episode.",
  "Made to be finished, not just clicked.",
];

export const STATEMENT =
  "Every day the engine writes, animates and posts a story people can't scroll past. Brands get a hero. Faceless accounts get a face.";
export const STATEMENT_HIGHLIGHT = "We control the algorithm.";

// Captions that run along the bottom of the screen, one per section.
export const SUBTITLES: Record<string, string> = {
  top: "You were going to leave in three seconds. Look at you now.",
  slice: "[ very satisfying crunch ]",
  film: "Watch what happens at 0:29.",
  feed: "Just one more. Then you'll stop. Sure.",
  engine: "Meanwhile, the engine posted another one.",
  maze: "[ the Skip bots can smell fear ]",
  statement: "",
  credits: "Roll credits.",
};

// ---------------------------------------------------------------------------
// Retired sections (the 3D hero, the reel, the lab and the old formula list).
// They're not on the page right now but their files still read from here.

export const STEPS = [
  {
    title: "Hook",
    body: "You get one second. The first frame has to stop the thumb, so it does.",
  },
  {
    title: "Story",
    body: "A nobody with a dream. A hero with a problem. Someone you need to see win.",
  },
  {
    title: "Payoff",
    body: "The finish line, the last slice, the roof going on the hut. The moment your brain was waiting for.",
  },
  {
    title: "Loop",
    body: "It ends right where it started, so you watch it again. And again.",
  },
];


// The Lab's logline machine: come-up stories and hero stories.
export const NAME_FIRST = ["Big", "Lil", "Captain", "Turbo", "Professor", "King", "DJ", "Lady", "Mister", "Boss"];
export const NAME_LAST = ["Wobbles", "Pickle", "Noodle", "Biscuit", "Zap", "Mochi", "Hustle", "Sprocket", "Beans", "Blaze"];
export const IDEA_WHO = [
  "A broke",
  "An underdog",
  "A tiny",
  "A nobody",
  "A washed up",
  "A scrappy",
  "A nervous",
  "A brand new",
];
export const IDEA_WHAT = [
  "raccoon",
  "go kart",
  "robot",
  "pigeon",
  "street cat",
  "mech pilot",
  "snail",
  "lemon",
  "builder",
  "toaster",
];
export const IDEA_GOAL = [
  "who goes from last place to first.",
  "who turns five bucks into an empire.",
  "who has to save the city by sunrise.",
  "who builds a house from nothing but sticks.",
  "who wins the race nobody thought they could.",
  "who escapes the maze before the walls close.",
  "who becomes the main character overnight.",
  "who proves the whole block wrong.",
];
