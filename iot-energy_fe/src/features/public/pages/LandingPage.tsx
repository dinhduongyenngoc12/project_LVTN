import { Link } from "react-router-dom";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const slides = [
  {
    title: "IOT ENERGY",
    description: "Giải pháp giám sát điện năng thông minh sử dụng công nghệ IoT, hỗ trợ theo dõi dữ liệu điện theo thời gian thực.",
    meta: ["IoT", "MySQL", "Website"]
  },
  {
    title: "Internet Vạn Vật - IoT",
    description: "Internet of Things (IoT) là mô hình kết nối các thiết bị vật lý với mạng Internet nhằm thu thập, trao đổi và xử lý dữ liệu một cách tự động. ",
    meta: ["Devices & Sensors", "Connectivity", "Cloud & Servers", "User Interface"]
  },
  {
    title: "Giám sát điện năng thông minh với IoT",
    description: "Theo dõi điện năng từ thiết bị IoT theo thời gian thực, giúp người dùng theo dõi tình trạng tiêu thụ điện mọi lúc, mọi nơi thông qua nền tảng web.",
    meta: ["ESP32", "Realtime", "Dashboard"]
  },
  {
    title: "Thu thập dữ liệu liên tục",
    description: "Ghi nhận điện áp, dòng điện, công suất và điện năng tiêu thụ, sau đó đồng bộ dữ liệu lên máy chủ.",
    meta: ["Power", "Voltage", "Current", "Energy"]
  },
  {
    title: "Thống kê và ước tính chi phí",
    description: "Tổng hợp dữ liệu tiêu thụ, hỗ trợ đánh giá thói quen sử dụng và ước tính chi phí điện.",
    meta: ["Biểu đồ", "Báo cáo", "Chi phí"]
  },
  {
    title: "Đối tượng sử dụng",
    description: "Phù hợp cho hộ gia đình, phòng trọ, cửa hàng kinh doanh nhỏ và các mô hình nghiên cứu IoT",
    meta: ["Điện dân dụng 220V", "Wifi"]
  }
];

const workflowItems = [
  {
    title: "Nguồn điện",
    description: "Nguồn điện là nơi phát sinh các thông số điện năng như điện áp, dòng điện và công suất để hệ thống thực hiện đo lường.",
  },
  {
    title: "PZEM - 004T",
    description: "Cảm biến PZEM-004T thực hiện thu thập dữ liệu điện năng từ nguồn điện.",
  },
  {
    title: "ESP32",
    description: "Vi điều khiển ESP32 nhận dữ liệu từ cảm biến điện năng.",
  },
  {
    title: "CakePHP API",
    description: "Tiếp nhận, xác thực và xử lý dữ liệu.",
  },
  {
    title: "MySQL",
    description: "Hệ quản trị Cơ sở dữ liệu MySQL nhận và thực hiện lưu trữ dữ liệu.",
  },
  {
    title: "Ứng dụng Web IE",
    description: "Ứng dụng Web truy xuất dữ liệu để hiển thị, thống kê, cảnh báo và hỗ trợ người dùng giám sát điện năng theo thời gian thực..",
  },
];

const benefits = [
  "Giám sát điện năng theo thời gian thực",
  "Quản lý thiết bị tập trung",
  "Phát hiện sớm tiêu thụ bất thường",
  "Cảnh báo vượt ngưỡng tự động",
  "Quản lý ngưỡng theo từng thiết bị",
  "Hỗ trợ thống kê và tối ưu chi phí điện",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2fff8] text-slate-950">
      <header className="border-b border-emerald-100/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white">
              IE
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                IoT Energy
              </p>
              <h1 className="truncate text-base font-bold text-slate-950 sm:text-lg">
                Giám sát điện năng
              </h1>
            </div>
          </div>

        </div>
      </header>

      <main>
        <section className="mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-7xl flex-col justify-center px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="mx-auto max-w-fit text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600 sm:text-sm">
            Hệ thống giám sát điện năng IoT
          </p>

          <h2 className="mx-auto mt-6 max-w-5xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Theo dõi điện năng tiêu thụ và cảnh báo vượt ngưỡng.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Hệ thống sử dụng ESP32 kết hợp cảm biến PZEM-004T để thu thập dữ liệu điện năng theo thời gian thực, truyền về máy chủ CakePHP lưu trữ trên MySQL
            và hiển thị trực quan trên Dashboard giúp người dùng theo dõi, phân tích và tối ưu hóa việc sử dụng điện năng.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex justify-center rounded-2xl bg-emerald-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
            >
              Bắt đầu
            </Link>

            <a
              href="#workflow"
              className="inline-flex justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Xem quy trình
            </a>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-5 flex flex-col gap-2 text-left sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  Giới thiệu
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                  Thông tin Hệ thống Theo dõi điện năng và cảnh báo vượt ngưỡng
                </h3>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[28px] border border-white bg-white p-3 shadow-2xl shadow-emerald-100 sm:p-4">
              <Swiper
                modules={[Autoplay, Pagination, Scrollbar]}
                slidesPerView={1}
                spaceBetween={16}
                breakpoints={{
                  768: {
                    slidesPerView: 1,
                  },
                  1280: {
                    slidesPerView: 2.2, //2 slide full + 1 phần slide tiếp theo
                  },
                }}
                pagination={{ clickable: true }}
                scrollbar={{ hide: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                observer
                observeParents
                resizeObserver
                className="min-w-0 overflow-hidden pb-10 [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.title} className="h-auto">
                    <div className="flex h-full min-h-[420px] flex-col rounded-[28px] bg-slate-950 p-8 text-white sm:min-h-[380px] lg:min-h-[400px]">
                      <h3 className="min-h-[88px] text-2xl font-bold leading-tight sm:min-h-[70px] sm:text-3xl">
                        {slide.title}
                      </h3>

                      <p className="min-h-[120px] text-base leading-8 text-slate-100">
                        {slide.description}
                      </p>

                      <div className="mt-auto flex flex-wrap justify-center gap-3 pt-8">
                        {slide.meta.map((item) => (
                          <span
                            key={item}
                            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-emerald-100 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                Quy trình hoạt động
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {workflowItems.map((item, index) => (
                <article
                  key={item.title}
                  className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold text-emerald-600">
                    Bước {index + 1}
                  </p>

                  <h4 className="mt-3 min-h-[30px] text-xl font-bold text-slate-950">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Lợi ích chính
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit}
                className="rounded-[24px] border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-100/50"
              >
                <p className="text-sm leading-6 text-slate-700">
                  {benefit}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
