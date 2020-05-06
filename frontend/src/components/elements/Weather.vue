<template>
  <transition name="fade">
    <div v-if="weather" class="weather">
      <div class="inline-block align-middle">
        <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" />
      </div>

      <div class="inline-block align-middle">
        <h1>{{ weather.weather[0].description }}</h1>
        <h1 class="text-4xl">{{ Math.round(weather.main.temp) }}°C</h1>
        <!-- <h1>Feels like: {{ Math.round(weather.main.feels_like) }}°C</h1>
        <h1>Highs: {{ Math.round(weather.main.temp_max) }}°C</h1>
        <h1>Lows: {{ Math.round(weather.main.temp_min) }}°C</h1>
        <h1>Humidity: {{ Math.round(weather.main.humidity) }}%</h1>-->
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";

export default {
  name: "Weather",
  data: function() {
    return {
      weather: null
    };
  },
  props: {
    config: Object,
    endpoint: String
  },
  methods: {
    getWeather: function() {
      axios
        .get(`${this.endpoint}/weather?city=${this.config.weather.location}`)
        .then(response => {
          this.weather = response.data;
        })
        .catch(() => {
          console.log("Error getting weather data");
        });
    }
  },
  mounted: function() {
    this.getWeather();
  }
};
</script>