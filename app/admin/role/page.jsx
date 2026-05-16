"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";

export default function page() {
  const [data, setData] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Name",
      width: 250,
      editable: true,
    },
    {
      field: "edit",
      headerName: "",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Link href={`/admin/role/edit/${row.id}`}>
          <i className="fa fa-edit text-success">update</i>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "",

      width: 110,
      sortable: false,
      renderCell: ({ row }) => (
        <button className="btn" onClick={() => deleteItem(row.id)}>
          <i className="fa fa-trash text-danger">delete</i>
        </button>
      ),
    },
  ];

  async function getData() {
    try {
      const res = await fetch(`/api/admin/role`);
      const data = await res.json();
      setData(data);
      // console.log(data)
    } catch (error) {
      console.error("Error fetching Role", error);
    }
  }

  async function deleteItem(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`/api/admin/role/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("Role deleted successfully");
          getData();
        } else {
          alert("Error deleting Role");
        }
        getData();
      } catch (error) {
        console.error("Error deleting Role", error);
      }
    }
  }

  useEffect(() => {
    getData();
    // console.log(getData())
  }, []);

  return (
    <>
      <div className="cointaner-fluide">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <Sidebar />
          </div>
          <div className="col-lg-9 col-md-9 ">
            <h5 className="text-dark  rad text-center mt-2  p-2">
              Role
              <Link href="/admin/role/AddRole">
                <i className="fa fa-plus text-light float-end"></i>
              </Link>
            </h5>
            <div className="table-responsive">
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.id}
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
          <button
            type="button"
            className="bg-dark text-light me-6 mt-3 p-1   btn "
          >
            <Link
              href="/admin/role/addRole"
              className="text-light text-decoration-none"
            >
              Add Role
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
