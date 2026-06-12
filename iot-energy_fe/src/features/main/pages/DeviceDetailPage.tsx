import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDeviceDetailApi,
    type DeviceDetailResponse,
} from "../../../api/deviceApi";
import UserLayout from "../../../layouts/UserLayout";
import {
    DEVICE_STATUS_LABELS,
    formatDeviceDateTime,
    formatRatedPower,
    getConnectionStatus,
} from "../utils/deviceUtils";

type DeviceDetail = DeviceDetailResponse["device"];

function formatMeasure(value?: number | null, unit = "") {
    if (value === null || value === undefined) {
        return "--";
    }

    return value + (unit ? " " + unit : "");
}

export default function DeviceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [device, setDevice] = useState<DeviceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDeviceDetail() {
            if (!id || Number.isNaN(Number(id))) {
                setError("Mã thiết bị không hợp lệ.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await getDeviceDetailApi(Number(id));
                setDevice(response.device);
            } catch {
                setDevice(null);
                setError("Không thể tải chi tiết thiết bị. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }

        void loadDeviceDetail();
    }, [id]);

    const latestLog = device?.energy_logs?.[0] ?? null;
    const isOnline = getConnectionStatus(device?.last_seen_at) === "online";

    return (
        <UserLayout>
            <header className="rounded-[32px] border border-white/70 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:px-8">
                <button
                    type="button"
                    onClick={() => navigate("/devices")}
                    className="mb-5 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                    Quay lại
                </button>

                <p className="text-sm font-medium uppercase tracking-[0.26em] text-emerald-300">
                    Chi tiết thiết bị
                </p>

                <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                    {device?.name ?? "Thiết bị"}
                </h2>
            </header>

            <section className="mt-6 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/5">
                {loading ? (
                    <p className="text-sm text-slate-500">
                        Đang tải chi tiết thiết bị...
                    </p>
                ) : error ? (
                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </p>
                ) : !device ? (
                    <p className="text-sm text-slate-500">
                        Không tìm thấy thiết bị.
                    </p>
                ) : (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Loại thiết bị
                                </p>
                                <p className="mt-2 text-xl font-bold text-slate-900">
                                    {device.device_type || "Khác"}
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Trạng thái kích hoạt
                                </p>
                                <p className="mt-2 text-xl font-bold text-slate-900">
                                    {DEVICE_STATUS_LABELS[device.status]}
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Kết nối
                                </p>
                                <p
                                    className={
                                        "mt-2 text-xl font-bold " +
                                        (isOnline
                                            ? "text-emerald-600"
                                            : "text-slate-500")
                                    }
                                >
                                    {isOnline ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <article className="rounded-3xl border border-slate-200 bg-white p-5">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Thông tin thiết bị
                                </h3>

                                <div className="mt-4 space-y-3 text-sm text-slate-600">
                                    <p>
                                        Công suất định mức:{" "}
                                        <span className="font-semibold text-slate-800">
                                            {formatRatedPower(device.rated_power)}
                                        </span>
                                    </p>

                                    <p>
                                        Lần gửi cuối:{" "}
                                        <span className="font-semibold text-slate-800">
                                            {formatDeviceDateTime(device.last_seen_at)}
                                        </span>
                                    </p>

                                    <p>
                                        Ngưỡng cảnh báo:{" "}
                                        <span className="font-semibold text-slate-800">
                                            {formatMeasure(
                                                Number(
                                                    device.alert_config?.power_threshold ??
                                                    device.alert_config?.default_threshold ??
                                                    device.alert_config?.max_power ??
                                                    NaN,
                                                ),
                                                "W",
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </article>

                            <article className="rounded-3xl border border-slate-200 bg-white p-5">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Thông số đo mới nhất
                                </h3>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">
                                            Công suất
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {formatMeasure(latestLog?.power, "W")}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">
                                            Điện áp
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {formatMeasure(latestLog?.voltage, "V")}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">
                                            Dòng điện
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {formatMeasure(latestLog?.current, "A")}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm text-slate-500">
                                            Điện năng
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {formatMeasure(latestLog?.energy, "kWh")}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <article className="rounded-3xl border border-slate-200 bg-white p-5">
                            <h3 className="text-lg font-bold text-slate-900">
                                Lịch sử đo gần đây
                            </h3>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-500">
                                            <th className="py-3 font-semibold">Thời gian</th>
                                            <th className="py-3 font-semibold">Công suất</th>
                                            <th className="py-3 font-semibold">Điện áp</th>
                                            <th className="py-3 font-semibold">Dòng điện</th>
                                            <th className="py-3 font-semibold">Điện năng</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(device.energy_logs ?? []).length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-4 text-slate-500"
                                                >
                                                    Chưa có dữ liệu đo.
                                                </td>
                                            </tr>
                                        ) : (
                                            (device.energy_logs ?? []).map((log) => (
                                                <tr
                                                    key={log.id}
                                                    className="border-b border-slate-100 text-slate-700"
                                                >
                                                    <td className="py-3">
                                                        {formatDeviceDateTime(log.created_at)}
                                                    </td>
                                                    <td className="py-3">
                                                        {formatMeasure(log.power, "W")}
                                                    </td>
                                                    <td className="py-3">
                                                        {formatMeasure(log.voltage, "V")}
                                                    </td>
                                                    <td className="py-3">
                                                        {formatMeasure(log.current, "A")}
                                                    </td>
                                                    <td className="py-3">
                                                        {formatMeasure(log.energy, "kWh")}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </div>
                )}
            </section>
        </UserLayout>
    );
}