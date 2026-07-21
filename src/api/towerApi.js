import api from "./api";

export async function getTowers() {
    const response = await api.get("/towers");
    return response.data;
}