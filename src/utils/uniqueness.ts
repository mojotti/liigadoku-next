import { Local } from "@/app/App";
import { TeamPairGuesses } from "@/context/GuessStats";
import { LiigadokuOfTheDay } from "@/types";

export const getUniqueness = (
  local: Local,
  dokuOfTheDay: LiigadokuOfTheDay,
  stats: Record<string, TeamPairGuesses | undefined>
): number => {
  const uniquenessTotal = Object.values(local.gameState).reduce((acc, curr) => {
    const key = `${curr.teamPair}-${dokuOfTheDay.date}`;
    const statsItem = stats[key];
    if (curr.status === false) {
      return acc + 100;
    }

    const numOfGuesses =
      statsItem?.guessedPlayers?.[curr.person]?.numOfGuesses || 0;

    const total = statsItem?.totalGuesses ?? 1;

    const percentage = (numOfGuesses / total) * 100;
    // console.log({ percentage, cur: curr.name });

    return acc + percentage;
  }, 0);
  // console.log({ uniquenessTotal, guesses: local.score.guesses });
  return uniquenessTotal / local.score.guesses;
};
