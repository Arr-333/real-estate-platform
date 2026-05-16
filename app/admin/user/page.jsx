"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ pagination state (IMPORTANT)
  const [page, setPage] = useState(0); // DataGrid starts from 0
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },

    { field: "name", headerName: "Name", width: 150 },

    { field: "email", headerName: "Email", width: 220 },

    { field: "phone", headerName: "Phone", width: 140 },

    {
      field: "role",
      headerName: "Role",
      width: 140,
      renderCell: ({ row }) => row.role?.name || "N/A",
    },

    { field: "address", headerName: "Address", width: 200 },

    { field: "city", headerName: "City", width: 120 },

    { field: "state", headerName: "State", width: 120 },

    { field: "pin", headerName: "Pin", width: 120 },

    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderCell: ({ row }) =>
        row.image ? <img src={row.image} width="40" height="40" /> : "No Image",
    },

    {
      field: "isGoogleUser",
      headerName: "Google User",
      width: 130,
      renderCell: ({ row }) => (row.isGoogleUser ? "Yes" : "No"),
    },

    {
      field: "isEmailVerified",
      headerName: "Email Verified",
      width: 150,
      renderCell: ({ row }) => (row.isEmailVerified ? "Yes" : "No"),
    },

    {
      field: "isActive",
      headerName: "Active",
      width: 120,
      renderCell: ({ row }) => (row.isActive ? "Yes" : "No"),
    },

    {
      field: "createdAt",
      headerName: "Created",
      width: 180,
      renderCell: ({ row }) => new Date(row.createdAt).toLocaleString(),
    },

    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: ({ row }) => (
        <Link href={`/admin/user/edit/${row.id}`}>
          <i className="fa fa-edit text-success"></i>
        </Link>
      ),
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: ({ row }) => (
        <button onClick={() => deleteItem(row.id)}>
          <i className="fa fa-trash text-danger"></i>
        </button>
      ),
    },
  ];

  async function getData() {
    try {
      const res = await fetch(
        `/api/admin/user?page=${page + 1}&limit=${pageSize}`
      );
      const result = await res.json();

      setData(result.data);
      setRowCount(result.total || 0);
    } catch (error) {
      console.error("Error fetching Users", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/admin/user/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("User deleted successfully");
          getData();
        } else {
          alert("Error deleting user");
        }
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3">
          <Sidebar />
        </div>

        <div className="col-lg-9">
          <h5 className="text-dark text-center mt-2 p-2">
            Users
            <Link href="/admin/user/add">
              <i className="fa fa-plus text-dark float-end"></i>
            </Link>
          </h5>

          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.id}
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
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/dashboard/sidebar";
// import Link from "next/link";
// import { DataGrid } from "@mui/x-data-grid";

// export default function Page() {
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(0); // MUI uses 0-based index
//   const [pageSize, setPageSize] = useState(5);
//   const [rowCount, setRowCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const columns = [
//     { field: "id", headerName: "ID", width: 80 },

//     { field: "name", headerName: "Name", width: 150 },

//     { field: "email", headerName: "Email", width: 220 },

//     { field: "phone", headerName: "Phone", width: 140 },

//     {
//       field: "role",
//       headerName: "Role",
//       width: 140,
//       renderCell: ({ row }) => row.role?.name || "N/A",
//     },

//     { field: "address", headerName: "Address", width: 200 },

//     { field: "city", headerName: "City", width: 120 },

//     { field: "state", headerName: "State", width: 120 },

//     { field: "pin", headerName: "Pin", width: 120 },

//     {
//       field: "image",
//       headerName: "Image",
//       width: 120,
//       renderCell: ({ row }) =>
//         row.image ? <img src={row.image} width="40" height="40" /> : "No Image",
//     },

//     {
//       field: "isGoogleUser",
//       headerName: "Google User",
//       width: 130,
//       renderCell: ({ row }) => (row.isGoogleUser ? "Yes" : "No"),
//     },

//     {
//       field: "isEmailVerified",
//       headerName: "Email Verified",
//       width: 150,
//       renderCell: ({ row }) => (row.isEmailVerified ? "Yes" : "No"),
//     },

//     {
//       field: "isActive",
//       headerName: "Active",
//       width: 120,
//       renderCell: ({ row }) => (row.isActive ? "Yes" : "No"),
//     },

//     {
//       field: "createdAt",
//       headerName: "Created",
//       width: 180,
//       renderCell: ({ row }) => new Date(row.createdAt).toLocaleString(),
//     },

//     {
//       field: "edit",
//       headerName: "Edit",
//       width: 100,
//       renderCell: ({ row }) => (
//         <Link href={`/admin/user/edit/${row.id}`}>
//           <i className="fa fa-edit text-success"></i>
//         </Link>
//       ),
//     },

//     {
//       field: "delete",
//       headerName: "Delete",
//       width: 100,
//       renderCell: ({ row }) => (
//         <button onClick={() => deleteItem(row.id)}>
//           <i className="fa fa-trash text-danger"></i>
//         </button>
//       ),
//     },
//   ];

//   async function getData() {
//     try {
//       setLoading(true);

//       const res = await fetch(`/api/admin/user?page=${page + 1}&limit=${pageSize}`);

//       const result = await res.json();

//       setData(result.data);
//       setRowCount(result.total);
//     } catch (error) {
//       console.error("Error fetching Users", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function deleteItem(id) {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const res = await fetch(`/api/admin/user/${id}`, {
//           method: "DELETE",
//         });

//         if (res.ok) {
//           alert("User deleted successfully");
//           getData();
//         } else {
//           alert("Error deleting user");
//         }
//       } catch (error) {
//         console.error("Error deleting user", error);
//       }
//     }
//   }
//   console.log({ page, pageSize, rowCount, data });
//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-lg-3">
//           <Sidebar />
//         </div>

//         <div className="col-lg-9">
//           <h5 className="text-dark text-center mt-2 p-2">
//             Users
//             <Link href="/admin/user/add">
//               <i className="fa fa-plus text-dark float-end"></i>
//             </Link>
//           </h5>

//           <div style={{ height: 500, width: "100%" }}>
//             <DataGrid
//               rows={data}
//               columns={columns}
//               getRowId={(row) => row.id}

//               loading={loading}
//               paginationMode="server"
//               rowCount={rowCount}
//               paginationModel={{ page, pageSize }}
//               onPaginationModelChange={(model) => {
//                 setPage(model.page);
//                 setPageSize(model.pageSize);
//               }}

//               pageSizeOptions={[5, 10, 20]}
//             // initialState={{
//             //   pagination: {
//             //     paginationModel: { pageSize: 5 },
//             //   },
//             // }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
