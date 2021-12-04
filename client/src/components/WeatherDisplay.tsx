import { Icon } from '@iconify/react-with-api';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../views/startpage/globalContext';
import * as weatherService from "../services/WeatherService";
import { IWeather } from '../services/WeatherService';

export default function WeatherDisplay() {
    const { config } = useContext(GlobalContext)!;
    const [weather, setWeather] = useState<IWeather | null>(null)

    useEffect(() => {
        // Load weather
        weatherService.getWeather().then((response) => {
            setWeather(response.data);
        });
    }, [config]);

    return (
        <div>
            {weather && config &&
                <div className="flex">
                    <div>
                        <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather" />
                    </div>
                    <div className="my-auto">
                        <p className="capitalize mb-2">{weather.description}</p>
                        <div className="flex gap-4 items-end justify-between">
                            <p className="text-4xl">{Math.round(weather.temperature)}°C</p>
                            {config.weather.detailed &&
                                <div className="flex gap-1 items-center mb-1 text-lg">
                                    <Icon icon="bi:cloud-rain-heavy-fill" />
                                    <span>{Math.round(weather.rainChance * 100)}%</span>
                                </div>
                            }
                        </div>

                        {config.weather.detailed &&
                            <div className="flex flex-col text-lg">
                                <span>Feels Like {Math.round(weather.feelsLike)}°C</span>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
