"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UpdatePropertyPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({});

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [types, setTypes] = useState([]);
  const [brokers, setBrokers] = useState([]);

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [suitabilities, setSuitabilities] = useState([""]);
  const [nearbyPlaces, setNearbyPlaces] = useState([""]);
  const [highlights, setHighlights] = useState([""]);

  const [spaces, setSpaces] = useState([
    {
      name: "",
      size: "",
      term: "",
      rate: "",
      use: "",
      condition: "",
      available: "",
      description: "",
      features: [""],
    },
  ]);

  //------------------------------------------
  // FETCH PROPERTY
  //------------------------------------------
  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/listing/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message);
          return;
        }

        const property = data.property;

        setForm(property);

        setSuitabilities(
          property.suitability?.length
            ? property.suitability.map((item) => item.name)
            : [""]
        );

        setNearbyPlaces(
          property.nearby?.length
            ? property.nearby.map((item) => item.placeName)
            : [""]
        );

        setHighlights(
          property.highlights?.length
            ? property.highlights.map((item) => item.text)
            : [""]
        );

        setSpaces(
          property.spaces?.length
            ? property.spaces.map((space) => ({
                name: space.name,
                size: space.size,
                term: space.term,
                rate: space.rate,
                use: space.use,
                condition: space.condition,
                available: space.available,
                description: space.description || "",
                features: space.features?.map((f) => f.name) || [""],
              }))
            : [
                {
                  name: "",
                  size: "",
                  term: "",
                  rate: "",
                  use: "",
                  condition: "",
                  available: "",
                  description: "",
                  features: [""],
                },
              ]
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  //------------------------------------------
  // FETCH MASTER DATA
  //------------------------------------------
  useEffect(() => {
    async function fetchMasters() {
      try {
        const [cityRes, stateRes, typeRes, brokerRes] = await Promise.all([
          fetch("/api/city"),
          fetch("/api/state"),
          fetch("/api/propertyType"),
          fetch("/api/broker"),
        ]);

        setCities(await cityRes.json());
        setStates(await stateRes.json());
        setTypes(await typeRes.json());
        setBrokers(await brokerRes.json());
      } catch (error) {
        console.log(error);
      }
    }

    fetchMasters();
  }, []);

  //------------------------------------------
  // HANDLE FORM INPUT
  //------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "propertyCityId") {
      const selectedCity = cities.find((city) => city.cityId === Number(value));

      if (selectedCity) {
        setForm((prev) => ({
          ...prev,
          propertyCityId: value,
          propertyStateId: selectedCity.stateId,
        }));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //------------------------------------------
  // SUBMIT
  //------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      //--------------------------------
      // Files
      //--------------------------------
      images.forEach((file) => {
        formData.append("images", file);
      });

      documents.forEach((file) => {
        formData.append("documents", file);
      });

      //--------------------------------
      // Arrays
      //--------------------------------
      formData.append(
        "suitability",
        JSON.stringify(suitabilities.filter((item) => item.trim()))
      );

      formData.append(
        "nearby",
        JSON.stringify(nearbyPlaces.filter((item) => item.trim()))
      );

      formData.append(
        "highlights",
        JSON.stringify(highlights.filter((item) => item.trim()))
      );

      formData.append("spaces", JSON.stringify(spaces));

      const res = await fetch(`/api/listing/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      alert("Property updated successfully");
      router.push("/admin/listing");
    } catch (error) {
      console.log(error);
      setMessage("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Update Property</h2>

      {message && <p className="text-danger">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <input
          type="text"
          name="propertyTitle"
          value={form.propertyTitle || ""}
          onChange={handleChange}
          placeholder="Property Title"
          className="form-control mb-3"
        />

        {/* SIZE */}
        <input
          type="number"
          name="propertySize"
          value={form.propertySize || ""}
          onChange={handleChange}
          placeholder="Property Size"
          className="form-control mb-3"
        />

        {/* RENT */}
        <input
          type="number"
          name="propertyRent"
          value={form.propertyRent || ""}
          onChange={handleChange}
          placeholder="Rent Amount"
          className="form-control mb-3"
        />

        {/* PROPERTY TYPE */}
        <select
          name="propertyTypeId"
          value={form.propertyTypeId || ""}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="">Select Property Type</option>

          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {/* CITY */}
        <select
          name="propertyCityId"
          value={form.propertyCityId || ""}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="">Select City</option>

          {cities.map((city) => (
            <option key={city.cityId} value={city.cityId}>
              {city.cityName}
            </option>
          ))}
        </select>

        {/* STATE */}
        <select
          disabled
          value={form.propertyStateId || ""}
          className="form-control mb-3"
        >
          <option value="">Select State</option>

          {states.map((state) => (
            <option key={state.stateId} value={state.stateId}>
              {state.stateName}
            </option>
          ))}
        </select>

        {/* BROKER */}
        <select
          name="propertyBrokerId"
          value={form.propertyBrokerId || ""}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="">Select Broker</option>

          {brokers.map((broker) => (
            <option key={broker.id} value={broker.id}>
              {broker.user?.name}
            </option>
          ))}
        </select>

        {/* EXISTING IMAGES */}
        <h5>Existing Images</h5>
        <div className="mb-3">
          {form.images?.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              width="120"
              className="me-2"
              alt="property"
            />
          ))}
        </div>

        {/* NEW IMAGES */}
        <input
          type="file"
          multiple
          className="form-control mb-3"
          onChange={(e) => setImages([...e.target.files])}
        />

        {/* EXISTING DOCS */}
        <h5>Existing Documents</h5>
        <ul>
          {form.documents?.map((doc) => (
            <li key={doc.id}>
              <a href={doc.docUrl} target="_blank">
                View Document
              </a>
            </li>
          ))}
        </ul>

        {/* NEW DOCS */}
        <input
          type="file"
          multiple
          className="form-control mb-3"
          onChange={(e) => setDocuments([...e.target.files])}
        />

        <button className="btn btn-primary">Update Property</button>
      </form>
    </div>
  );
}
