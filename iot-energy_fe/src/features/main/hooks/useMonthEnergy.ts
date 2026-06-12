import { useQuery } from "@tanstack/react-query";
import { energyLogApi } from "../../../api/energyLogApi";


export const useMonthPower = () => {
    return useQuery({
        queryKey: ["month-energy"],
        queryFn: energyLogApi.getMonthPower,
        staleTime: 0,
        refetchOnMount: "always",
    });
};
