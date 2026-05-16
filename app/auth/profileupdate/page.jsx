"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UpdateProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Common fields
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    image: null,

    // Broker fields
    location: "",
    phoneOffice: "",
    phoneMobile: "",
    about: "",
    language: "",
    bio: "",

    // Owner fields
    companyName: "",
    companyGST: "",
    companyPAN: "",
    type: "",
  });

  // Fetch logged-in user data
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/user/${userId}`);
      const data = res.data;

      setUser(data);

      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pin: data.pin || "",
        image: null,

        // Broker
        location: data.broker?.location || "",
        phoneOffice: data.broker?.phoneOffice || "",
        phoneMobile: data.broker?.phoneMobile || "",
        about: data.broker?.about || "",
        language: data.broker?.language || "",
        bio: data.broker?.bio || "",

        // Owner
        companyName: data.owner?.companyName || "",
        companyGST: data.owner?.companyGST || "",
        companyPAN: data.owner?.companyPAN || "",
        type: data.owner?.type || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      // Common fields
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("pin", form.pin);

      if (form.image) {
        formData.append("image", form.image);
      }

      const roleName = user?.role?.name;

      // Broker fields
      if (roleName === "BROKER") {
        formData.append("location", form.location);
        formData.append("phoneOffice", form.phoneOffice);
        formData.append("phoneMobile", form.phoneMobile);
        formData.append("about", form.about);
        formData.append("language", form.language);
        formData.append("bio", form.bio);
      }

      // Owner fields
      if (roleName === "OWNER") {
        formData.append("companyName", form.companyName);
        formData.append("companyGST", form.companyGST);
        formData.append("companyPAN", form.companyPAN);
        formData.append("type", form.type);
      }

      await axios.put(`/api/user/${userId}`, formData);

      alert("Profile updated successfully");

      // Refresh latest data
      await fetchUser();

      // Role-based redirect
      const roleRoutes = {
        ADMIN: "/admin/dashboard",
        BROKER: "/broker/dashboard",
        OWNER: "/owner/dashboard",
        CUSTOMER: "/customer/dashboard",
      };

      router.refresh();
      router.push(roleRoutes[roleName] || "/");
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const roleName = user?.role?.name;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2"
        />

        <input
          type="email"
          value={user.email}
          disabled
          className="w-full border p-2 bg-gray-100"
        />

        <input
          type="text"
          value={roleName}
          disabled
          className="w-full border p-2 bg-gray-100"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2"
        />

        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2"
        />

        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-2"
        />

        <input
          type="text"
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full border p-2"
        />

        <input
          type="text"
          name="pin"
          value={form.pin}
          onChange={handleChange}
          placeholder="Pin Code"
          className="w-full border p-2"
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Broker Fields */}
        {roleName === "BROKER" && (
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Broker Details</h2>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border p-2 mb-2"
            />

            <input
              type="text"
              name="phoneOffice"
              value={form.phoneOffice}
              onChange={handleChange}
              placeholder="Office Phone"
              className="w-full border p-2 mb-2"
            />

            <input
              type="text"
              name="phoneMobile"
              value={form.phoneMobile}
              onChange={handleChange}
              placeholder="Mobile Phone"
              className="w-full border p-2 mb-2"
            />

            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              placeholder="Language"
              className="w-full border p-2 mb-2"
            />

            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="About"
              className="w-full border p-2 mb-2"
            />

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full border p-2"
            />
          </div>
        )}

        {/* Owner Fields */}
        {roleName === "OWNER" && (
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Owner Details</h2>

            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full border p-2 mb-2"
            />

            <input
              type="text"
              name="companyGST"
              value={form.companyGST}
              onChange={handleChange}
              placeholder="GST Number"
              className="w-full border p-2 mb-2"
            />

            <input
              type="text"
              name="companyPAN"
              value={form.companyPAN}
              onChange={handleChange}
              placeholder="PAN Number"
              className="w-full border p-2 mb-2"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Type</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="COMPANY">Company</option>
            </select>
          </div>
        )}

        {/* Customer */}
        {roleName === "CUSTOMER" && (
          <div className="border p-4 rounded bg-gray-50">
            <h2 className="font-semibold">Customer Profile</h2>
            <p>No extra fields required.</p>
          </div>
        )}

        {/* Admin */}
        {roleName === "ADMIN" && (
          <div className="border p-4 rounded bg-gray-50">
            <h2 className="font-semibold">Admin Profile</h2>
            <p>Only basic information can be updated.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
