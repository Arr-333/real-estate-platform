const SOLR_URL = process.env.SOLR_URL || "http://localhost:8983/solr/listings";

export async function solrSearch(params) {
  const res = await fetch(`${SOLR_URL}/select?${params.toString()}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Solr query failed");

  return res.json();
}
