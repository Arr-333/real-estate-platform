import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <>
      {/* <!-- User profile section --> */}
      <section className="ec-page-content ec-vendor-uploads ec-user-account section-space-p">
        <div className="container">
          <div className="row">
            {/* <!-- Sidebar Area Start --> */}

            <Link href="/dashboard/update/id">Update Profile</Link>
          </div>
        </div>
      </section>

      {/* <!-- End User profile section --> */}
    </>
  );
}
