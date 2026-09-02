import { mkdir, writeFile } from "node:fs/promises";
import carData from "../src/data/thstData.json" with { type: "json" };

const headers = [
  "id",
  "name",
  "type",
  "year",
  "series",
  "case_letter",
  "image_key",
  "id_tips",
];

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const rows = carData.map((car) => [
  car.id,
  car.name,
  car.type,
  car.year,
  car.series,
  car.caseLetter,
  car.imageKey,
  car.idTips,
]);

const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n") + "\n";

await mkdir("supabase", { recursive: true });
await writeFile("supabase/cars.csv", csv, "utf8");
console.log(`Exported ${rows.length} cars to supabase/cars.csv`);
