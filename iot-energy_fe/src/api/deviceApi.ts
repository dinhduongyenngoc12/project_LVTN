import { getData, patchData, postData } from "../services/http";

export type DeviceStatus = "pending" | "active" | "disabled";

export type DeviceItem = {
    id: number;
    user_id?: number | null;
    name: string;
    device_type: string;
    rated_power?: number | null;
    api_key?: string | null;
    status: DeviceStatus;
    last_seen_at?: string | null;
    activated_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;

    // Dùng khi backend trả kèm thông tin user sở hữu thiết bị.
    username?: string | null;
    user?: {
        id?: number;
        username?: string | null;
        email?: string | null;
    };
};

export type DevicePayload = {
    name: string;
    device_type: string;
    rated_power?: number | null;
    status?: DeviceStatus;
};

export type DevicesResponse = {
    status: string;
    message?: string;
    keyword?: string;
    devices: DeviceItem[];
    pagingData?: Record<string, unknown>;
};

export type DeviceMutationResponse = {
    status: string;
    message?: string;
    device?: DeviceItem;
};

export async function getDevicesApi(): Promise<DevicesResponse> {
    return await getData<DevicesResponse>("/api/devices");
}


export async function createDeviceApi(
    data: DevicePayload,
): Promise<DeviceMutationResponse> {
    return await postData<DeviceMutationResponse, DevicePayload>(
        "/api/devices",
        data,
    );
}

export async function updateDeviceApi(
    id: number,
    data: DevicePayload,
): Promise<DeviceMutationResponse> {
    return await patchData<DeviceMutationResponse, DevicePayload>(
        "/api/devices/" + id,
        data,
    );
}

//chi tiet thiet bi
export type DeviceDetailResponse = {
    status: string;
    device: DeviceItem & {
        alert_config?: {
            id: number;
            device_id: number;
            default_threshold?: number | string | null;
            power_threshold?: number | string | null;
            mode?: string | null;
            learning_status?: string | null;
            max_power?: number | string | null;
        } | null;
        energy_logs?: {
            id: number;
            device_id: number;
            power?: number | null;
            voltage?: number | null;
            current?: number | null;
            energy?: number | null;
            is_valid?: boolean | number | null;
            created_at?: string | null;
        }[];
    };
};

export async function getDeviceDetailApi(
    id: number,
): Promise<DeviceDetailResponse> {
    return await getData<DeviceDetailResponse>("/api/devices/" + id);
}

