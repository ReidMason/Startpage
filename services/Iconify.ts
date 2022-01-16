import { IconifySearchResponse } from "../interfaces/IconifySearchResponse";

export async function searchIcons(iconName: string): Promise<Array<string>> {
    const url = `https://api.iconify.design/search?query=${iconName}&limit=96`;
    const res = await fetch(url);
    const data: IconifySearchResponse = await res.json();

    return data.icons;
}
