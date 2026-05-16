"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SalesChart() {
  return (
    <Chart
      options={{
        chart: { type: "line", toolbar: { show: false } },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        },
      }}
      series={[{ name: "Sales", data: [20, 45, 30, 60, 70, 55] }]}
      type="line"
      height={100}
    />
  );
}
