import Intro from "@/components/fx/Intro";
import Navbar from "@/components/layout/Navbar";
import FilmHero from "@/components/film/FilmHero";
import Marquee from "@/components/sections/Marquee";
import FruitSlice from "@/components/slice/FruitSlice";
import Anatomy from "@/components/film/Anatomy";
import Feed from "@/components/feed/Feed";
import Engine from "@/components/sections/Engine";
import MazeGame from "@/components/maze/MazeGame";
import Statement from "@/components/sections/Statement";
import Footer from "@/components/layout/Footer";
import GameHUD from "@/components/fx/GameHUD";
import Subtitles from "@/components/fx/Subtitles";

export default function Home() {
  return (
    <main>
      <Intro />
      <Navbar />
      <FilmHero />
      <Marquee />
      <FruitSlice />
      <Anatomy />
      <Feed />
      <Engine />
      <MazeGame />
      <Statement />
      <Footer />
      <Subtitles />
      <GameHUD />
    </main>
  );
}
