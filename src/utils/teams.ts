const teamsIn2000s = [
  "Kärpät",
  "HIFK",
  "Tappara",
  "Pelicans",
  "KalPa",
  "JYP",
  "TPS",
  "Ässät",
  "HPK",
  "Lukko",
  "SaiPa",
  "Sport",
  "KooKoo",
  "Ilves",
  "Jukurit",
  "Blues",
  "Jokerit",
];

export const isTeam = (team: string) => teamsIn2000s.includes(team);

export const getMilestoneDescription = (item: string) => {
  switch (item) {
    case "400points":
      return "Ura: 400 pistettä";
    case "600games":
      return "Ura: 600 ottelua";
    case "300assists":
      return "Ura: 300 syöttöä";
    case "500penaltyMinutes":
      return "Ura: 500 jäähyminuuttia";
    case "200goals":
      return "Ura: 200 maalia";
  }
};

export const getItemText = (item: string) =>
  isTeam(item) ? item : getMilestoneDescription(item);
