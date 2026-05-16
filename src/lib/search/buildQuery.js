export function buildSolrQuery(state) {
  const params = new URLSearchParams();

  params.set("q", "*:*");
  params.set("rows", "20");
  params.set("facet", "true");

  // ✅ Property type
  if (state.propertyType) {
    params.append("fq", `property_type:${state.propertyType}`);
    params.append("facet.field", "property_type");
  }

  // ✅ GEO search (priority)
  if (state.location) {
    const { lat, lng, radius = 25 } = state.location;

    params.append(
      "fq",
      `{!geofilt sfield=location pt=${lat},${lng} d=${radius}}`
    );
  }

  // ✅ TEXT search (fallback)
  if (state.locationText) {
    params.set("q", `city_name:*${state.locationText}*`);
  }

  // ✅ Ranking (featured + freshness)
  params.set(
    "bf",
    "if(is_featured,true,10,0) recip(ms(NOW,created_at),3.16e-11,1,1)"
  );

  return params;
}
