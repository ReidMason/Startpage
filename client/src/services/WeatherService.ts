import axios from "axios";
import { createRequestUrl } from "../utils";
import { AxiosResponse } from "./interfaces";

export interface IWeather {
    temperature: number;
    description: string;
    icon: string;
}

// Endpoints

export function getWeather(): Promise<AxiosResponse<IWeather>> {
    return axios.get(createRequestUrl("weather"))
}
