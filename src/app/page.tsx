"use server";
import { GuessStatsContextProvider } from "@/context/GuessStats";
import { App } from "./App";
import {
  LiigadokuOfTheDay,
  PlayerShortVersion,
  TeamPairPlayers,
} from "@/types";
import { restAPI } from "@/utils/base-url";

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
  gameId: string;
};

async function getInitialData() {
  const response = await fetch(`${restAPI()}players/all`, {
    next: { revalidate: 24 * 3600 },
  });
  const result = await response.json();

  const players = (result?.players ?? []) as PlayerShortVersion[];

  const dokuResponse = await fetch(`${restAPI()}liigadoku-of-the-day`, {
    next: { revalidate: 3600 },
  });
  const dokuJson = await dokuResponse.json();

  const matchUps = formMatchUps(dokuJson);

  const promises = matchUps.map((matchUp) => {
    const teams = matchUp.teams.join("-");

    return fetch(`${restAPI()}players/team-pairs/${teams}`, {
      next: { revalidate: 3600 },
    });
  });

  const urlDate = dokuJson.date.replaceAll(".", "-");
  const gameIdRequest = fetch(`${restAPI()}games/new/${urlDate}`);

  const [gameIdResponse, ...respsRaw] = await Promise.all([
    gameIdRequest,
    ...promises,
  ]);

  const gameId = (await gameIdResponse.json()).gameId;
  const resps = (await Promise.all(
    respsRaw.map((resp) => resp.json())
  )) as TeamPairPlayers[];

  const answers: Record<string, { person: string }[]> = {};
  resps.forEach((resp) => {
    answers[resp.teamPair] = resp.players;
  });

  return {
    players,
    dokuOfTheDay: dokuJson,
    answers,
    gameId,
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
