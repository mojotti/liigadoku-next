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
  const response = await fetch(`${getRestAPI()}/players/all`, {
    next: { revalidate: 24 * 60 * 60 },
  });
  const result = await response.json();

  const players = (result?.players ?? []) as PlayerShortVersion[];
  console.log({ playerslen: players.length });

  const dokuResponse = await fetch(
    `${getRestAPI()}/liigadoku-of-the-day`,
    {
      next: { revalidate: 10 * 60 },
    }
  );
  const dokuJson = (await dokuResponse.json()) ?? initialDoku;

  console.log({ dokuJson });

  const matchUps = formMatchUps(dokuJson);

  const promises = matchUps.map((matchUp) => {
    const teams = matchUp.teams.join("-");

    const teamPairUrl = `${getRestAPI()}/players/team-pairs/${teams}`;
    console.log({ teamPairUrl });
    return fetch(teamPairUrl, {
      next: { revalidate: 12 * 60 * 60 },
    });
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
    };
  }

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
