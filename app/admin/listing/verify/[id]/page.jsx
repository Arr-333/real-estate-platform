"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const { id } = useParams();
  const router = useRouter();

  const statusOptions = [
    { label: "Deactive", value: "DEACTIVE" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Rejected", value: "REJECTED" },
    {
      label: "Pending Site Visit",
      value: "PENDING_SITE_VISIT",
    },
    {
      label: "Approved Site Visit",
      value: "APPROVED_SITE_VISIT",
    },
    {
      label: "Rejected Site Visit",
      value: "REJECTED_SITE_VISIT",
    },
    {
      label: "In Progress",
      value: "IN_PROGRESS",
    },
    {
      label: "Processing",
      value: "PROCESSING",
    },
    {
      label: "Sold",
      value: "SOLD",
    },
  ];

  //-----------------------------------
  // FETCH CURRENT STATUS
  //-----------------------------------
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`/api/listing/${id}`);

        const data = await res.json();

        if (res.ok) {
          setStatus(data.property?.propertyListStatus || "");
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch property", error);

        setMessage("Failed to fetch property");
      }
    }

    if (id) {
      getData();
    }
  }, [id]);

  //-----------------------------------
  // HANDLE STATUS CHANGE
  //-----------------------------------
  const handleChange = (e) => {
    setStatus(e.target.value);
    setMessage("");
  };

  //-----------------------------------
  // UPDATE STATUS
  //-----------------------------------
  async function updateStatus(e) {
    e.preventDefault();

    setMessage("");

    if (!status) {
      setMessage("Please select status");
      return;
    }

    try {
      const res = await fetch(`/api/admin/listing/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Status updated successfully");

        router.push("/admin/listing");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong");
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-md-3">
          <Sidebar />
        </div>

        <div className="col-lg-9 col-md-9">
          <h5 className="text-dark text-center mt-2 p-2">
            Update Property Status
          </h5>

          <form onSubmit={updateStatus}>
            <div className="mb-3">
              <label>
                Property Status
                <span className="text-danger">*</span>
              </label>

              <select
                className="form-control"
                value={status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>

                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              {message && <p className="text-danger mt-2">{message}</p>}
            </div>
            <button type="submit" className="ggg text-dark mt-3 p-1 fw-bold bn">
              Update Status
            </button>
            &emsp;&emsp;
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-dark text-light mt-3 p-1 fw-bold bn"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
