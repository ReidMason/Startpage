import { Icon } from '@iconify/react-with-api';
import Image from 'next/image';
import Weather from '../interfaces/Weather';

interface WeatherDisplayProps {
    weatherData: Weather;
    detailed?: boolean;
}

export default function WeatherDisplay({ weatherData, detailed }: WeatherDisplayProps) {
    return (
        <div>
            <div className="flex">
                <div>
                    <Image src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="weather" width={100} height={100} />
                </div>
                <div className="my-auto">
                    <p className="capitalize mb-2">{weatherData.description}</p>
                    <div className="flex gap-4 items-end justify-between">
                        <p className="text-4xl">{Math.round(weatherData.temperature)}°C</p>
                        {detailed &&
                            <div className="flex gap-1 items-center mb-1 text-lg">
                                <Icon icon="bi:cloud-rain-heavy-fill" />
                                <span>{Math.round(weatherData.rainChance * 100)}%</span>
                            </div>
                        }
                    </div>

                    {detailed &&
                        <div className="flex flex-col text-lg">
                            <span>Feels Like {Math.round(weatherData.feelsLike)}°C</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
