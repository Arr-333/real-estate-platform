"use client";

import { useState, useEffect } from "react";

export default function usePaginatedFetch(url, initialLimit = 5) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1); // reset when URL changes
  }, [url]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const separator = url.includes("?") ? "&" : "?";

        const res = await fetch(
          `${url}${separator}page=${page}&limit=${limit}`
        );

        if (!res.ok) throw new Error("Failed request");

        const result = await res.json();

        setData(result.data || []);
        setTotalPages(result.totalPages || 1);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, limit, url]);

  return { data, page, setPage, totalPages, loading, limit, setLimit };
}
