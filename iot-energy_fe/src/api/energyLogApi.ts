import { axiosClient } from "../lib/axiosClient";

export const energyLogApi = {
    getHourPower: async () => {
        const response = await axiosClient.get(
            "/api/energy-logs/hour-power"
        );
        return response.data;
    },

    getDayPower: async () => {
        const response = await axiosClient.get(
            "/api/energy-logs/day-power"
        );
        return response.data;
    },

    getMonthPower: async () => {
        const response = await axiosClient.get(
            "/api/energy-logs/month-power"
        );
        return response.data;
    },
};
