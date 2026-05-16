"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const [stateName, setStateName] = useState("");
  const [stateStatus, setStateStatus] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`/api/admin/state/${id}`);
        const data = await res.json();

        if (res.ok) {
          setStateName(data.stateName);
          setStateStatus(data.stateStatus);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch State", error);
      }
    }

    if (id) getData();
  }, [id]);

  const handleName = (e) => {
    setStateName(e.target.value);
    setMessage("");
  };

  const handleStatus = (e) => {
    setStateStatus(e.target.value);
  };

  async function postData(e) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("stateName", stateName);
    if (file) formData.append("image", file);
    formData.append("stateStatus", stateStatus);

    if (!stateName.trim()) {
      return setMessage("Please enter state name");
    }

    if (stateName.length < 3 || stateName.length > 30) {
      return setMessage("State name must be between 3 and 30 characters");
    }

    try {
      const res = await fetch(`/api/admin/state/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/state");
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <Sidebar />
          </div>

          <div className="col-lg-9 col-md-9">
            <h5 className="text-dark text-center mt-2 p-2">Update State</h5>

            <form onSubmit={postData}>
              <div className="mb-3">
                <label>
                  State Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  value={stateName}
                  onChange={handleName}
                />

                {message && <p className="text-danger">{message}</p>}

                <label htmlFor="">
                  Image<span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  placeholder="Property Type"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label>State Status</label>

                <select
                  className="form-control"
                  value={stateStatus}
                  onChange={handleStatus}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="ComingSoon">Coming Soon</option>
                </select>
              </div>
              <button
                type="submit"
                className="ggg text-dark mt-3 p-1 fw-bold bn"
              >
                Update State
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
    </>
  );
}
