import { useEffect, useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import {
    getDevicesApi,
    getEnergyLogsApi,
    getMeApi,
    getThresholdsApi,
    type UserProfile,
} from "../../services/HomeService";
import {
    buildDashboardDevices,
    formatDateTime,
    formatPower,
    type DashboardDevice,
} from "../utils/homeDashboard";

function normalizeId(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

export default function DevicePage() {
    const [, setUser] = useState<UserProfile | null>(null);
    const [devices, setDevices] = useState<DashboardDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchDeviceData = async () => {
            setLoading(true);
            setError("");

            try {
                const [meData, devicesData, energyLogsData, thresholdsData] = await Promise.all([
                    getMeApi(),
                    getDevicesApi(),
                    getEnergyLogsApi(),
                    getThresholdsApi(),
                ]);

                if (!isMounted) {
                    return;
                }

                const currentUserId = normalizeId(meData.user?.id);
                const scopedDevices = (devicesData.devices ?? []).filter(
                    (device) => currentUserId !== null && normalizeId(device.user_id) === currentUserId,
                );
                const deviceIds = new Set(
                    scopedDevices
                        .map((device) => normalizeId(device.id ?? device.pk))
                        .filter((deviceId): deviceId is number => deviceId !== null),
                );
                const scopedEnergyLogs = (energyLogsData.energyLogs ?? []).filter((log) => {
                    const deviceId = normalizeId(log.device_id);
                    return deviceId !== null && deviceIds.has(deviceId);
                });
                const scopedThresholds = (thresholdsData.thresholds ?? []).filter((threshold) => {
                    const deviceId = normalizeId(threshold.device_id);
                    return deviceId !== null && deviceIds.has(deviceId);
                });

                const dashboardDevices = buildDashboardDevices(
                    scopedDevices,
                    scopedEnergyLogs,
                    scopedThresholds,
                );

                setUser(meData.user ?? null);
                setDevices(dashboardDevices);
            } catch {
                if (!isMounted) {
                    return;
                }

                setUser(null);
                setError("Hệ thống không thể tải danh sách thiết bị. Vui lòng thử lại.");
                setDevices([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchDeviceData();

        const intervalId = window.setInterval(() => {
            void fetchDeviceData();
        }, 10000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);

    return (
        <UserLayout>
            <header className="rounded-[32px] border border-white/70 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.26em] text-emerald-300">
                            Thiết bị
                        </p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                            Danh sách thiết bị của người dùng
                        </h2>
                    </div>
                </div>
            </header>

            <section className="mt-6 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur">
                {loading ? (
                    <p className="text-sm text-slate-500">Đang tải dữ liệu thiết bị...</p>
                ) : error ? (
                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </p>
                ) : devices.length === 0 ? (
                    <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Chưa có thiết bị nào thuộc user của phiên này.
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {devices.map((device) => (
                            <div
                                key={device.id}
                                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <h3 className="text-lg font-bold text-slate-900">{device.name}</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Công suất hiện tại: {formatPower(device.latestPower)}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Ngưỡng tối đa: {formatPower(device.maxPower)}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Cập nhật lúc: {formatDateTime(device.lastUpdated)}
                                </p>
                                <p
                                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                        device.isOverThreshold
                                            ? "bg-rose-100 text-rose-700"
                                            : "bg-emerald-100 text-emerald-700"
                                    }`}
                                >
                                    {device.isOverThreshold ? "Vượt ngưỡng" : "Bình thường"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </UserLayout>
    );
}
