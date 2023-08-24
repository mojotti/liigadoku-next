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
import { restAPI } from "@/utils/base-url";

export type Guess = {
  status: boolean;
  name: string;
  person: string;
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

type Local = {
  score: Score;
  gameState: GameState;
};

const initialScore = {
  correctAnswers: 0,
  guesses: 0,
};

export const App = ({ initialData }: { initialData: InitialData }) => {
  const { players, answers, dokuOfTheDay } = initialData;
  const { fetchStats } = useGuessStatsContext();

  const [isLoadingLocal, setLoadingLocal] = React.useState(true);

  const [filteredPlayers, setFilteredPlayers] = React.useState<
    PlayerShortVersion[]
  >([]);

  const [local, setLocal] = useLocalStorage<Local>(dokuOfTheDay?.date ?? "-");

  const { loading: isLoadingGame, value: gameId } = useAsync(async () => {
    const urlDate = dokuOfTheDay.date.replaceAll(".", "-");
    const gameIdResponse = await fetch(`${restAPI()}games/new/${urlDate}`);

    return (await gameIdResponse.json()).gameId as string;
  }, [dokuOfTheDay.date]);

  const [currentGuess, setCurrentGuess] = React.useState<CurrentGuess>();
  const [open, setOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const [score, setScore] = React.useState<Score>({
    correctAnswers: 0,
    guesses: 0,
  });

  const [gameState, setGameState] = React.useState<GameState>({});

  useEffect(() => {
    if (dokuOfTheDay) {
      fetchStats(dokuOfTheDay.date);
    }
  }, [dokuOfTheDay, fetchStats]);

  useEffect(() => {
    if (local) {
      setScore(local.score);
      setGameState(local.gameState);
      setLoadingLocal(false);
    }
  }, [local]);

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
      setOpen(true);
    },
    [answers, setCurrentGuess, setOpen]
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
    if (!open) {
      setFilteredPlayers([]);
    }
  }, [open, setFilteredPlayers]);

  const { putGuess } = useGuessStatsContext();

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
        },
      };
      const newScore = {
        correctAnswers: score.correctAnswers + +isCorrect,
        guesses: score.guesses + 1,
      };
      setLocal({ gameState: state, score: newScore });
      setOpen(false);
      setOpen(false);
      // do not wait on purpose
      putGuess({
        date: dokuOfTheDay?.date,
        guessedPlayer: player,
        teamPair: currentGuess.teams.sort().join("-"),
        isCorrect,
        gameId,
      });
    },
    [currentGuess, setLocal, local, putGuess, dokuOfTheDay?.date, gameId]
  );

  return (
    <Stack className="container" alignItems="center" rowGap="1.5rem">
      <Header dokuOfTheDay={dokuOfTheDay} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-player-list"
        aria-describedby="modal-all-players"
      >
        <PlayerList
          allPlayers={players ?? []}
          currentGuess={currentGuess}
          filteredPlayers={filteredPlayers}
          onPlayerClick={onPlayerClick}
          onFilter={onFilter}
          isLoadingGameId={isLoadingGame}
          gameId={gameId}
          date={dokuOfTheDay.date}
        />
      </Modal>
      <>
        <GameGrid
          xTeams={dokuOfTheDay?.xTeams ?? []}
          yTeams={dokuOfTheDay?.yTeams ?? []}
          onGuess={onGuessStart}
          gameState={gameState}
          date={dokuOfTheDay?.date}
          gameOver={score.guesses === 9}
          isLoadingGame={isLoadingGame}
        />
        <h2>{`Pisteet: ${score.correctAnswers}/9`}</h2>
      </>
      {score.guesses === 9 && (
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
                  formatScoreText(gameState, score, dokuOfTheDay)
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
