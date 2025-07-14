export interface CitySummary {
  region: string; // Es. "Lazio", "Campania"
  name: string;
  description: string; // Es. "Clear sky", "Snow"
  temperature: number;
  imagePath?: string; // Se usi file SVG come per le previsioni orarie
}