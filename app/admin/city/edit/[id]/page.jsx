"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const [cityName, setCityName] = useState("");
  const [stateId, setStateId] = useState("");
  const [states, setStates] = useState([]);
  const [file, setFile] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Fetch states
  async function getStates() {
    try {
      const res = await fetch(`/api/state`);
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setStates(data);
      }
    } catch (error) {
      console.error("Error fetching states", error);
    }
  }

  // Fetch city
  async function getCity() {
    try {
      const res = await fetch(`/api/admin/city/${id}`);
      const data = await res.json();

      if (res.ok) {
        setCityName(data.cityName || "");
        setStateId(data.stateId || "");
        setLat(data.lat || "");
        setLng(data.lng || "");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error fetching city", error);
    }
  }

  useEffect(() => {
    if (id) {
      getCity();
      getStates();
    }
  }, [id]);

  function handleCity(e) {
    setCityName(e.target.value);
    setMessage("");
  }

  function handleState(e) {
    setStateId(e.target.value);
  }

  async function updateCity(e) {
    e.preventDefault();

    if (!cityName.trim()) {
      return setMessage("City name required");
    }

    if (!stateId) {
      return setMessage("Please select state");
    }

    try {
      const formData = new FormData();
      formData.append("cityName", cityName);
      formData.append("stateId", stateId);

      if (file) {
        formData.append("image", file); // optional update
      }

      formData.append("lat", lat);
      formData.append("lng", lng);

      const res = await fetch(`/api/admin/city/${id}`, {
        method: "PUT",
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
            <h5 className="text-dark text-center mt-2 p-2">Update City</h5>

            <form onSubmit={updateCity}>
              <div className="mb-3">
                <label>
                  City Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="City Name"
                  value={cityName}
                  onChange={handleCity}
                />
              </div>
              <div className="mb-3">
                <label>
                  State <span className="text-danger">*</span>
                </label>

                <select
                  className="form-control"
                  value={stateId}
                  onChange={handleState}
                >
                  <option value="">Select State</option>

                  {states.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label>City Image</label>

                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              {/* Latitude */}
              <div className="mb-3">
                <label>Latitude</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              {/* Longitude */}
              <div className="mb-3">
                <label>Longitude</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
              {message && <p className="text-danger">{message}</p>}
              <button
                type="submit"
                className="ggg text-dark mt-3 p-1 fw-bold bn"
              >
                Update City
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
