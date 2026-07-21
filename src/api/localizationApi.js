import api from "./api";

export async function getLocalization() {
    const response = await api.get("/localization");
    return response.data;
}