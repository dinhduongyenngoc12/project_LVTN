import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useHourPower } from "../../../main/hooks/useHourPower";

type HourPowerItem = {
    hour: string | number;
    power: string | number | null;
};

type TimePeriod = "low" | "normal" | "peak";

type ChartDataItem = {
    hour: string;
    power: number;
    period: TimePeriod;
};

const PERIOD_LABELS: Record<TimePeriod, string> = {
    low: "Thấp điểm",
    normal: "Bình thường",
    peak: "Cao điểm",
};

const PERIOD_COLORS: Record<TimePeriod, string> = {
    peak: "#f97316",
    low: "#2563eb",
    normal: "#10b981",
};

function getTodayInfo() {
    const today = new Date();

    return {
        dayOfWeek: today.getDay(),
        label: today.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    };

    //trong JVScript: 0 = CN, 1 = thu hai,...
}

function getTimePeriod(hour: number, dayOfWeek: number): TimePeriod {
    if (hour >= 0 && hour < 6) {
        return "low";
    }

    if (dayOfWeek !== 0 && hour >= 18 && hour <= 22) {
        return "peak";
    }

    return "normal";
}

function buildChartData(
    items: HourPowerItem[] = [],
    dayOfWeek: number
): ChartDataItem[] {
    const powerByHour = new Map(
        items.map((item) => [
            String(item.hour).slice(0, 2).padStart(2, "0"),
            Number(item.power ?? 0),
        ])   
        //tao map dang: { "05" => 276.8 }

    );

    return Array.from({ length: 24 }, (_, hour) => {      //tao 24 phan tu tuong ung 24h
        const hourKey = String(hour).padStart(2, "0");    //5 ->05

        return {
            hour: hourKey + ":00",
            power: powerByHour.get(hourKey) ?? 0,
            period: getTimePeriod(hour, dayOfWeek),
        };
    });
}

function CustomXAxisTick(props: any) {
    const { x, y, payload } = props;

    const hour = Number(String(payload.value).slice(0, 2));   //"05:00" → "05" → 5
    const today = getTodayInfo();
    const period = getTimePeriod(hour, today.dayOfWeek);

    return (
        <text
            x={x}
            y={y + 14}
            textAnchor="middle"
            fill={PERIOD_COLORS[period]}
            fontSize={12}
            fontWeight={600}
        >
            {payload.value}
        </text>
    );
}

function CustomTooltip({ active, payload, label }: any) {  //hop hien ra khi re chuot den
    if (!active || !payload?.length) {
        return null;
    }

    const item = payload[0].payload as ChartDataItem;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
            <p className="font-semibold text-slate-800">{label}</p>

            <p className="mt-1 text-slate-600">
                Công suất TB:{" "}
                <span className="font-semibold text-slate-900">
                    {item.power.toFixed(2)} W
                </span>
            </p>

            <p className="mt-1 text-slate-600">
                Khung giờ:{" "}
                <span
                    className="font-semibold"
                    style={{ color: PERIOD_COLORS[item.period] }}
                >
                    {PERIOD_LABELS[item.period]}
                </span>
            </p>
        </div>
    );
}

function CustomBarShape(props: any) {
    const item = props.payload as ChartDataItem;

    return (
        <rect
            x={props.x}
            y={props.y}
            width={props.width}
            height={props.height}
            rx={8}
            ry={8}
            fill={PERIOD_COLORS[item.period]}
        />
    );
}

export default function HourPowerChart() {
    const { data, isLoading, isError } = useHourPower();
    const today = getTodayInfo();

    if (isLoading) {
        return <div className="text-sm text-slate-500">Đang tải dữ liệu...</div>;
    }

    if (isError) {
        return (
            <div className="text-sm text-red-500">
                Không thể tải dữ liệu thống kê theo giờ.
            </div>
        );
    }

    const chartData = buildChartData(data?.data, today.dayOfWeek);      //chuan hoa du lieu: component lay duoc ca {data:[...]} & [...]

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                    Dữ liệu công suất trung bình theo từng giờ trong ngày.
                </p>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <span className="font-semibold">Hôm nay:</span>{" "}
                    {today.label}
                </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: PERIOD_COLORS.peak }}
                    />
                    <span>Cao điểm</span>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: PERIOD_COLORS.normal }}
                    />
                    <span>Bình thường</span>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: PERIOD_COLORS.low }}
                    />
                    <span>Thấp điểm</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis

                        dataKey="hour"
                        tick={<CustomXAxisTick />}
                    />

                    <YAxis />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                        dataKey="power"
                        name="Công suất trung bình (W)"
                        shape={<CustomBarShape />}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                    Quyết định số 963/QĐ-BCT về khung giờ cao điểm, thấp điểm và giờ bình thường của hệ thống điện quốc gia:
                </p>

                <h6 className="mt-2 font-bold text-slate-700">
                    Khung giờ cao điểm áp dụng:
                </h6>
                <p>
                    <span className="italic">Các ngày từ thứ Hai đến thứ Bảy:</span> từ 17h30 đến 22h30 (05 giờ/ngày).
                </p>
                <p>
                    <span className="italic">Ngày Chủ nhật:</span> không có giờ cao điểm.
                </p>

                <h6 className="mt-2 font-bold text-slate-700">
                    Khung giờ bình thường áp dụng:
                </h6>
                <p>
                    <span className="italic">Các ngày từ thứ Hai đến thứ Bảy:</span> từ 06h00 đến 17h30 và từ 22h30 đến 24h00 (13 giờ/ngày).
                </p>
                <p>
                    <span className="italic">Ngày Chủ nhật:</span> từ 06h00 đến 24h00 (18 giờ/ngày).
                </p>

                <h6 className="mt-2 font-bold text-slate-700">
                    Khung giờ thấp điểm áp dụng:
                </h6>
                <p>
                    <span className="italic">Tất cả các ngày trong tuần:</span> từ 00h00 đến 06h00 (06 giờ/ngày).
                </p>

                <p className="mt-3 text-xs italic text-slate-500">
                    Lưu ý: Biểu đồ đang thống kê theo từng giờ, nên khung giờ
                    17h30 - 22h30 được thể hiện gần đúng theo các mốc giờ tròn.
                </p>
            </div>
        </div>
    );
}