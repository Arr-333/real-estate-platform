"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProperty() {
  const router = useRouter();

  const [form, setForm] = useState({});
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [types, setTypes] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");
  const [suitabilities, setSuitabilities] = useState([""]);
  const [nearbyPlaces, setNearbyPlaces] = useState([""]);

  const [highlights, setHighlights] = useState([""]);

  const [spaces, setSpaces] = useState([
    {
      id: "",
      size: "",
      term: "",
      rate: "",
      use: "",
      condition: "",
      available: "",
      desc: "",
      features: [""],
    },
  ]);

  // ===============================
  // FETCH MASTER DATA
  // ===============================

  useEffect(() => {
    async function fetchMasters() {
      const [c, s, t, b] = await Promise.all([
        fetch("/api/city"),
        fetch("/api/state"),
        fetch("/api/propertyType"),
        fetch("/api/broker"),
      ]);

      const citiesData = await c.json();
      const statesData = await s.json();
      const typesData = await t.json();
      const brokersData = await b.json();
      console.log("city", citiesData);
      console.log("state", statesData);
      console.log("type", typesData);
      console.log("brokers", brokersData);

      setCities(citiesData);
      setStates(statesData);
      setTypes(typesData);
      setBrokers(brokersData);
    }

    fetchMasters();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    // 🔥 AUTO STATE FROM CITY
    if (name === "propertyCityId") {
      const selectedCity = cities.find((c) => c.cityId === Number(value));

      if (selectedCity) {
        setForm((prev) => ({
          ...prev,
          propertyCityId: value,
          propertyStateId: selectedCity.stateId,
        }));
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    images.forEach((file) => formData.append("images", file));
    documents.forEach((file) => formData.append("documents", file));

    suitabilities.forEach((item) => {
      if (item.trim() !== "") {
        formData.append("propertySuitability", item);
      }
    });

    nearbyPlaces.forEach((item) => {
      if (item.trim() !== "") {
        formData.append("propertyNearby", item);
      }
    });

    const res = await fetch("/api/listing", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return setMessage(data.message);
    }

    alert("Property Created Successfully");
    router.push("/admin/listing");
  }

  return (
    <div className="container mt-4">
      <h3>Create Property</h3>

      <form onSubmit={handleSubmit}>
        {/* BASIC */}
        <input
          name="propertyTitle"
          placeholder="Title"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertySize"
          type="number"
          placeholder="Size SqFt"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyDimension"
          type="number"
          placeholder="Dimension SqFt"
          className="form-control mb-2"
          onChange={handleChange}
        />

        {/* RELATIONS */}

        <select
          name="propertyTypeId"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          name="propertyCityId"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.cityId} value={c.cityId}>
              {c.cityName}
            </option>
          ))}
        </select>

        <select
          name="propertyStateId"
          className="form-control mb-2"
          value={form.propertyStateId || ""}
          disabled
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.stateId} value={s.stateId}>
              {s.stateName}
            </option>
          ))}
        </select>

        <select
          name="propertyBrokerId"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Select Broker</option>
          {(brokers || []).map((b) => (
            <option key={b.id} value={b.id}>
              {b.user?.name}
            </option>
          ))}
        </select>

        {/* ENUMS */}
        <select
          name="propertyFurnishedStatus"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Furnished Status</option>
          <option value="FULLY_FURNISHED">Fully Furnished</option>
          <option value="SEMI_FURNISHED">Semi Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
        </select>

        <select
          name="propertyRentalTerm"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Rental Term</option>
          <option value="MONTHS_11">11 Months</option>
          <option value="YEARS_4_11">4Y 11M</option>
          <option value="YEARS_9_11">9Y 11M</option>
        </select>

        <select
          name="propertyAvailability"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Availability</option>
          <option value="IMMEDIATE">Immediate</option>
          <option value="COMING_SOON">Coming Soon</option>
          <option value="ON_NOTICE">On Notice</option>
        </select>

        {/* <select
          name="propertyListStatus"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">List Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DEACTIVE">Deactive</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING_SITE_VISIT">Pending Visit</option>
          <option value="APPROVED_SITE_VISIT">Approved Visit</option>
          <option value="REJECTED_SITE_VISIT">Rejected Visit</option>
        </select> */}

        <select
          name="propertyRentType"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Rent Type</option>
          <option value="PER_MONTH">Per Month</option>
          <option value="PER_SQFT">Per SqFt</option>
        </select>

        {/* BOOLEANS */}
        <select
          name="propertyHasPantryArea"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Has Pantry?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          name="propertyHasWashArea"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Has Wash Area?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <input
          name="propertyNoOfWashAreas"
          type="number"
          placeholder="No Of Wash Areas"
          className="form-control mb-2"
          onChange={handleChange}
        />

        {/* RENT */}
        <input
          name="propertyRent"
          type="number"
          placeholder="Rent Amount"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyAvailabilityDate"
          type="date"
          className="form-control mb-2"
          onChange={handleChange}
        />

        {/* ADDRESS */}
        <input
          name="propertyAddressLine1"
          placeholder="Address Line 1"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyAddressLine2"
          placeholder="Address Line 2"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyAddressLine3"
          placeholder="Address Line 3"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyLocal"
          placeholder="Locality"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyLatitude"
          placeholder="Latitude"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyLongitude"
          placeholder="Longitude"
          className="form-control mb-2"
          onChange={handleChange}
        />

        {/* OWNER */}
        <input
          name="propertyOwnerName"
          placeholder="Owner Name"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyOwnerContactEmail"
          placeholder="Owner Email"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyOwnerContactPhone"
          placeholder="Owner Phone"
          className="form-control mb-2"
          onChange={handleChange}
        />

        {/* REGISTRATION */}
        <select
          name="propertyRegistration"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Registered?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <input
          name="propertyRegistrationDetails"
          placeholder="Registration Details"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="propertyRegistrationAuthority"
          placeholder="Registration Authority"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <select
          name="propertyRegistrationVerified"
          className="form-control mb-2"
          onChange={handleChange}
        >
          <option value="">Registration Verified?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* DESCRIPTION */}
        <textarea
          name="propertyDescriptionContent"
          placeholder="Description"
          className="form-control mb-2"
          onChange={handleChange}
        ></textarea>
        <textarea
          name="propertyAbout"
          placeholder="About"
          className="form-control mb-2"
          onChange={handleChange}
        ></textarea>
        {/* sutain nearBy */}
        <h5>Property Suitability</h5>
        {suitabilities.map((item, index) => (
          <input
            key={index}
            className="form-control mb-2"
            placeholder="Suitable For..."
            value={item}
            onChange={(e) => {
              const updated = [...suitabilities];
              updated[index] = e.target.value;
              setSuitabilities(updated);
            }}
          />
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => setSuitabilities([...suitabilities, ""])}
        >
          Add Suitability
        </button>

        <h5>Nearby Places</h5>
        {nearbyPlaces.map((item, index) => (
          <input
            key={index}
            className="form-control mb-2"
            placeholder="Nearby Place..."
            value={item}
            onChange={(e) => {
              const updated = [...nearbyPlaces];
              updated[index] = e.target.value;
              setNearbyPlaces(updated);
            }}
          />
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => setNearbyPlaces([...nearbyPlaces, ""])}
        >
          Add Nearby
        </button>

        <h5>Highlights</h5>
        {highlights.map((item, index) => (
          <input
            key={index}
            className="form-control mb-2"
            placeholder="Highlight..."
            value={item}
            onChange={(e) => {
              const updated = [...highlights];
              updated[index] = e.target.value;
              setHighlights(updated);
            }}
          />
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => setHighlights([...highlights, ""])}
        >
          Add Highlight
        </button>

        <h5>Spaces</h5>

        {spaces.map((space, index) => (
          <div key={index} className="border p-3 mb-3">
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={space.id}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].id = e.target.value;
                setSpaces(updated);
              }}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Size"
              value={space.size}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].size = e.target.value;
                setSpaces(updated);
              }}
            />

            <input
              className="form-control mb-2"
              placeholder="Term"
              value={space.term}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].term = e.target.value;
                setSpaces(updated);
              }}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Rate"
              value={space.rate}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].rate = e.target.value;
                setSpaces(updated);
              }}
            />

            <input
              className="form-control mb-2"
              placeholder="Use"
              value={space.use}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].use = e.target.value;
                setSpaces(updated);
              }}
            />

            <input
              className="form-control mb-2"
              placeholder="Condition"
              value={space.condition}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].condition = e.target.value;
                setSpaces(updated);
              }}
            />

            <input
              className="form-control mb-2"
              placeholder="Available"
              value={space.available}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].available = e.target.value;
                setSpaces(updated);
              }}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={space.desc}
              onChange={(e) => {
                const updated = [...spaces];
                updated[index].desc = e.target.value;
                setSpaces(updated);
              }}
            />

            {/* FEATURES */}
            <h6>Features</h6>
            {space.features.map((f, i) => (
              <input
                key={i}
                className="form-control mb-2"
                placeholder="Feature"
                value={f}
                onChange={(e) => {
                  const updated = [...spaces];
                  updated[index].features[i] = e.target.value;
                  setSpaces(updated);
                }}
              />
            ))}

            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => {
                const updated = [...spaces];
                updated[index].features.push("");
                setSpaces(updated);
              }}
            >
              Add Feature
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() =>
            setSpaces([
              ...spaces,
              {
                id: "",
                size: "",
                term: "",
                rate: "",
                use: "",
                condition: "",
                available: "",
                desc: "",
                features: [""],
              },
            ])
          }
        >
          Add Space
        </button>

        <br />

        {/* FILES */}
        <label>Images</label>
        <input
          type="file"
          multiple
          className="form-control mb-2"
          onChange={(e) => setImages([...e.target.files])}
        />

        <label>Documents</label>
        <input
          type="file"
          multiple
          className="form-control mb-2"
          onChange={(e) => setDocuments([...e.target.files])}
        />

        {message && <p className="text-danger">{message}</p>}

        <button className="btn btn-primary mt-3">Create Property</button>
      </form>
    </div>
  );
}
