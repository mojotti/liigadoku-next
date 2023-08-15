/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import "./Results.css";
import { TeamPairGuesses } from "@/context/GuessStats";

type Props = {
  guesses?: TeamPairGuesses;
  teamPair: string;
  onClose: () => void;
};

export const Results = React.forwardRef<HTMLDivElement, Props>(
  ({ guesses, teamPair, onClose }, ref) => {
    const sortedList = useMemo(
      () =>
        Object.values(guesses?.guessedPlayers ?? {}).sort((a, b) => {
          if (a.numOfGuesses === b.numOfGuesses) {
            return b.isCorrect ? 1 : -1;
          }
          return b.numOfGuesses - a.numOfGuesses;
        }),
      [guesses]
    );

    const total = guesses?.totalGuesses ?? 0;

    return (
      <Box
        boxShadow={20}
        ref={ref}
        sx={{
          width: "100%",
          height: 450,
          maxWidth: 360,
          bgcolor: "background.paper",
          position: "absolute",
          overflowY: "scroll",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "8px",
          "@media (max-width: 800px)": {
            top: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
          },
          color: "rgb(19, 18, 18)",
        }}
      >
        {sortedList.length === 0 && (
          <Typography variant="body2" p="1rem" color="rgb(19, 18, 18)">
            Ei vielä muita tuloksia...
          </Typography>
        )}
        {guesses && sortedList.length > 0 && (
          <Stack>
            <Stack alignItems="flex-start" px="1rem" pt="1rem">
              <Typography variant="h6" gridArea="name">
                {teamPair}
              </Typography>
            </Stack>
            <List>
              <ListSubheader sx={{ background: "#d9e6fe", color: "#000" }}>
                <Grid className="guessListGrid" columnGap="1rem" py=".5rem">
                  <Typography
                    gridArea="name"
                    fontWeight="bold"
                    color="rgb(19, 18, 18)"
                  >
                    Pelaaja
                  </Typography>
                  <Typography
                    gridArea="numOfGuesses"
                    fontWeight="bold"
                    color="rgb(19, 18, 18)"
                  >
                    % (kpl)
                  </Typography>
                  <Typography
                    gridArea="isCorrect"
                    display="flex"
                    flexDirection="row"
                    fontWeight="bold"
                    gap="2px"
                    color="rgb(19, 18, 18)"
                  >
                    <CheckIcon />
                  </Typography>
                </Grid>
              </ListSubheader>
              {sortedList.map((item) => {
                const percentage = (item.numOfGuesses / total) * 100;
                return (
                  <ListItem key={item.person}>
                    <Grid className="guessListGrid" columnGap="1rem">
                      <ListItemText
                        sx={{ gridArea: "name" }}
                        color="rgb(19, 18, 18)"
                      >
                        {item.name}
                      </ListItemText>
                      <ListItemText
                        sx={{ gridArea: "numOfGuesses" }}
                        color="rgb(19, 18, 18)"
                      >
                        {`${percentage.toFixed(percentage < 1 ? 1 : 0)}% (${
                          item.numOfGuesses
                        })`}
                      </ListItemText>
                      <ListItemIcon
                        sx={{ gridArea: "isCorrect", minWidth: 0 }}
                        color="rgb(19, 18, 18)"
                      >
                        {item.isCorrect ? (
                          <CheckIcon sx={{ color: "#3baf3e" }} />
                        ) : (
                          <ClearIcon sx={{ color: "#c34040" }} />
                        )}
                      </ListItemIcon>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        )}
        <Stack
          position="sticky"
          bgcolor="background.paper"
          bottom={0}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"3rem"}
        >
          <Button variant="contained" onClick={onClose}>
            Sulje
          </Button>
        </Stack>
      </Box>
    );
  }
);
