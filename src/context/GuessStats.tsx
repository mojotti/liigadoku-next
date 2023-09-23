"use client";
import { PlayerShortVersion } from "@/types";
import { getRestAPI } from "@/utils/base-url";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

export type Stats = {
  isCorrect: boolean;
  person: string;
  name: string;
  numOfGuesses: number;
};

export type TeamPairGuesses = {
  guessedPlayers: Record<string, Stats>;
  date: string;
  totalGuesses: number;
  teamPair: string;
};

export type PutGuessParams = {
  date?: string;
  teamPair: string;
  guessedPlayer: PlayerShortVersion;
  isCorrect: boolean;
  gameId?: string;
};

interface ContextProps {
  stats: Record<string, TeamPairGuesses | undefined>;
  putGuess: ({
    date,
    teamPair,
    guessedPlayer,
    isCorrect,
    gameId,
  }: PutGuessParams) => Promise<void>;
  getStats: (date: string) => Promise<void>;
  isLoadingStats: boolean;
}

const GuessStatsContext = createContext<ContextProps>({
  stats: {},
  putGuess: (...args: any[]) => Promise.resolve(),
  getStats: (date: string) => Promise.resolve(),
  isLoadingStats: true,
});

const updateStats = (
  prev: Record<string, TeamPairGuesses | undefined>,
  key: string,
  guessedPlayer: PlayerShortVersion,
  isCorrect: boolean
) => {
  const item = prev[key];

  if (!item) {
    return prev;
  }

  const newItem = {
    ...item,
    guessedPlayers: {
      ...(item?.guessedPlayers ?? {}),
      [guessedPlayer.person]: {
        name: guessedPlayer.name,
        person: guessedPlayer.person,
        isCorrect: isCorrect,
        numOfGuesses:
          (item?.guessedPlayers[guessedPlayer.person]?.numOfGuesses || 0) + 1,
      },
    },
    totalGuesses: (item?.totalGuesses || 0) + 1,
  };
  return {
    ...prev,
    [key]: newItem,
  };
};

export type GameStats = Record<string, TeamPairGuesses | undefined>;

export const GuessStatsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [stats, setStats] = React.useState<
    Record<string, TeamPairGuesses | undefined>
  >({});
  const [isLoadingStats, setLoadingStats] = React.useState(true);

  const getStats = useCallback(async (date: string) => {
    const urlDate = date.replaceAll(".", "-");
    const guessesResponse = await fetch(
      `${getRestAPI()}/guesses/by-date/${urlDate}`
    );

    const guessesResult = (await guessesResponse.json()) as TeamPairGuesses[];

    const stats: Record<string, TeamPairGuesses | undefined> = {};

    guessesResult.forEach((r) => {
      const key = `${r.teamPair}-${date}`;
      stats[key] = r;
    });

    setStats(stats);
    setLoadingStats(false);
  }, []);

  const putGuess = async ({
    date,
    teamPair,
    guessedPlayer,
    isCorrect,
    gameId,
  }: {
    date?: string;
    teamPair: string;
    guessedPlayer: PlayerShortVersion;
    isCorrect: boolean;
    gameId?: string;
  }) => {
    if (!date) {
      console.error("No date provided, cannot report!");
      return;
    }

    if (!gameId) {
      console.error("No gameId provided, cannot report!");
      return;
    }

    const key = `${teamPair}-${date}`;

    setStats((prev) => updateStats(prev, key, guessedPlayer, isCorrect));
  };

  return (
    <GuessStatsContext.Provider value={{ getStats, putGuess, stats, isLoadingStats }}>
      {children}
    </GuessStatsContext.Provider>
  );
};

export const useGuessStatsContext = () => {
  const context = useContext(GuessStatsContext);

  if (!context) throw new Error("Missing GuessStatsContext");

  return context;
};
