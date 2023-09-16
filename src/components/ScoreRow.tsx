import React from "react";
import { Score } from "@/app/App";
import Stack from "@mui/material/Stack";
import HelpIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

type Props = {
  score: Score;
  uniquenessPercentage: number;
};

const helpTexts = [
  "Ainutlaatuisuusprosentti kertoo kuinka yleisiä vastauksesi ovat verrattuna muihin pelaajiin.",
  "Ainutlaatuisuusprosentti on keskiarvo arvaustesi prosentuaalisesta yleisyydestä.",
  "Mitä pienempi prosenttiluku on, sitä harvinaisempia vastauksia olet löytänyt.",
  "Väärän vastauksen laskennallinen yleisyys on 100%.",
];

export const ScoreRow = ({ score, uniquenessPercentage }: Props) => {
  const [isHelpOpen, setHelpOpen] = React.useState(false);

  return (
    <Stack direction="column" alignItems="center" gap=".6rem">
      <Modal open={isHelpOpen} onClose={() => setHelpOpen(false)}>
        <Paper
          sx={{
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "auto",
            maxWidth: "300px",
          }}
        >
          <Stack
            padding={"1rem"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Ainutlaatuisuus
            </Typography>
            {helpTexts.map((helpText, i) => (
              <Typography key={i} p=".5rem 0" variant="body2">
                {helpText}
              </Typography>
            ))}
            <Button
              onClick={() => setHelpOpen(false)}
              sx={{ mt: ".5rem", alignSelf: "center" }}
              variant="contained"
              color="primary"
            >
              Sulje
            </Button>
          </Stack>
        </Paper>
      </Modal>
      <h2>{`Pisteet: ${score.correctAnswers}/9`}</h2>
      <Stack
        direction="row"
        gap=".2rem"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          onClick={() => setHelpOpen(true)}
          sx={{
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          <HelpIcon sx={{ color: "#fffffff3" }} fontSize="medium" />
        </IconButton>
        <h2>{`Ainutlaatuisuus: ${uniquenessPercentage.toFixed(
          uniquenessPercentage < 1 ? 1 : 0
        )}%`}</h2>
      </Stack>
    </Stack>
  );
};
