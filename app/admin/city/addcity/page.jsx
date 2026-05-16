"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useRouter } from "next/navigation";

export default function Page() {
  const [cityName, setCityName] = useState("");
  const [stateId, setStateId] = useState("");
  const [file, setFile] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [states, setStates] = useState([]);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Fetch states for dropdown
  useEffect(() => {
    async function getStates() {
      try {
        const res = await fetch("/api/state");
        const data = await res.json();

        if (res.ok) {
          setStates(data);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    }

    getStates();
  }, []);

  async function postData(e) {
    e.preventDefault();

    if (!cityName) return setMessage("City name required");
    if (!stateId) return setMessage("Select state");

    const formData = new FormData();
    formData.append("cityName", cityName);
    formData.append("stateId", stateId);
    formData.append("image", file);
    formData.append("lat", lat);
    formData.append("lng", lng);

    try {
      const res = await fetch("/api/admin/city", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/city");
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
            <h5 className="text-dark text-center mt-2 p-2">Add City</h5>

            <form onSubmit={postData}>
              <div className="mb-3">
                <label>
                  City Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter City Name"
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  Select State <span className="text-danger">*</span>
                </label>

                <select
                  className="form-control"
                  onChange={(e) => setStateId(e.target.value)}
                >
                  <option value="">Select State</option>

                  {states.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
                <label>
                  Latitude <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Latitude"
                  onChange={(e) => setLat(e.target.value)}
                />
                <label>
                  Longitude <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Longitude"
                  onChange={(e) => setLng(e.target.value)}
                />
                <label>
                  Image <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              {message && <p className="text-danger">{message}</p>}
              <button
                type="submit"
                className="ggg text-dark mt-3 p-1 fw-bold bn"
              >
                Add City
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
