"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [propertyType, setPropertyType] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch("/api//propertyType");
        const data = await res.json();
        setPropertyType(data);
      } catch (error) {
        console.error("Error fetching Property Types:", error);
      }
    }

    getData();
  }, []);

  async function postData(e) {
    e.preventDefault();
    setMessage("");

    if (!name) {
      return setMessage("Please enter Property Type name");
    }

    if (name.length < 3) {
      return setMessage(
        "Property Type name must be at least 3 characters long"
      );
    }

    if (name.length > 20) {
      return setMessage(
        "Property Type name must be less than 20 characters long"
      );
    }

    const existingPropertyType = propertyType.find(
      (b) => b.name.toUpperCase() === name.toUpperCase()
    );

    if (existingPropertyType) {
      return setMessage("Property Type already exists");
    }

    if (!file) {
      return setMessage("Please select an image");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", file);

      const res = await fetch("/api/admin/propertyType", {
        method: "POST",
        body: formData, // ❗ no headers
      });

      const data = await res.json();

      if (!res.ok) {
        return setMessage(data.message || "Failed to add Property Type");
      }

      router.push("/admin/propertyType");
    } catch (error) {
      console.error("Error adding Property Type:", error);
      setMessage("Something went wrong");
    }
  }

  function getInputData(e) {
    setName(e.target.value);
    setMessage("");
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-md-3">
          <Sidebar />
        </div>

        <div className="col-lg-9 col-md-9">
          <h5 className="text-dark text-center mt-2 p-2">Add Property Type</h5>

          <form onSubmit={postData}>
            <div className="mb-3">
              <label>
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Property Type"
                value={name}
                onChange={getInputData}
              />
              {/* ✅ IMAGE INPUT */}
              <label className="mt-3">
                Image <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {/* ✅ ERROR MESSAGE */}
              {message && <p className="text-danger mt-2">{message}</p>}
              <button type="submit" className="btn btn-success mt-3">
                Add Property Type
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-dark mt-3"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
