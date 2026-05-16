"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";

export default function Page() {
  const [data, setData] = useState([]);

  const columns = [
    { field: "cityId", headerName: "ID", width: 120 },

    {
      field: "cityName",
      headerName: "City Name",
      width: 220,
    },
    {
      field: "stateName",
      headerName: "State",
      width: 220,
    },
    {
      field: "lat",
      headerName: "Latitude",
      width: 220,
    },

    {
      field: "lng",
      headerName: "Longitude",
      width: 220,
    },
    {
      field: "image",
      headerName: "Image",
      width: 220,
    },

    {
      field: "edit",
      headerName: "",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Link href={`/admin/city/edit/${row.cityId}`}>
          <i className="fa fa-edit text-success"> update</i>
        </Link>
      ),
    },

    {
      field: "delete",
      headerName: "",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <button className="btn" onClick={() => deleteItem(row.cityId)}>
          <i className="fa fa-trash text-danger"> delete</i>
        </button>
      ),
    },
  ];

  async function getData() {
    try {
      const res = await fetch(`/api/city`);
      const data = await res.json();

      const formatted = data.map((item) => ({
        ...item,
        stateName: item.state?.stateName,
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching cities", error);
    }
  }

  async function deleteItem(id) {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        const res = await fetch(`/api/admin/city/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("City deleted successfully");

          getData();
        } else {
          alert("Error deleting city");
        }
      } catch (error) {
        console.error("Error deleting city", error);
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {/* <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Maincategory</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link href="/">Home /</Link>
          </li>

          <li className="breadcrumb-item active text-white">Maincategory</li>
        </ol>
      </div> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <Sidebar />
          </div>

          <div className="col-lg-9 col-md-9">
            <h5 className="text-dark text-center mt-2 p-2">
              City
              <Link href="/admin/city/add">
                <i className="fa fa-plus text-light float-end"></i>
              </Link>
            </h5>

            <div className="table-responsive">
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.cityId}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection={false}
                disableRowSelectionOnClick
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-3 mb-3">
          <button type="button" className="bg-dark text-light btn">
            <Link
              href="/admin/city/addcity"
              className="text-light text-decoration-none"
            >
              Add City
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
