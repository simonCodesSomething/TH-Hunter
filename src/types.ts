export type CarType = "TH" | "STH";

export interface Car {
  id: string;
  name: string;
  type: CarType;
  series: string;
  caseLetter: string;
  imageKey: string;
  idTips: string;
}

export interface CheatSheetSection {
  title: string;
  color: string;
  points: string[];
}
