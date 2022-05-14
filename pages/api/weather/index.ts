import { NextApiRequest, NextApiResponse } from "next";
import { getWeatherData } from "../../../services/weather/weather";

export default async function getweather(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var weatherData = await getWeatherData();
  const status = weatherData === null ? 400 : 200;
  res.status(status).json(weatherData);
}
