/**
 * Dashboard util Chịu trách nhiệm:
 * - Ghép dữ liệu devices, energy_logs, alert_configs
 * - Tính toán dữ liệu Dashboard
 * - Format dữ liệu hiển thị
 */

import type { DeviceItem } from "../../../api/deviceApi";
import type {
    AlertConfigItem,
    EnergyLogItem,
} from "../../services/HomeService";


export type DashboardDevice = {
    id: number;
    name: string;
    deviceType: string;
    status: DeviceItem["status"];
    ratedPower: number | null;
    latestPower: number | null;
    lastUpdated: string | null;
    maxPower: number | null;
    alertConfigId: number | null;
    isActive: boolean;
    isOverThreshold: boolean;
};

export type DashboardSummary = {
    totalPower: number;
    activeDevices: number;
    overThresholdDevices: number;
    totalDevices: number;
};

//Lay dl dashboard thuoc ve user hien tai: giu tb cua user, energylog, alertconfig
export function buildUserDashboardData(
    input: UserDashboardDataInput,
): UserDashboardDataResult {
    const currentUserId = normalizeNumber(input.userId);

    if (currentUserId === null) {
        return {
            devices: [],
            energyLogs: [],
            alertConfigs: [],
        };
    }

    const devices = input.devices.filter(
        (device) => normalizeNumber(device.user_id) === currentUserId,
    );

    const deviceIds = new Set(
        devices.map((device) => device.id),
    );

    const energyLogs = input.energyLogs.filter((log) => {
        const deviceId = normalizeNumber(log.device_id);

        return (
            deviceId !== null &&
            deviceIds.has(deviceId)
        );
    });

    const alertConfigs = input.alertConfigs.filter(
        (alertConfig) => {
            const deviceId = normalizeNumber(
                alertConfig.device_id,
            );

            return (
                deviceId !== null &&
                deviceIds.has(deviceId)
            );
        },
    );

    return {
        devices,
        energyLogs,
        alertConfigs,
    };
}

export function buildDashboardDevices(
    devices: DeviceItem[],
    energyLogs: EnergyLogItem[],
    alertConfigs: AlertConfigItem[],
): DashboardDevice[] {
    const latestLogByDevice = buildLatestLogMap(energyLogs);
    const alertConfigByDevice = buildAlertConfigMap(alertConfigs);

    return devices.map((device) => {
        const latestLog = latestLogByDevice.get(device.id);
        const alertConfig = alertConfigByDevice.get(device.id);

        const latestPower = normalizeNumber(latestLog?.power);   //cong suat W do duoc gan nhat tu pzem

        const maxPower = normalizeNumber(                //Ưu tien lay power_threshold, neu khong co thi fallback sang default_threshold/max_power
            alertConfig?.power_threshold ??
            alertConfig?.default_threshold ??
            alertConfig?.max_power,
        );

        return {
            id: device.id,
            name: device.name,
            deviceType: device.device_type,
            status: device.status,
            ratedPower: normalizeNumber(device.rated_power),
            latestPower,
            lastUpdated: latestLog?.created_at ?? null,
            maxPower,
            alertConfigId: normalizeNumber(alertConfig?.id),
            isActive: latestPower !== null && latestPower > 0,             //dang tieu thu -> dang hoat dong
            isOverThreshold:
                latestPower !== null &&
                maxPower !== null &&
                latestPower > maxPower,
        };
    });
}

export function buildDashboardSummary(
    devices: DashboardDevice[],
): DashboardSummary {
    return {
        totalPower: devices.reduce(                          //tong cong suat hien tai tren tat ca tb
            (total, device) => total + (device.latestPower ?? 0),
            0,
        ),
        activeDevices: devices.filter((device) => device.isActive).length,
        overThresholdDevices: devices.filter((device) => device.isOverThreshold).length,
        totalDevices: devices.length,
    };
}

export function formatPower(power: number | null): string {
    if (power === null) {
        return "--";
    }

    return Math.round(power) + " W";
}

export function formatDateTime(value: string | null): string {
    if (!value) {
        return "Chưa có dữ liệu";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("vi-VN");
}

//tao Map<device_id, latest_log>, moi tb chi giu lai ban ghi moi nhat
function buildLatestLogMap(       
    energyLogs: EnergyLogItem[],
): Map<number, EnergyLogItem> {
    const latestLogByDevice = new Map<number, EnergyLogItem>();

    for (const log of energyLogs) {
        const deviceId = normalizeNumber(log.device_id);

        if (deviceId === null) {
            continue;
        }

        const currentLatestLog = latestLogByDevice.get(deviceId);

        if (!currentLatestLog || isLogNewer(log, currentLatestLog)) {      //ghi de neu log moi hon
            latestLogByDevice.set(deviceId, log);
        }
    }

    return latestLogByDevice;
}

function buildAlertConfigMap(
    alertConfigs: AlertConfigItem[],
): Map<number, AlertConfigItem> {
    const alertConfigByDevice = new Map<number, AlertConfigItem>();

    for (const alertConfig of alertConfigs) {
        const deviceId = normalizeNumber(alertConfig.device_id);

        if (deviceId === null) {
            continue;
        }

        if (!alertConfigByDevice.has(deviceId)) {
            alertConfigByDevice.set(deviceId, alertConfig);
        }
    }

    return alertConfigByDevice;
}

function normalizeNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function isLogNewer(
    nextLog: EnergyLogItem,
    currentLog: EnergyLogItem,
): boolean {
    const nextTimestamp = getLogTimestamp(nextLog);
    const currentTimestamp = getLogTimestamp(currentLog);

    if (nextTimestamp === currentTimestamp) {
        return nextLog.id > currentLog.id;
    }

    return nextTimestamp > currentTimestamp;
}

function getLogTimestamp(log: EnergyLogItem): number {        //Chuyen created_at thanh timestamp de de so sanh
    if (!log.created_at) {
        return 0;
    }

    const timestamp = Date.parse(log.created_at);

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

type UserDashboardDataInput = {
    userId: unknown;
    devices: DeviceItem[];
    energyLogs: EnergyLogItem[];
    alertConfigs: AlertConfigItem[];
};

type UserDashboardDataResult = {
    devices: DeviceItem[];
    energyLogs: EnergyLogItem[];
    alertConfigs: AlertConfigItem[];
};

