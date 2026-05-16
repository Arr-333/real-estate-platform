// "use client"

import PropertyPage from "@/components/SingleProduct/PropertyPage";

async function getProperty(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/listing/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("FETCH PROPERTY ERROR:", error);
    return null;
  }
}

export default async function page({ params }) {
  const { id } = await params;

  const res = await getProperty(id);

  if (!res || !res.property) {
    return (
      <div className="container py-5">
        <h2>Property not found</h2>
      </div>
    );
  }

  const property = res.property;

  const normalized = {
    id: property.propertyListId,

    title: property.propertyTitle,
    about: property.propertyAbout,
    address: property.propertyAddressLine1,

    images: property.images?.map((img) => img.imageUrl) || [],
    propertyRegistration: property.propertyRegistration,
    propertyRegistrationDetails: property.propertyRegistrationDetails,
    propertyRegistrationAuthority: property.propertyRegistrationAuthority,
    propertyOtherCertification: property.propertyOtherCertification,

    spaces:
      property.spaces?.map((s) => ({
        id: s.name,
        size: s.size,
        lease: s.term,
        rate: s.rate,
        desc: s.description,
        features: s.features?.map((f) => f.name) || [],
      })) || [],

    suitability: property.suitability?.map((s) => s.name) || [],
    nearby: property.nearby?.map((n) => n.placeName) || [],

    broker: property.broker
      ? {
          name: property.broker.user?.name,
          email: property.broker.user?.email,
          phone: property.broker.phoneMobile || property.broker.user?.phone,
          image: property.broker.user?.image,
        }
      : null,

    contact: {
      name: property.broker?.name || "N/A",
      phone: property.broker?.phone || "N/A",
      company: property.broker?.companyName || "N/A",
    },

    stats: {
      impressions: 0,
      visits: 0,
      saved: 0,
      spaces: property.spaces?.length || 0,
    },

    detail: {
      Size: property.propertySize,
      Rent: property.propertyRent?.toString(),
      Furnished: property.propertyFurnishedStatus,
      Availability: property.propertyAvailability,
    },
  };

  return (
    <>
      <PropertyPage propertyData={normalized} />
    </>
  );
}
