import { useEffect, useState } from "react";
import { useAuthLoginStore } from "../../../app/store/useAuthStore";
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
    buildDashboardSummary,
    type DashboardSummary,
} from "../utils/homeDashboard";

const emptySummary: DashboardSummary = {
    totalPower: 0,
    activeDevices: 0,
    overThresholdDevices: 0,
    totalDevices: 0,
};

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

export default function DashboardPage() {
    const { username, email } = useAuthLoginStore();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [summary, setSummary] = useState<DashboardSummary>(emptySummary);

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
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
                setSummary(buildDashboardSummary(dashboardDevices));
            } catch {
                if (!isMounted) {
                    return;
                }

                setUser(null);
                setSummary(emptySummary);
            }
        };

        void fetchDashboardData();

        const intervalId = window.setInterval(() => {
            void fetchDashboardData();
        }, 10000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);

    const displayName = user?.username || username || "User";
    const displayEmail = user?.email || email || "No email";

    return (
        <UserLayout>
            <header className="rounded-[32px] border border-white/70 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.26em] text-emerald-300">
                            Dashboard
                        </p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                            Theo dõi điện năng tiêu thụ
                        </h2>
                    </div>
                </div>
            </header>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <article className="rounded-[28px] border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60 backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                        Người dùng
                    </p>

                    <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {displayName}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {displayEmail}
                            </p>
                        </div>
                    </div>
                </article>

                <article className="rounded-[28px] border border-sky-100 bg-white/90 p-6 shadow-xl shadow-sky-100/60 backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
                        Trạng thái hệ thống
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Tổng thiết bị</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {summary.totalDevices}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Cảnh báo đang mở</p>
                            <p className="mt-2 text-3xl font-bold text-rose-600">
                                {summary.overThresholdDevices}
                            </p>
                        </div>
                    </div>
                </article>
            </section>

            {summary.overThresholdDevices > 0 && (
                <section className="mt-6 rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900 shadow-lg shadow-rose-100/70">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                        Cảnh báo
                    </p>
                    <p className="mt-2 text-base font-medium">
                        Có {summary.overThresholdDevices} thiết bị đang vượt ngưỡng tiêu thụ cài đặt
                    </p>
                </section>
            )}
        </UserLayout>  //menu
    );
}