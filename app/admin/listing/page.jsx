"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";

export default function ListingPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ pagination state (IMPORTANT)
  const [page, setPage] = useState(0); // DataGrid starts from 0
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const columns = [
    { field: "propertyListId", headerName: "ID", width: 70 },
    { field: "propertyTitle", headerName: "Title", width: 200 },
    { field: "propertyTypeId", headerName: "Type", width: 130 },
    { field: "cityName", headerName: "City", width: 120 },
    { field: "stateName", headerName: "State", width: 120 },
    {
      field: "propertyRent",
      headerName: "Rent (₹)",
      width: 110,
      renderCell: ({ value }) => `₹${Number(value).toLocaleString("en-IN")}`,
    },
    { field: "propertySize", headerName: "Size (SqFt)", width: 110 },
    { field: "propertyFurnishedStatus", headerName: "Furnished", width: 120 },
    { field: "propertyRentalTerm", headerName: "Term", width: 100 },
    {
      field: "propertyAvailability",
      headerName: "Availability",
      width: 120,
    },
    {
      field: "propertyListStatus",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => (
        <span
          className={`badge ${value === "ACTIVE" ? "bg-success" : value === "INACTIVE" ? "bg-secondary" : "bg-warning text-dark"}`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "propertyCreatedOn",
      headerName: "Created",
      width: 110,
      renderCell: ({ value }) =>
        value ? new Date(value).toLocaleDateString("en-IN") : "-",
    },
    {
      field: "edit",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: ({ row }) => (
        <Link href={`/admin/listing/verify/${row.propertyListId}`}>
          <button className="btn btn-success btn-sm">Verify</button>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => deleteItem(row.propertyListId)}
        >
          Delete
        </button>
      ),
    },
  ];

  async function getData() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/listing?page=${page + 1}&limit=${pageSize}`
      );

      const result = await res.json();

      setData(result.data || []);
      setRowCount(result.total || 0);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    if (window.confirm("Are you sure you want to delete this property?")) {
      const res = await fetch(`/api/listing/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Deleted successfully");
        getData();
      } else {
        alert("Failed to delete");
      }
    }
  }

  useEffect(() => {
    getData();
  }, [page, pageSize]);

  return (
    <div className="row">
      <div className="col-lg-3 col-md-3">
        <Sidebar />
      </div>
      <div className="col-lg-9 col-md-9">
        <h5 className="text-dark text-center mt-2 p-2">
          Property Listings
          <Link href="/admin/listing/add">
            <i className="fa fa-plus text-light float-end"></i>
          </Link>
        </h5>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.propertyListId}
            loading={loading}
            // 🔥 SERVER-SIDE PAGINATION
            paginationMode="server"
            rowCount={rowCount}
            paginationModel={{
              page,
              pageSize,
            }}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}
