import { useQuery } from "@tanstack/react-query";
import { energyLogApi } from "../../../api/energyLogApi";

export const useHourPower = () => {
    return useQuery({
        queryKey: ["hour-power"],
        queryFn: energyLogApi.getHourPower
    });
};
