import Axios, { AxiosResponse } from "axios";
import { createRequestUrl } from "../utils";

export interface IHueConnectionTest {
    connected: boolean;
}

export interface HueGroup {
    name: string;
    id: string;
    all_on: boolean;
    any_on: boolean;
    type: string;
}

export interface ToggleResponse {
    lightOn: boolean;
}

const SERVICE_URL = "philipsHue";

export function connect(ip?: string): Promise<AxiosResponse<IHueConnectionTest>> {
    return Axios.get(createRequestUrl(`${SERVICE_URL}/connect${ip && "?ip=" + ip}`));
}

export function getGroups(): Promise<AxiosResponse<Array<HueGroup>>> {
    return Axios.get(createRequestUrl(`${SERVICE_URL}/groups`));
}

export function toggleGroup(groupId: string): Promise<AxiosResponse<ToggleResponse>> {
    return Axios.post(createRequestUrl(`${SERVICE_URL}/toggleGroup?id=${groupId}`))
}