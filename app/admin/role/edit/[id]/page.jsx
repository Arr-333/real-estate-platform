"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function page() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`/api/admin/role/${id}`);
        const data = await res.json();

        if (res.ok) {
          setName(data.name);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch Role", error);
      }
    }

    if (id) getData();
  }, [id]);

  const getInputData = (e) => {
    setName(e.target.value);
    setMessage("");
  };

  async function postData(e) {
    e.preventDefault();
    setMessage("");

    if (!name.trim()) {
      return setMessage("Please fill all fields");
    }

    if (name.length < 3 || name.length > 15) {
      return setMessage("Field Name must be between 3 and 15 characters");
    }

    try {
      const res = await fetch(`/api/admin/role/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/role");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
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
