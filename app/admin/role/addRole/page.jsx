"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useRouter } from "next/navigation";

export default function page() {
  let [name, setName] = useState("");
  let [message, setMessage] = useState("");
  const [role, setRole] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        let res = await fetch(`/api/admin/role`);
        let data = await res.json();
        setRole(data);
      } catch (error) {
        console.error("Error fetching Roles:", error);
      }
    }
    getData();
  }, []);

  async function postData(e) {
    e.preventDefault();
    setMessage("");
    if (!name) {
      return setMessage("Please enter role name");
    } else if (name.length < 3) {
      return setMessage("Role name must be at least 3 characters long");
    } else if (name.length > 20) {
      return setMessage("Role name must be less than 20 characters long");
    }

    const existingRole = role.find(
      (b) => b.name.toUpperCase() === name.toUpperCase()
    );
    if (existingRole) {
      return setMessage("Role already exists");
    }
    try {
      const res = await fetch(`/api/admin/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return setMessage(data.message || "Failed to add Role");
      }

      router.push("/admin/role");
    } catch (error) {
      console.error("Error adding Role:", error);
    }
  }

  function getInputData(e) {
    setName(e.target.value);
    setMessage("");
  }

  return (
    <>
      <div className="cointaner-fluide">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <Sidebar />
          </div>
          <div className="col-lg-9 col-md-9 ">
            <h5 className="text-dark  rad  text-center mt-2  p-2">
              Update Role
            </h5>
            <form action="" onSubmit={postData}>
              <div className="mb-3">
                <label htmlFor="">
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Role Name"
                  value={name}
                  onChange={getInputData}
                />
                {message ? <p className="text-danger">{message}</p> : ""}
                <button
                  type="submit"
                  className="ggg text-dark ms-6 mt-3 p-1 fw-bold bn "
                >
                  Add Role
                </button>
                &emsp;&emsp;&emsp;
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-dark text-light me-6 mt-3 p-1  fw-bold bn "
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
