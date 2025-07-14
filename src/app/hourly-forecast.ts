// src/app/interfaces/hourly-forecast.ts
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface HourlyForecast {
  time: string;
  icon: string;
  temperature: number;
  unit: string;
  description?: string; // Aggiungi questa proprietà per la descrizione
  imagePath?: string;
}