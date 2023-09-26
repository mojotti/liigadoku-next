import {
  GameStats,
  GuessStatsContextProvider,
  TeamPairGuesses,
} from "@/context/GuessStats";
import { App } from "./App";
import {
  LiigadokuOfTheDay,
  PlayerShortVersion,
  TeamPairPlayers,
} from "@/types";
import { getRestAPI } from "@/utils/base-url";

export type InitialData = {
  players: PlayerShortVersion[];
  dokuOfTheDay: LiigadokuOfTheDay;
  answers: Record<
    string,
    {
      person: string;
    }[]
  >;
  gameStats: GameStats;
};

const initialDoku: LiigadokuOfTheDay = {
  date: "-",
  xTeams: [],
  yTeams: [],
};

export const runtime = "edge";

async function getInitialData() {
  "use server";
  const response = await fetch(`${getRestAPI()}/players/all`, {
    next: { revalidate: 24 * 60 * 60 },
  });
  const result = await response.json();

  const players = (result?.players ?? []) as PlayerShortVersion[];
  console.log({ playerslen: players.length });

  const dokuResponse = await fetch(`${getRestAPI()}/liigadoku-of-the-day`, {
    next: { revalidate: 10 * 60 },
  });
  const dokuJson = (await dokuResponse.json()) ?? initialDoku;

  const urlDate = dokuJson.date.replaceAll(".", "-");

  const answersResp = await fetch(
    `${getRestAPI()}/players/team-pairs/by-date/${urlDate}`,
    {
      next: { revalidate: 12 * 60 * 60 },
    }
  );

  const answers = await answersResp.json();

  return {
    players,
    dokuOfTheDay: dokuJson,
    answers,
  };
}

export default async function Home() {
  const initialData = await getInitialData();
  return (
    <GuessStatsContextProvider>
      <App initialData={initialData} />
    </GuessStatsContextProvider>
  );
}
