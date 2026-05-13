import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthLoginStore } from "../../../app/store/useAuthStore";
import { useLogoutForm } from "../../auth/hooks/useAuthForm";
import {
    getDevicesApi,
    getEnergyLogsApi,
    getMeApi,
    getThresholdsApi,
    getUsersApi,
    type UserProfile,
} from "../../services/HomeService";
import {
    buildDashboardDevices,
    formatDateTime,
    formatPower,
} from "../../main/utils/homeDashboard";
import {
    buildAdminDashboardData,
    createEmptyAdminDashboardData,
    type AdminDashboardData,
} from "../utils/adminDashboard";

const menuItems = [
    { label: "Admin Dashboard", path: "/admin" },
    { label: "User Home", path: "/" },
    { label: "Devices", path: "/devices" },
];

const emptyDashboard = createEmptyAdminDashboardData();

function getMenuItemClass(isActive: boolean) {
    const commonClass = "min-w-fit rounded-2xl px-4 py-3";
    const selectedClass = "bg-amber-500 text-slate-950";
    const normalClass = "bg-slate-100 text-slate-700";

    return isActive ? commonClass + " " + selectedClass : commonClass + " " + normalClass;
}

function getAlertDiffLabel(latestPower: number | null, maxPower: number | null): string {
    if (latestPower === null || maxPower === null) {
        return "--";
    }

    return Math.round(latestPower - maxPower) + " W";
}

