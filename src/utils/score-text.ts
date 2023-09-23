import { GameState, Score } from "@/app/App";
import { LiigadokuOfTheDay } from "@/types";

const getIcon = (status: boolean) => (status ? "🟩" : "🟥");

export const formatScoreText = (
  gameState: GameState,
  score: Score,
  uniquenessPercentage: number,
  doku?: LiigadokuOfTheDay
) => {
  return `Liigadoku ${doku?.date}.
  
Sain oikein ${score.correctAnswers}/${score.guesses}! 🏒🚨

${getIcon(gameState["0-0"].status)}${getIcon(gameState["1-0"].status)}${getIcon(
    gameState["2-0"].status
  )}  
${getIcon(gameState["0-1"].status)}${getIcon(gameState["1-1"].status)}${getIcon(
    gameState["2-1"].status
  )}  
${getIcon(gameState["0-2"].status)}${getIcon(gameState["1-2"].status)}${getIcon(
    gameState["2-2"].status
  )}

Ainutlaatuisuus: ${uniquenessPercentage.toFixed(
    uniquenessPercentage < 1 ? 1 : 0
  )}%

Käy kokeilemassa omia taitojasi: https://www.liigadoku.com`;
};
