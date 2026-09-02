import React, { createContext, useContext, useEffect, useState } from "react";

import type { Car } from "../types";

interface CarDataContextValue {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

interface SupabaseCar {
  id: string;
  name: string;
  type: Car["type"];
  year: number;
  series: string;
  case_letter: string;
  image_key: string;
  id_tips: string;
}

const CarDataContext = createContext<CarDataContextValue | undefined>(undefined);

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function getRestUrl(url: string) {
  return `${url.replace(/\/$/, "").replace(/\/rest\/v1$/, "")}/rest/v1`;
}

async function fetchCars(): Promise<Car[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const response = await fetch(
    `${getRestUrl(supabaseUrl)}/cars?select=id,name,type,year,series,case_letter,image_key,id_tips&order=year.desc,id.asc`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    }
  );

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `Supabase request failed with status ${response.status}: ${responseBody}`
    );
  }

  const rows = (await response.json()) as SupabaseCar[];
  return rows.map((car) => ({
    id: car.id,
    name: car.name,
    type: car.type,
    year: car.year,
    series: car.series,
    caseLetter: car.case_letter,
    imageKey: car.image_key,
    idTips: car.id_tips,
  }));
}

export function CarDataProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchCars()
      .then((nextCars) => {
        if (mounted) {
          setCars(nextCars);
        }
      })
      .catch((requestError: unknown) => {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load car data.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CarDataContext.Provider value={{ cars, loading, error }}>
      {children}
    </CarDataContext.Provider>
  );
}

export function useCarData() {
  const context = useContext(CarDataContext);
  if (!context) {
    throw new Error("useCarData must be used inside CarDataProvider.");
  }

  return context;
}