export default function AdminDashboardPage() {
    const { handleLogout } = useLogoutForm();
    const { username, email } = useAuthLoginStore();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [dashboard, setDashboard] = useState<AdminDashboardData>(emptyDashboard);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchAdminData = async () => {
            setLoading(true);
            setError("");

            try {
                const [meData, usersData, devicesData, energyLogsData, thresholdsData] = await Promise.all([
                    getMeApi(),
                    getUsersApi(),
                    getDevicesApi(),
                    getEnergyLogsApi(),
                    getThresholdsApi(),
                ]);

                if (!isMounted) {
                    return;
                }

                const dashboardDevices = buildDashboardDevices(
                    devicesData.devices ?? [],
                    energyLogsData.energyLogs ?? [],
                    thresholdsData.thresholds ?? [],
                );

                setUser(meData.user ?? null);
                setDashboard(buildAdminDashboardData(dashboardDevices, usersData.totalUsers ?? 0));
            } catch {
                if (!isMounted) {
                    return;
                }

                setUser(null);
                setDashboard(createEmptyAdminDashboardData());
                setError("Không thể tải dữ liệu Dashboard Admin. Vui lòng thử lại!");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchAdminData();

        return () => {
            isMounted = false;
        };
    }, []);

    const displayName = user?.username || username || "Admin";
    const displayEmail = user?.email || email || "No email";

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.20),_transparent_30%),linear-gradient(145deg,_#fffaf0_0%,_#f8fafc_45%,_#e2e8f0_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
                <aside className="rounded-[28px] border border-amber-100 bg-white/85 p-5 shadow-xl shadow-amber-100/60 backdrop-blur lg:w-80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-slate-950">
                            AD
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
                                Admin Portal
                            </p>
                            <h1 className="mt-1 text-xl font-bold text-slate-900">
                                IoT Energy
                            </h1>
                        </div>
                    </div>

                    <nav className="mt-6 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => getMenuItemClass(isActive)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">{displayName}</p>
                        <p className="mt-2 break-all">{displayEmail}</p>
                    </div>

                    <div className="mt-6 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                <main className="flex-1">
                    <header className="rounded-[32px] border border-white/70 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.26em] text-amber-300">
                                    Admin dashboard
                                </p>
                                <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
                                    Giám sát hệ thống điện năng, cảnh báo vượt ngưỡng và ưu tiên xử lý theo mức độ
                                </h2>
                            </div>
                        </div>
                    </header>

                    {error && (
                        <section className="mt-6 rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-lg shadow-rose-100/70">
                            {error}
                        </section>
                    )}

                    <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                        <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
                            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Tổng user</p>
                            <p className="mt-3 text-4xl font-bold text-slate-950">
                                {loading ? "--" : dashboard.summary.totalUsers}
                            </p>
                        </article>
                        {/* <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
                            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Tổng thiết bị</p>
                            <p className="mt-3 text-4xl font-bold text-slate-950">
                                {loading ? "--" : dashboard.summary.totalDevices}
                            </p>
                        </article> */}
                        <article className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-xl shadow-emerald-100/60">
                            <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">Thiết bị hoạt động</p>
                            <p className="mt-3 text-4xl font-bold text-emerald-900">
                                {loading ? "--" : dashboard.summary.activeDevices}
                            </p>
                        </article>
                        <article className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-xl shadow-rose-100/60">
                            <p className="text-sm uppercase tracking-[0.22em] text-rose-700">Cảnh báo vượt ngưỡng</p>
                            <p className="mt-3 text-4xl font-bold text-rose-900">
                                {loading ? "--" : dashboard.summary.overThresholdDevices}
                            </p>
                        </article>
                        <article className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 shadow-xl shadow-amber-100/60">
                            <p className="text-sm uppercase tracking-[0.22em] text-amber-700">Thiết bị chưa có ngưỡng tiêu thụ cài đặt</p>
                            <p className="mt-3 text-4xl font-bold text-amber-900">
                                {loading ? "--" : dashboard.summary.devicesWithoutThreshold}
                            </p>
                        </article>
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-600">
                                        Danh sách cảnh báo ưu tiên:
                                    </p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-950">
                                        Thiết bị vượt ngưỡng:
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {!loading && dashboard.alertDevices.length === 0 && (
                                    <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                        Hiện không có thiết bị nào vượt ngưỡng
                                    </p>
                                )}

                                {dashboard.alertDevices.map((device) => (
                                    <div
                                        key={device.id}
                                        className="rounded-3xl border border-rose-100 bg-rose-50 p-4"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-950">{device.name}</h4>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    User: {device.username || "Chưa gán user"}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Cập nhật lúc: {formatDateTime(device.lastUpdated)}
                                                </p>
                                            </div>
                                            <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                                                <p>Hiện tại: {formatPower(device.latestPower)}</p>
                                                <p>Ngưỡng tiêu thụ: {formatPower(device.maxPower)}</p>
                                                <p>Vượt: {getAlertDiffLabel(device.latestPower, device.maxPower)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-2">
                        <article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
                                Tổng hợp theo user
                            </p>
                            <div className="mt-5 overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-700">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-500">
                                            <th className="px-3 py-3 font-semibold">User</th>
                                            <th className="px-3 py-3 font-semibold">Thiết bị</th>
                                            <th className="px-3 py-3 font-semibold">Hoạt động</th>
                                            <th className="px-3 py-3 font-semibold">Cảnh báo</th>
                                            <th className="px-3 py-3 font-semibold">Công suất</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.userSummaries.map((item) => (
                                            <tr key={item.username} className="border-b border-slate-100">
                                                <td className="px-3 py-3 font-medium text-slate-900">{item.username}</td>
                                                <td className="px-3 py-3">{item.totalDevices}</td>
                                                <td className="px-3 py-3">{item.activeDevices}</td>
                                                <td className="px-3 py-3 text-rose-600">{item.overThresholdDevices}</td>
                                                <td className="px-3 py-3">{formatPower(item.totalPower)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {!loading && dashboard.userSummaries.length === 0 && (
                                    <p className="mt-4 text-sm text-slate-500">Chưa có dữ liệu user để tổng hợp</p>
                                )}
                            </div>
                        </article>

                        <article className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                                Top thiết bị tiêu thụ cao
                            </p>
                            <div className="mt-5 space-y-4">
                                {dashboard.topConsumers.map((device) => (
                                    <div key={device.id} className="rounded-3xl bg-slate-50 p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-slate-950">{device.name}</h4>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    User: {device.username || "Chưa gán user"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-slate-950">
                                                    {formatPower(device.latestPower)}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Threshold: {formatPower(device.maxPower)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {!loading && dashboard.topConsumers.length === 0 && (
                                    <p className="text-sm text-slate-500">Chưa có dữ liệu!</p>
                                )}
                            </div>
                        </article>
                    </section>
                </main>
            </div>
        </div>
    );
}
