"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TotalPropertiesChart({ range }) {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/listing?page=1&limit=100");
      const result = await res.json();

      const properties = result.data;

      const now = new Date();

      // ✅ FILTER BY DATE
      const filtered = properties.filter((item) => {
        const created = new Date(item.propertyCreatedOn);

        if (range === "weekly") {
          const diff = (now - created) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        }

        if (range === "monthly") {
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }

        return true;
      });

      // ✅ GROUP BY PROPERTY TYPE
      const map = {};

      filtered.forEach((item) => {
        const type = item.propertyType?.name || "Other";

        map[type] = (map[type] || 0) + 1;
      });

      setCategories(Object.keys(map));
      setChartData(Object.values(map));
    } catch (error) {
      console.error("Chart Fetch Error:", error);
    }
  };

  const series = [
    {
      name: "Properties",
      data: chartData,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 325,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
    },
    colors: ["#0ac072"],
  };

  return <Chart options={options} series={series} type="bar" height={325} />;
}
