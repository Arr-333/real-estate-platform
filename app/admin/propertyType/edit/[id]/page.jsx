"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function page() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("COMING_SOON");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`/api/admin/propertyType/${id}`);
        const data = await res.json();

        if (res.ok) {
          setName(data.name);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch Property Type", error);
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

    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("image", file);
    formData.append("status", status);

    if (!name.trim()) {
      return setMessage("Please fill all fields");
    }

    if (name.length < 3 || name.length > 15) {
      return setMessage("Field Name must be between 3 and 15 characters");
    }

    try {
      const res = await fetch(`/api/admin/propertyType/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/propertyType");
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
              Update Property Type
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
                  placeholder="Property Type"
                  value={name}
                  onChange={getInputData}
                />
                {message ? <p className="text-danger">{message}</p> : ""}
                <div className="mt-3">
                  <label>
                    Status <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="COMING_SOON">COMING SOON</option>
                  </select>
                </div>
                <label htmlFor="">
                  Image<span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  placeholder="Property Type"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                  type="submit"
                  className="ggg text-dark ms-6 mt-3 p-1 fw-bold bn "
                >
                  Add Property Type
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
        <h1>update proprty type</h1>
      </div>
    </>
  );
}
