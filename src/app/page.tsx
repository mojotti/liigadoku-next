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

const formMatchUps = (doku: LiigadokuOfTheDay) =>
  doku.xTeams
    .map((xTeam, i) =>
      doku.yTeams.map((yTeam, j) => ({
        key: `xTeam${i}yTeam${j}`,
        teams: [xTeam, yTeam].sort(),
      }))
    )
    .flat();

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
  const response = await fetch(`${process.env.REST_API_ENDPOINT}/players/all`, {
    next: { revalidate: 24 * 60 * 60 },
  });
  const result = await response.json();

  const players = (result?.players ?? []) as PlayerShortVersion[];

  const dokuResponse = await fetch(
    `${process.env.REST_API_ENDPOINT}/liigadoku-of-the-day`,
    {
      next: { revalidate: 10 * 60 },
    }
  );
  const dokuJson = (await dokuResponse.json()) ?? initialDoku;

  const matchUps = formMatchUps(dokuJson);

  const promises = matchUps.map((matchUp) => {
    const teams = matchUp.teams.join("-");

    return fetch(
      `${process.env.REST_API_ENDPOINT}/players/team-pairs/${teams}`,
      {
        next: { revalidate: 12 * 60 * 60 },
      }
    );
  });

  const respsRaw = await Promise.all(promises);

  const resps = (await Promise.all(
    respsRaw.map((resp) => resp.json())
  )) as TeamPairPlayers[];

  const answers: Record<string, { person: string }[]> = {};
  resps.forEach((resp) => {
    answers[resp.teamPair] = resp.players;
  });

  const date = dokuJson.date;

  if (!date) {
    console.error("no date");
    return {
      players,
      dokuOfTheDay: dokuJson,
      answers,
      gameStats: {},
    };
  }

  const urlDate = date.replaceAll(".", "-");
  const guessesResponse = await fetch(
    `${process.env.REST_API_ENDPOINT}/guesses/by-date/${urlDate}`,
    {
      next: { revalidate: 15 },
    }
  );
  const guessesResult = (await guessesResponse.json()) as TeamPairGuesses[];

  const gameStats: Record<string, TeamPairGuesses | undefined> = {};

  guessesResult.forEach((r) => {
    const key = `${r.teamPair}-${date}`;
    gameStats[key] = r;
  });

  return {
    players,
    dokuOfTheDay: dokuJson,
    answers,
    gameStats,
  };
}

export default async function Home() {
  const { gameStats, ...rest } = await getInitialData();
  return (
    <GuessStatsContextProvider gameStats={gameStats}>
      <App initialData={rest} />
    </GuessStatsContextProvider>
  );
}
