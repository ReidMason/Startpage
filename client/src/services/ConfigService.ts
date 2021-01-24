import axios from "axios";
import { createRequestUrl } from "../utils";
import { AxiosResponse } from "./interfaces";

export interface IConfiguration {
    version: number;
    general: IGeneralConfig;
    apps: Array<IApp>;
    providers: Array<IProvider>;
    weather: IWeatherConfig;
}

export interface IWeatherConfig {
    enabled: boolean;
    location: string;
}

export interface IGeneralConfig {
    searchUrl: string;
    calendarUrl: string;
    searchPlaceholder: string;
}

export interface IApp {
    id: string;
    name: string;
    url: string;
    icon: string;
}

export interface IProvider {
    id: string;
    baseUrl: string;
    name: string;
    prefix: string;
    searchUrl: string;
}

// Endpoints

export function getConfig(): Promise<AxiosResponse<IConfiguration>> {
    return axios.get(createRequestUrl("config"))
}

export function saveConfig(config: IConfiguration): Promise<AxiosResponse<boolean>> {
    return axios.put(createRequestUrl("config"), config)
}