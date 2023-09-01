/* eslint-disable react/display-name */
"use client";
import React, { useTransition } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { PlayerShortVersion } from "@/types";
import { CurrentGuess } from "@/app/App";
import { putGuessAction } from "@/app/actions";
import IconButton from "@mui/material/IconButton";
import { getItemText } from "@/utils/teams";

function renderRow(
  props: ListChildComponentProps,
  onPlayerClick: (player: PlayerShortVersion) => void,
  startTransition: React.TransitionStartFunction,
  gameId?: string,
  currentGuess?: CurrentGuess,
  date?: string
) {
  const { index, style } = props;
  const item = props.data[index] as PlayerShortVersion;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => {
          onPlayerClick(item);
          startTransition(() => {
            putGuessAction({
              gameId,
              person: item.person,
              teamPair: currentGuess?.teams.sort().join("-") ?? "",
              date,
            });
          });
        }}
      >
        <ListItemText
          primary={item.name}
          secondary={item.dateOfBirth}
          sx={{ color: "rgb(19, 18, 18)" }}
        />
      </ListItemButton>
    </ListItem>
  );
}

type Props = {
  allPlayers: PlayerShortVersion[];
  filteredPlayers: PlayerShortVersion[];
  onPlayerClick: (player: PlayerShortVersion) => void;
  onFilter: (filter: string) => void;
  currentGuess?: CurrentGuess;
  gameId?: string;
  date?: string;
  close: () => void;
};

export const PlayerList = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      allPlayers,
      currentGuess,
      filteredPlayers,
      onFilter,
      onPlayerClick,
      gameId,
      date,
      close,
    },
    ref
  ) => {
    let [isPending, startTransition] = useTransition();

    const [searchText, setSearchText] = useState<string>("");

    const items =
      filteredPlayers.length === 0 && !searchText
        ? allPlayers
        : filteredPlayers;

    const hasNoHits = searchText.length > 0 && filteredPlayers.length === 0;

    return (
      <Box
        tabIndex={-1}
        boxShadow={2}
        ref={ref}
        sx={{
          width: "100%",
          height: 450,
          maxWidth: 360,
          bgcolor: "background.paper",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "8px",
          "@media (max-width: 800px)": {
            top: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
          },
        }}
      >
        {currentGuess && (
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
            <Stack flexDirection={"column"}>
              <Typography
                variant="h6"
                sx={{ padding: "1rem 1rem 0 1rem" }}
                color="rgb(19, 18, 18)"
              >
                {currentGuess.teams.map(getItemText).join(" ja ")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", padding: "0 1rem 0 1rem" }}
                color="rgb(19, 18, 18)"
              >
                Vain Liiga-kaudet huomioidaan
              </Typography>
            </Stack>
            <IconButton
              sx={{
                // background: "rgba(200, 210, 245, 0.223)",
                height: "2rem",
                width: "2rem",
                margin: "1rem",
              }}
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        )}
        <TextField
          id="outlined-basic"
          label="Hae pelaajaa"
          variant="outlined"
          autoComplete="off"
          autoFocus
          value={searchText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
            onFilter(event.target.value);
          }}
          sx={{
            width: "calc(100% - 1rem)",
            marginLeft: ".5rem",
            marginRight: ".5rem",
            marginTop: "16px",
            marginBottom: "16px",
            height: "50px",
          }}
        />
        {hasNoHits && (
          <Typography variant="body1" sx={{ padding: "1rem" }}>
            Ei hakutuloksia
          </Typography>
        )}
        {!hasNoHits && (
          <FixedSizeList
            itemData={items}
            height={300}
            width={360}
            itemSize={65}
            itemCount={items.length}
            overscanCount={5}
          >
            {(props) =>
              renderRow(
                props,
                onPlayerClick,
                startTransition,
                gameId,
                currentGuess,
                date
              )
            }
          </FixedSizeList>
        )}
      </Box>
    );
  }
);
