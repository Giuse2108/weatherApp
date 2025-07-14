// src/app/interfaces/weather-data.ts
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface MainWeatherData {
  temperature: number;
  cityName: string;
  hoursnow: string;
  weatherDescription: string;
  wind: string;
  FL: string;
  rangeTemp: string;
  humidity: string;
  imagePath?: string
  currentWeatherIconColor: string;
  windIconColor: string;
  feelsLikeIconColor: string;
  rangeTempIconColor: string;
  humidityIconColor: string;
}