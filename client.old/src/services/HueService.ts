import Axios, { AxiosResponse } from "axios";
import { createRequestUrl } from "../utils";

export interface IHueConnectionTest {
    connected: boolean;
}

const SERVICE_URL = "philipsHue";

export function connect(ip?: string): Promise<AxiosResponse<IHueConnectionTest>> {
    return Axios.get(createRequestUrl(`${SERVICE_URL}/connect${ip && "?ip=" + ip}`))
}
