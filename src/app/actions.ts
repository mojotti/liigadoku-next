"use server";

import { getRestAPI } from "@/utils/base-url";

export const putGuessAction = async ({
  date,
  teamPair,
  person,
  gameId,
}: {
  date?: string;
  teamPair: string;
  person: string;
  gameId?: string;
}) => {
  if (!date) {
    console.error("No date provided, cannot report!");
    return;
  }

  if (!gameId) {
    console.error("No game id provided, cannot report!");
    return;
  }

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      person,
      gameId,
    }),
  };

  const urlDate = date.replaceAll(".", "-");

  console.log(
    `Invoking API: ${getRestAPI()}/guesses/by-date-and-team-pair/${urlDate}/${teamPair}`
  );

  try {
    const resp = await fetch(
      `${getRestAPI()}/guesses/by-date-and-team-pair/${urlDate}/${teamPair}`,
      requestOptions
    );
    console.log({ status: resp.status });
  } catch (e) {
    console.log({ error: JSON.stringify(e, null, 2) });
  }
};
