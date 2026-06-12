import { getData } from "../../services/http";

export type UserProfile = {
    id: number;
    username: string | null;
    email: string | null;
    role?: string | null;
};

export type MeResponse = {
    status: string;
    user: UserProfile;
};

export type UsersResponse = {
    status: string;
    totalUsers: number;
};

export type EnergyLogItem = {
    id: number;
    device_id?: number | null;
    power?: number | null;
    voltage?: number | null;
    current?: number | null;
    energy?: number | null;
    is_valid?: boolean | number | null;
    created_at?: string | null;
    device?: {
        id?: number;
        name?: string;
        status?: "pending" | "active" | "disabled";
        last_seen_at?: string | null;
    };
};

export type EnergyLogsResponse = {
    status: string;
    filters?: {
        device_id?: number | null;
        from?: string | null;
        to?: string | null;
    };
    energyLogs: EnergyLogItem[];
};

export type AlertConfigItem = {
    id: number;
    device_id?: number | null;
    default_threshold?: number | null;
    power_threshold?: number | null;
    mode?: string | null;
    learning_status?: string | null;
    max_power?: number | null;
};

export type AlertConfigsResponse = {
    status: string;
    alertConfigs?: AlertConfigItem[];
    thresholds?: AlertConfigItem[];
};

export async function getMeApi(): Promise<MeResponse> {
    return await getData<MeResponse>("/api/auth/me");
}

export async function getUsersApi(): Promise<UsersResponse> {
    return await getData<UsersResponse>("/api/users");
}

export async function getEnergyLogsApi(
    params?: Record<string, unknown>,
): Promise<EnergyLogsResponse> {
    return await getData<EnergyLogsResponse>("/api/energy-logs", params);
}

export async function getAlertConfigsApi(): Promise<AlertConfigsResponse> {
    return await getData<AlertConfigsResponse>("/api/alert-configs");
}