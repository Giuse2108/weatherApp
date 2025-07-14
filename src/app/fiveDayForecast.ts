export interface FiveDayForecast {
  day: string; // Es. "Today", "Fri", "Sat"
  description: string; // Es. "Clouds", "Snow"
  temperature: number;
  imagePath: string; // Percorso all'SVG dell'icona
  // Aggiungi queste proprietà per la barra dinamica (optional, ma nell'immagine c'è)
  minTempForBar: number; // Temperatura minima del giorno per la barra
  maxTempForBar: number; // Temperatura massima del giorno per la barra
  barWidth: string; // La larghezza della barra come stringa percentuale (es. "70%")
}