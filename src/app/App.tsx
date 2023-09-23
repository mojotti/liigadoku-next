"use client";
import React, { useCallback, useEffect } from "react";
import "./App.css";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { PlayerShortVersion } from "@/types";
import { useGuessStatsContext } from "@/context/GuessStats";
import { Header } from "@/components/Header";
import { PlayerList } from "@/components/PlayerList";
import { GameGrid } from "@/components/GameGrid";
import { formatScoreText } from "@/utils/score-text";
import { InitialData } from "./page";
import { useAsync, useLocalStorage } from "react-use";
import { getRestAPI } from "@/utils/base-url";
import { getUniqueness } from "@/utils/uniqueness";
import { ScoreRow } from "@/components/ScoreRow";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export type Guess = {
  status: boolean;
  name: string;
  person: string;
  teamPair: string;
};

export type GameState = Record<string, Guess>;

export type CurrentGuess = {
  gridItem: [number, number];
  teams: [string, string];
  correctAnswers: { person: string }[];
};

export type Score = {
  correctAnswers: number;
  guesses: number;
};

export type Local = {
  score: Score;
  gameState: GameState;
  gameId: string;
};

const initialScore = {
  correctAnswers: 0,
  guesses: 0,
  uniqueness: 0,
};

const initialLocal = {
  score: initialScore,
  gameState: {},
  gameId: "",
};

export const App = ({
  initialData,
}: {
  initialData: Omit<InitialData, "gameStats">;
}) => {
  const { players, answers, dokuOfTheDay } = initialData;

  const [isLoadingLocal, setLoadingLocal] = React.useState(true);

  const [filteredPlayers, setFilteredPlayers] = React.useState<
    PlayerShortVersion[]
  >([]);

  const [local, setLocal] = useLocalStorage<Local>(
    dokuOfTheDay?.date ?? "-",
    initialLocal
  );

  const { loading: isLoadingGame, value: gameId } = useAsync(async () => {
    if (local?.gameId) {
      console.log({ game: local.gameId });
      return local.gameId;
    }
    const urlDate = dokuOfTheDay.date.replaceAll(".", "-");
    const gameIdResponse = await fetch(`${getRestAPI()}/games/new/${urlDate}`);

    const id = (await gameIdResponse.json()).gameId as string;

    setLocal((l) => ({ ...l!, gameId: id }));

    return id;
  }, [dokuOfTheDay.date]);

  const [currentGuess, setCurrentGuess] = React.useState<CurrentGuess>();
  const [playerListOpen, setPlayerListOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const [score, setScore] = React.useState<Score>(initialScore);

  const [gameState, setGameState] = React.useState<GameState>({});
  const [uniquenessPercentage, setUniquenessPercentage] =
    React.useState<number>(0);

  const { isLoadingStats, getStats, putGuess, stats } = useGuessStatsContext();

  const [showConfetti, setShowConfetti] = React.useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (dokuOfTheDay) {
      getStats(dokuOfTheDay.date);
    }
  }, [dokuOfTheDay, getStats]);

  useEffect(() => {
    if (local && dokuOfTheDay) {
      setScore(local.score);
      setGameState(local.gameState);
      setUniquenessPercentage(getUniqueness(local, dokuOfTheDay, stats));
    }
    setLoadingLocal(false);
  }, [local, dokuOfTheDay, stats]);

  const onGuessStart = useCallback(
    (xTeam: string, yTeam: string, x: number, y: number) => {
      if (!answers) {
        console.error("No answers provided, cannot start guessing!");
        return;
      }

      const correctAnswers = answers[[xTeam, yTeam].sort().join("-")];

      setCurrentGuess({
        gridItem: [x, y],
        teams: [xTeam, yTeam],
        correctAnswers,
      });
      setPlayerListOpen(true);
    },
    [answers, setCurrentGuess, setPlayerListOpen]
  );

  const onFilter = useCallback(
    (query: string) =>
      setFilteredPlayers(
        (players ?? []).filter((player) =>
          player.name.toLowerCase().includes(query.toLowerCase())
        )
      ),
    [players, setFilteredPlayers]
  );

  React.useEffect(() => {
    if (!playerListOpen) {
      setFilteredPlayers([]);
    }
  }, [playerListOpen, setFilteredPlayers]);

  const onPlayerClick = useCallback(
    (player: PlayerShortVersion) => {
      if (!currentGuess?.correctAnswers) {
        throw new Error("Invalid game state!");
      }

      const correctPersons = currentGuess.correctAnswers.map((p) => p.person);
      const isCorrect = correctPersons.includes(player.person);

      const { gameState = {}, score = initialScore } = local ?? {};
      const state = {
        ...gameState,
        [currentGuess.gridItem.join("-")]: {
          status: isCorrect,
          name: player.name,
          person: player.person,
          teamPair: currentGuess.teams.sort().join("-"),
        },
      };
      const newScore = {
        correctAnswers: score.correctAnswers + +isCorrect,
        guesses: score.guesses + 1,
      };
      setLocal((l) => ({ ...l!, gameState: state, score: newScore }));
      setPlayerListOpen(false);
      putGuess({
        date: dokuOfTheDay?.date,
        guessedPlayer: player,
        teamPair: currentGuess.teams.sort().join("-"),
        isCorrect,
        gameId,
      });

      if (newScore.guesses === 9) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    },
    [currentGuess, setLocal, local, putGuess, dokuOfTheDay?.date, gameId]
  );

  const isLoading = isLoadingGame || isLoadingLocal || isLoadingStats;

  return (
    <Stack className="container" alignItems="center" rowGap="1.5rem">
      {showConfetti && <Confetti width={width} height={height} />}

      <Header dokuOfTheDay={dokuOfTheDay} />

      <Modal
        open={playerListOpen}
        onClose={() => setPlayerListOpen(false)}
        aria-labelledby="modal-player-list"
        aria-describedby="modal-all-players"
      >
        <PlayerList
          allPlayers={players ?? []}
          currentGuess={currentGuess}
          filteredPlayers={filteredPlayers}
          onPlayerClick={onPlayerClick}
          onFilter={onFilter}
          gameId={gameId}
          date={dokuOfTheDay.date}
          close={() => setPlayerListOpen(false)}
        />
      </Modal>
      <>
        <GameGrid
          xTeams={dokuOfTheDay?.xTeams ?? []}
          yTeams={dokuOfTheDay?.yTeams ?? []}
          onGuess={onGuessStart}
          gameState={gameState}
          date={dokuOfTheDay?.date}
          gameOver={score.guesses >= 9}
          isLoadingGame={isLoading}
        />
        {!isLoading && (
          <ScoreRow score={score} uniquenessPercentage={uniquenessPercentage} />
        )}
      </>
      {score.guesses >= 9 && (
        <Stack gap={"1rem"}>
          <Tooltip
            title={
              <Typography variant="body2">
                {"Kopioitu leikepöydälle"}
              </Typography>
            }
            placement="top"
            open={tooltipOpen}
          >
            <Button
              variant="contained"
              startIcon={<ShareIcon fontSize="small" />}
              onClick={() => {
                setTooltipOpen(true);
                navigator.clipboard.writeText(
                  formatScoreText(
                    gameState,
                    score,
                    uniquenessPercentage,
                    dokuOfTheDay
                  )
                );
                setTimeout(() => setTooltipOpen(false), 2000);
              }}
            >
              <>{"Kopioi tulos"}</>
            </Button>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};
