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
    case "50pointsSeason":
      return "Kausi: 50 pistettä";
    case "60pointsSeason":
      return "Kausi: 60 pistettä";
    case "40assistsSeason":
      return "Kausi: 40 syöttöä";
    case "35assistsSeason":
      return "Kausi: 35 syöttöä";
    case "30assistsSeason":
      return "Kausi: 30 syöttöä";
    case "100penaltyMinutesSeason":
      return "Kausi: 100 jäähyminuuttia";
    case "150penaltyMinutesSeason":
      return "Kausi: 150 jäähyminuuttia";
    case "30goalsSeason":
      return "Kausi: 30 maalia";
    case "25goalsSeason":
      return "Kausi: 25 maalia";
    case "20goalsSeason":
      return "Kausi: 20 maalia";
    case "5Teams":
      return "Liiga: väh. 5 joukkuetta";
    case "6Teams":
      return "Liiga: väh. 6 joukkuetta";
    case "7Teams":
      return "Liiga: väh. 7 joukkuetta";
    case "8Teams":
      return "Liiga: väh. 8 joukkuetta";
    case "10Seasons":
      return "Liiga: väh. 10 kautta";
    case "12Seasons":
      return "Liiga: väh. 12 kautta";
    case "14Seasons":
      return "Liiga: väh. 14 kautta";
    case "15Seasons":
      return "Liiga: väh. 15 kautta";
    case "200plusMinus":
      return "Liiga: plus-miinus 200+";
    default:
      return "-";
  }
};

export const getItemText = (item: string) =>
  isTeam(item) ? item : getMilestoneDescription(item);

export const getMilestoneShortVersion = (item: string) => {
  switch (item) {
    case "400points":
      return "Ura: 400 pistettä";
    case "600games":
      return "Ura: 600 ottelua";
    case "300assists":
      return "Ura: 300 syöttöä";
    case "500penaltyMinutes":
      return "Ura: 500 min";
    case "200goals":
      return "Ura: 200 maalia";
    case "50pointsSeason":
      return "Kausi: 50 pistettä";
    case "60pointsSeason":
      return "Kausi: 60 pistettä";
    case "40assistsSeason":
      return "Kausi: 40 syöttöä";
    case "35assistsSeason":
      return "Kausi: 35 syöttöä";
    case "30assistsSeason":
      return "Kausi: 30 syöttöä";
    case "100penaltyMinutesSeason":
      return "Kausi: 100 min";
    case "150penaltyMinutesSeason":
      return "Kausi: 150 min";
    case "30goalsSeason":
      return "Kausi: 30 maalia";
    case "25goalsSeason":
      return "Kausi: 25 maalia";
    case "20goalsSeason":
      return "Kausi: 20 maalia";
    case "5Teams":
      return "Liiga: väh. 5 joukkuetta";
    case "6Teams":
      return "Liiga: väh. 6 joukkuetta";
    case "7Teams":
      return "Liiga: väh. 7 joukkuetta";
    case "8Teams":
      return "Liiga: väh. 8 joukkuetta";
    case "10Seasons":
      return "Liiga: väh. 10 kautta";
    case "12Seasons":
      return "Liiga: väh. 12 kautta";
    case "14Seasons":
      return "Liiga: väh. 14 kautta";
    case "15Seasons":
      return "Liiga: väh. 15 kautta";
    case "200plusMinus":
      return "Liiga: plus-miinus 200+";
    default:
      return "-";
  }
};
export const getItemTextShortVersion = (item: string) =>
  isTeam(item) ? item : getMilestoneShortVersion(item);
