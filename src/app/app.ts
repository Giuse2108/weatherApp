import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Importa il modulo Font Awesome
// Importa tutte le icone necessarie da Font Awesome
import {
  faSearch,
  faCloudSun,
  faCloud,
  faSnowflake,
  faSun,
  faSmog,
  faCloudShowersHeavy,
  faCloudRain,
  faWind,
  faThermometerHalf,
  faTemperatureLow,
  faTint,
  faMoon,
  // icona per il meteo attuale (es. faCloud per l'icona centrale)
  faCloud as faCloudMain,
  faThunderstorm
} from '@fortawesome/free-solid-svg-icons';
import { HourlyForecast } from './hourly-forecast'; 
import { MainWeatherData } from './weather-data';
import { CitySummary } from './otherLargeCities'; 
import { FiveDayForecast } from './fiveDayForecast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit{
  protected title = 'weather-app';
  
  // Oggetto per contenere tutte le icone di Font Awesome disponibili per il template
  icons = {
    faSearch: faSearch,
    faCloudSun: faCloudSun,
    faCloud: faCloud, // Per le previsioni orarie
    faSnowflake: faSnowflake,
    faSun: faSun,
    faSmog: faSmog,
    faCloudShowersHeavy: faCloudShowersHeavy,
    faThunderstorm: faThunderstorm, // Icona per i temporali
    faCloudRain: faCloudRain,
    faWind: faWind, // Icona per il vento
    faThermometerHalf: faThermometerHalf, // Icona per la temperatura
    faTemperatureLow: faTemperatureLow, // Icona per la temperatura bassa
    faTint: faTint, // Icona per l'umidità
    faCloudMain: faCloudMain, // Icona per il meteo principale
    faMoon: faMoon // Icona per la luna, se necessaria
  };

  activeUnit: 'celsius' | 'fahrenheit' = 'celsius'; // Imposta un valore predefinito

  // Funzione per cambiare l'unità attiva
  toggleUnit(unit: 'celsius' | 'fahrenheit') {
    this.activeUnit = unit;
    // Qui potresti anche aggiungere logica per convertire la temperatura visualizzata
    // a seconda dell'unità selezionata.
    if(unit == 'fahrenheit') {
      this.weatherData.temperature = Math.round(this.weatherData.temperature * 9/5 + 32);
      this.hourlyForecasts.forEach(forecast => {
        forecast.temperature = Math.round(forecast.temperature * 9/5 + 32);
      });
      this.otherCities.forEach(city => {
        city.temperature = Math.round(city.temperature * 9/5 + 32);
      });
      this.fiveDayForecasts.forEach(forecast => {
        forecast.temperature = Math.round(forecast.temperature * 9/5 + 32);
      });
    }
    else {
      this.weatherData.temperature = Math.round((this.weatherData.temperature - 32) * 5/9);
      this.hourlyForecasts.forEach(forecast => {
        forecast.temperature = Math.round((forecast.temperature - 32) * 5/9);
      });
      this.otherCities.forEach(city => {
        city.temperature = Math.round((city.temperature - 32) * 5/9);
      });
      this.fiveDayForecasts.forEach(forecast => {
        forecast.temperature = Math.round((forecast.temperature - 32) * 5/9);
      });
    }
  }



  // Utilizza l'interfaccia MainWeatherData per tipizzare i dati principali
  weatherData: MainWeatherData = {
    temperature: 0,
    cityName: '',
    hoursnow: '',
    weatherDescription: '',
    wind: '',
    FL: '',
    rangeTemp: '',
    humidity: '',
    imagePath: 'assets/cloudy.svg',
    currentWeatherIconColor: '#87CEEB',
    windIconColor: '#FFA500',
    feelsLikeIconColor: '#ADD8E6',
    rangeTempIconColor: '#ADD8E6',
    humidityIconColor: '#00BFFF'
  };

    // Dati per le previsioni orarie, tipizzati con HourlyForecast[]
  hourlyForecasts: HourlyForecast[] = []; 
  otherCities: CitySummary[] = [];
  fiveDayForecasts: FiveDayForecast[] = []; // Dati per le previsioni a 5 giorni


  private citiesToFetch = [
    { name: 'New York', region: 'US' },
    { name: 'Copenhagen', region: 'Denmark' },
    { name: 'Rome', region: 'Latium' }
  ];

  constructor() {

    // Inizializzazione delle previsioni a 5 giorni
    // Per calcolare 'barWidth', si potrebbe aver bisogno di definire un range di temperatura globale
    // Es. min globale: -10, max globale: 30
    const globalMinTemp = -10; 
    const globalMaxTemp = 30; 

  
  }

  citySearch: string = '';
  // Funzione per cercare una città
  searchCity() {
  const city = this.citySearch.trim();
  if (!city) return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=786aac30bb59d534eb8e5e7836732dee&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert('Città non trovata');
        return;
      }

      console.log('Dati API:', data);
      const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000); // Ora UTC
      const localTime = new Date(utcTime + data.timezone * 1000); // Ora della città
      const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


      // Converti i dati ricevuti nel formato del tuo oggetto `weatherData`
      this.weatherData = {
        temperature: Math.round(data.main.temp),
        cityName: data.name,
        hoursnow: formattedTime,
        weatherDescription: data.weather[0].description,
        wind: `${(data.wind.speed * 3.6).toFixed(2)} km/h`, // Converto da m/s a km/h
        FL: `${Math.round(data.main.feels_like)}°C`,
        rangeTemp: `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`,
        humidity: `${data.main.humidity}%`,
        imagePath: this.mapWeatherIcon(data.weather[0].main),
        currentWeatherIconColor: '#87CEEB', 
        windIconColor: '#FFA500',          
        feelsLikeIconColor: '#ADD8E6',     
        rangeTempIconColor: '#ADD8E6',     
        humidityIconColor: '#00BFFF'       
      };
      this.fetchHourlyForecast(data.coord.lat, data.coord.lon); // Chiamata per le previsioni orarie
      this.fetchFiveDayForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      console.error('Errore nella chiamata API:', error);
      alert('Errore nel recupero dei dati meteo');
    });
  }

  // Funzione per mappare il tipo di meteo all'icona corrispondente
  mapWeatherIcon(weatherMain: string, isNight: boolean = false): string {

    // Priorità per le condizioni notturne se è sereno o poco nuvoloso
  if (isNight) {
    switch (weatherMain.toLowerCase()) {
      case 'clouds': // nel caso di una luna con poche nuvole 
        return "assets/moon-clouds.png"; 
      case 'clear': // nel caso di una luna serena
        return "assets/full-moon.png"; 
    }
  }

  switch (weatherMain.toLowerCase()) {
    case 'clear': return "assets/sun.svg";
    case 'clouds': return "assets/cloudy.svg";
    case 'snow': return "assets/snow.svg";
    case 'rain': return "assets/rain.svg";
    case 'drizzle': return "assets/drizzle.svg";
    case 'thunderstorm': return "assets/thunderstorm.svg";
    case 'mist': return "assets/mist.svg";
    default: return "assets/cloudy.svg";
  }
}


  // Funzione per calcolare la larghezza della barra di temperatura (esempio semplificato)
  // Questa funzione potrebbe essere un metodo della classe o una funzione utility
  private calculateBarWidth(minDayTemp: number, maxDayTemp: number, globalMin: number, globalMax: number): string {
    const range = globalMax - globalMin;
    if (range === 0) return '0%';

    const start = (minDayTemp - globalMin) / range;
    const end = (maxDayTemp - globalMin) / range;
    const width = (end - start) * 100;
    const offset = start * 100;

    // Questa è una semplificazione. Potrebbe essere necessario un div per l'offset
    // e un div interno per la larghezza effettiva della barra.
    // Per ora, impostiamo la larghezza sulla temperatura media o sul massimo relativo
    // o sulla percentuale di copertura del range complessivo.
    // Per replicare l'immagine, la barra non è solo una larghezza, ma anche una posizione orizzontale.
    // L'esempio di CSS dato per .temp-bar è un gradiente a larghezza fissa.
    // Per una barra che si estende da min a max del giorno:
    const barLength = maxDayTemp - minDayTemp;
    const barPosition = minDayTemp; // O un punto medio

    // Per l'immagine, la barra è una singola linea colorata, non un range.
    // Quindi, probabilmente la "larghezza" della barra si riferisce alla percentuale di
    // completamento rispetto ad un range globale o un valore fisso per la visualizzazione.
    // Usiamo un valore arbitrario per ora, in un vero progetto sarebbe basato su dati.
    const percentage = ((minDayTemp + maxDayTemp) / 2 - globalMin) / range * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`;
  }

  // ngOnInit è un buon posto per caricare i dati iniziali, specialmente da servizi
  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log('Posizione corrente:', lat, lon);

          // 1️⃣ Chiamata a OpenWeatherMap per dati meteo attuali
          this.fetchCurrentWeather(lat, lon);

          // 🆕 4️⃣ Chiamata a OpenWeatherMap per le previsioni orarie
          this.fetchHourlyForecast(lat, lon);

          // 🆕 Chiamata per le previsioni a 5 giorni
          this.fetchFiveDayForecast(lat, lon); 

        },
        error => {
          console.error('Errore ottenendo la posizione:', error);
          alert('Non è stato possibile ottenere la posizione. Consenti la geolocalizzazione.');
          // Potresti voler chiamare una funzione per cercare una città di default o mostrare un input.
        },
        {
          enableHighAccuracy: true, // Per una posizione più precisa
          timeout: 5000, // Timeout di 5 secondi
          maximumAge: 0 // Non usare una posizione memorizzata
        }
      );
    } else {
      alert('Il tuo browser non supporta la geolocalizzazione.');
      // Mostra un input per la città se la geolocalizzazione non è supportata
    }

     // 🆕 Chiamata per recuperare i dati delle altre città importanti
    this.fetchCurrentWeatherOtherImportantCities();
}

  // Funzione per recuperare il meteo attuale (già esistente)
  fetchCurrentWeather(lat: number, lon: number) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=786aac30bb59d534eb8e5e7836732dee&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) {
          console.error('Errore nel recupero dati meteo attuali:', data.message);
          return;
        }
        console.log('Dati meteo attuali da OpenWeatherMap:', data);

        // ... (Logica per ottenere il nome della città da Nominatim)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(locationData => {
            console.log('Dati da Nominatim (current):', locationData);
            const cityFromNominatim = locationData.address.city || locationData.address.town || locationData.address.village || locationData.address.municipality || data.name;

            const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000); // UTC
            const localTime = new Date(utcTime + data.timezone * 1000);
            const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Determina se è notte
            const currentHour = localTime.getHours();
            const isNightCurrent = (currentHour >= 21 || currentHour < 6);

            this.weatherData = {
              temperature: Math.round(data.main.temp),
              cityName: cityFromNominatim,
              hoursnow: formattedTime,
              weatherDescription: data.weather[0].description,
              wind: `${(data.wind.speed * 3.6).toFixed(2)} km/h`,
              FL: `${Math.round(data.main.feels_like)}°C`,
              rangeTemp: `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`,
              humidity: `${data.main.humidity}%`,
              imagePath: this.mapWeatherIcon(data.weather[0].main, isNightCurrent), // Assicurati che questa funzione esista
              currentWeatherIconColor: '#87CEEB',
              windIconColor: '#FFA500',
              feelsLikeIconColor: '#ADD8E6',
              rangeTempIconColor: '#ADD8E6',
              humidityIconColor: '#00BFFF'
            };
          })
          .catch(error => console.error('Errore Nominatim (current):', error));
      })
      .catch(error => console.error('Errore OpenWeatherMap (current):', error));
  }


  // 🆕 Nuova funzione per recuperare le previsioni orarie
  fetchHourlyForecast(lat: number, lon: number) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=786aac30bb59d534eb8e5e7836732dee&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== '200') { // Nota che per questo endpoint 'cod' è una stringa
          console.error('Errore nel recupero dati previsioni orarie:', data.message);
          this.hourlyForecasts = []; // Pulisci le previsioni se c'è un errore
          return;
        }

        console.log('Dati previsioni orarie da OpenWeatherMap:', data);

        // Prendi solo le prime 8-10 previsioni per coprire 24-30 ore, dato che sono ogni 3 ore
        const forecastsToDisplay = data.list.slice(0, 8); // Prende le prossime 8 previsioni (24 ore)

        this.hourlyForecasts = forecastsToDisplay.map((forecast: any) => {
          const date = new Date(forecast.dt * 1000); // dt è in secondi UNIX
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const description = forecast.weather[0].description;
          const temperature = Math.round(forecast.main.temp);
          const weatherMain = forecast.weather[0].main; // E.g., "Clear", "Clouds", "Rain"

          // Determina se questa specifica previsione è di notte
          const forecastHour = date.getHours();
          const isNightForecast = (forecastHour >= 21 || forecastHour < 6);

          return {
            time: time,
            temperature: temperature,
            unit: '°',
            description: description,
            imagePath: this.mapWeatherIcon(weatherMain, isNightForecast) // Riutilizza la tua funzione esistente o creane una specifica
          };
        });
      })
      .catch(error => console.error('Errore OpenWeatherMap (forecast):', error));
  }


  // Funzione per recuperare il meteo attuale (già esistente)
  fetchCurrentWeatherOtherImportantCities() {

    this.otherCities = []; // Pulisci l'array prima di ripopolarlo

    const fetchPromises = this.citiesToFetch.map(cityInfo => {
      // Endpoint OpenWeatherMap per il meteo attuale per nome città
      return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInfo.name}&appid=786aac30bb59d534eb8e5e7836732dee&units=metric`)
        .then(res => res.json())
        .then(data => {
          if (data.cod !== 200) {
            console.error(`Errore nel recupero dati per ${cityInfo.name}:`, data.message);
            return null; // Ritorna null o un oggetto di errore per gestire i fallimenti
          }

          console.log(`Dati per ${cityInfo.name}:`, data);

          const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
          const localTime = new Date(utcTime + data.timezone * 1000); // timezone è in secondi
          const currentHour = localTime.getHours();
          const isNight = (currentHour >= 21 || currentHour < 6);

          return {
            region: cityInfo.region,
            name: cityInfo.name,
            description: data.weather[0].description,
            temperature: Math.round(data.main.temp),
            imagePath: this.mapWeatherIcon(data.weather[0].main, isNight) // Passa isNight
          }as CitySummary;
        })
        .catch(error => {
          console.error(`Errore nel fetching per ${cityInfo.name}:`, error);
          return null; // Gestisci l'errore per quella singola città
        });
      });

      // Aspetta che tutte le chiamate siano finite
      Promise.all(fetchPromises).then(results => {
        // Filtra i risultati null (città che non sono riuscite a caricare)
        this.otherCities = results.filter(city => city !== null) as CitySummary[];
      });
  }


  // Funzione per recuperare le previsioni a 5 giorni
  fetchFiveDayForecast(lat: number, lon: number) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=786aac30bb59d534eb8e5e7836732dee&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== '200') {
          console.error('Errore nel recupero dati previsioni a 5 giorni:', data.message);
          this.fiveDayForecasts = [];
          return;
        }

        console.log('Dati previsioni a 5 giorni da OpenWeatherMap:', data);

        const dailyDataMap: Map<string, any[]> = new Map(); // Mappa per raggruppare i dati per giorno
        const today = new Date(); // Data di oggi per confronto

        // Raggruppa le previsioni per giorno
        data.list.forEach((forecast: any) => {
          const date = new Date(forecast.dt * 1000); // Converte timestamp in oggetto Date
          const dayKey = date.toISOString().split('T')[0]; // Es: "2024-07-15"

          if (!dailyDataMap.has(dayKey)) {
            dailyDataMap.set(dayKey, []);
          }
          dailyDataMap.get(dayKey)!.push(forecast);
        });

        // Prepara l'array fiveDayForecasts
        this.fiveDayForecasts = [];
        let globalMinTemp = Infinity;
        let globalMaxTemp = -Infinity;

        // Prima passata per calcolare min/max globali per la barra
        dailyDataMap.forEach(dayForecasts => {
          dayForecasts.forEach(forecast => {
            if (forecast.main.temp_min < globalMinTemp) globalMinTemp = forecast.main.temp_min;
            if (forecast.main.temp_max > globalMaxTemp) globalMaxTemp = forecast.main.temp_max;
          });
        });

        // Seconda passata per popolare fiveDayForecasts
        let dayCounter = 0;
        dailyDataMap.forEach((dayForecasts, dayKey) => {
          // Prendi solo i prossimi 5 giorni (inclusi "oggi" se è il primo)
          if (dayCounter >= 5) {
            return;
          }
          dayCounter++;

          const date = new Date(dayKey);
          let minTemp = Infinity;
          let maxTemp = -Infinity;
          let totalTemp = 0;
          let countTemp = 0;
          const weatherConditions: { [key: string]: number } = {}; // Per contare le condizioni

          dayForecasts.forEach(forecast => {
            if (forecast.main.temp_min < minTemp) minTemp = forecast.main.temp_min;
            if (forecast.main.temp_max > maxTemp) maxTemp = forecast.main.temp_max;
            totalTemp += forecast.main.temp;
            countTemp++;

            const mainWeather = forecast.weather[0].main;
            weatherConditions[mainWeather] = (weatherConditions[mainWeather] || 0) + 1;
          });

          const avgTemp = Math.round(totalTemp / countTemp);

          // Trova la condizione meteo più frequente del giorno
          let dominantWeather = 'Clear'; // Default
          let maxCount = 0;
          for (const condition in weatherConditions) {
            if (weatherConditions[condition] > maxCount) {
              maxCount = weatherConditions[condition];
              dominantWeather = condition;
            }
          }

          // Determina il nome del giorno (Oggi, Domani, o giorno della settimana)
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0); // Rimuovi l'ora per il confronto
          const forecastDate = new Date(dayKey);
          forecastDate.setHours(0, 0, 0, 0);

          let dayName: string;
          if (forecastDate.getTime() === todayDate.getTime()) {
            dayName = 'Today';
          } else {
            const tomorrowDate = new Date(todayDate);
            tomorrowDate.setDate(todayDate.getDate() + 1);
            if (forecastDate.getTime() === tomorrowDate.getTime()) {
                dayName = 'Tomorrow'; // Aggiungi Tomorrow se vuoi
            } else {
                dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // Es: "Fri"
            }
          }


          this.fiveDayForecasts.push({
            day: dayName,
            description: dominantWeather, // Potresti voler usare forecast.weather[0].description dal dominante
            temperature: avgTemp, // O temperature medie per il giorno
            imagePath: this.mapWeatherIcon(dominantWeather), // Passa isNightForDay
            minTempForBar: Math.round(minTemp), // Temperatura minima del giorno
            maxTempForBar: Math.round(maxTemp), // Temperatura massima del giorno
            barWidth: this.calculateBarWidth(minTemp, maxTemp, globalMinTemp, globalMaxTemp) // ricalcola qui
          });
        });

      })
      .catch(error => console.error('Errore OpenWeatherMap (5-day forecast):', error));
  }

}
