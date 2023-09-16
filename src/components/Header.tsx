"use client";
import React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import HelpIcon from "@mui/icons-material/HelpOutline";
import TwitterIcon from "@mui/icons-material/Twitter";
import { LiigadokuOfTheDay } from "@/types";

const helpTexts = [
  {
    header: "Mistä on kyse?",
    body: "Pelissä on tarkoituksena löytää jokaiseen ruutuun pelaaja, joka täyttää rivin ja sarakkeen asettamat kriteerit.",
  },
  {
    header: "Miten usein peli vaihtuu?",
    body: "Joka päivä on tarjolla uusi peli. Päivän peli tulee pelattavaksi keskiyöllä Suomen aikaa.",
  },
  {
    header: "Tutki tilastoja",
    body: "Arvattuasi pelaajaa, näet arvauksesi prosentuaalisen yleisyyden ruudun vasemmassa yläkulmassa. Pelin jälkeen voit tutkia tilastoja tarkemmin painamalla ruudun 📊-näppäintä.",
  },
  {
    header: "Haasta kaverisi",
    body: " Pelin jälkeen voit jakaa tuloksesi ja haastaa kaverisi peliin.",
  },
  {
    header: "Huomioitavaa",
    body: "Liigadokussa huomioidaan vain joukkueen Liiga-kaudet. Esim. Jukureiden Mestis-ajan pelaajat eivät kelpaa vastaukseksi. Mukana on tilastot Liigan perustamisvuodesta 1975 lähtien.",
  },
];

export const Header = ({
  dokuOfTheDay,
}: {
  dokuOfTheDay?: LiigadokuOfTheDay;
}) => {
  const [isHelpOpen, setHelpOpen] = React.useState(false);

  return (
    <>
      <Modal open={isHelpOpen} onClose={() => setHelpOpen(false)}>
        <Paper
          sx={{
            width: "100%",
            position: "absolute",
            top: "4rem",
            right: "2rem",
            height: "auto",
            maxWidth: "400px",
            "@media (max-width: 600px)": {
              rigth: "none",
              top: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
            },
          }}
        >
          <Stack
            padding={"1rem"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {helpTexts.map((text, i) => (
              <Stack gap="0.2rem" pb={"0.7rem"} key={i}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {text.header}
                </Typography>
                <Typography variant="body2">{text.body}</Typography>
              </Stack>
            ))}
            <Button
              onClick={() => setHelpOpen(false)}
              sx={{ mt: ".5rem" }}
              variant="contained"
              color="primary"
            >
              Sulje
            </Button>
          </Stack>
        </Paper>
      </Modal>
      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
        alignItems="flex-start"
        p="1rem 0"
      >
        <Stack direction="column" alignItems="flex-start">
          <h1 className="header">Liigadoku</h1>
          <Typography variant="body1" mb="0.5rem">
            {dokuOfTheDay?.date}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Link
            href="https://twitter.com/liigadoku"
            target="_blank"
            sx={{
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <TwitterIcon sx={{ color: "#fffffff3" }} fontSize="large" />
          </Link>

          <IconButton
            onClick={() => setHelpOpen(true)}
            sx={{
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <HelpIcon sx={{ color: "#fffffff3" }} fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
};
