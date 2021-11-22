import axios from "axios";
import { createRequestUrl } from "../utils";
import { AxiosResponse } from "./interfaces";


export function searchIcons(iconName: string): Promise<AxiosResponse<Array<string>>> {
    return axios.get(createRequestUrl(`iconSearch?iconName=${iconName}`))
}
