"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useRouter } from "next/navigation";

export default function Page() {
  const [stateName, setStateName] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [states, setStates] = useState([]);
  const router = useRouter();

  // Fetch existing states
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch("/api/state");
        const data = await res.json();
        setStates(data);
        console.log("line 20", data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }

    getData();
  }, []);

  // Handle submit
  async function postData(e) {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("stateName", stateName);
      formData.append("image", file);

      if (!stateName) {
        return setMessage("Please enter state name");
      }

      if (stateName.length < 3) {
        return setMessage("State name must be at least 3 characters");
      }

      if (stateName.length > 30) {
        return setMessage("State name must be less than 30 characters");
      }

      const existingState = states.find((s) => s.stateName === stateName);

      if (existingState) {
        return setMessage("State already exists");
      }

      if (!file) {
        return setMessage("Please select an image");
      }

      const res = await fetch("/api/admin/state", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return setMessage(data.message || "Failed to add state");
      }

      router.push("/admin/state");
    } catch (error) {
      console.error("Error adding state:", error);
      setMessage("Something went wrong");
    }
  }

  function handleInput(e) {
    setStateName(e.target.value);
    setMessage("");
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-3">
            <Sidebar />
          </div>

          {/* Content */}
          <div className="col-lg-9 col-md-9">
            <h5 className="text-dark text-center mt-2 p-2">Add State</h5>

            <form onSubmit={postData}>
              <div className="mb-3">
                <label>
                  State Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter State Name"
                  value={stateName}
                  onChange={handleInput}
                />
                {message && <p className="text-danger">{message}</p>}
                <label className="mt-3">
                  Image <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                  type="submit"
                  className="ggg text-dark ms-6 mt-3 p-1 fw-bold bn"
                >
                  Add State
                </button>
                &emsp;&emsp;
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-dark text-light mt-3 p-1 fw-bold bn"
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
