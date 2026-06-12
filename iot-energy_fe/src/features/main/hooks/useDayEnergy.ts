import { useQuery } from "@tanstack/react-query";
import { energyLogApi } from "../../../api/energyLogApi";


export const useDayPower = () => {
    return useQuery({
        queryKey: ["day-energy"],
        queryFn: energyLogApi.getDayPower,
        staleTime: 0,
        refetchOnMount: "always",
    });
};


