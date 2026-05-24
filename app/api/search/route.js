import { NextResponse } from "next/server";

import { buildSolrQuery } from "../../../src/lib/search/buildQuery";
import { solrSearch } from "../../../src/lib/solr/client";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const getAll = async (request) => {
  try {
    const { searchParams } = new URL(request.url);

    const propertyType = searchParams.get("propertyType");

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || 25;
    const locationText = searchParams.get("location");

    const state = {
      propertyType: propertyType || undefined,
      location:
        lat && lng
          ? {
              lat: Number(lat),
              lng: Number(lng),
              radius: Number(radius),
            }
          : undefined,
      locationText: locationText || undefined,
    };

    const queryParams = buildSolrQuery(state);
    const result = await solrSearch(queryParams);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.search.getAll);
