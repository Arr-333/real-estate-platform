import React from "react";
import CustomerWelcome from "@/components/dashboard/customer/CustomerWelcome";
import CustomerWishlist from "@/components/dashboard/customer/CustomerWishlist";
import PropertySearch from "@/components/dashboard/customer/PropertySearch";
import RecommendedProperties from "@/components/dashboard/customer/RecommendedProperties";
import MyApplications from "@/components/dashboard/customer/MyApplications";
import ScheduledVisits from "@/components/dashboard/customer/ScheduledVisits";
import RecentMessages from "@/components/dashboard/customer/RecentMessages";
import CustomerQuickActions from "@/components/dashboard/customer/CustomerQuickActions";

export default function CustomerDashboardPage() {
  return (
    <>
      <div className="min-vh-100 position-relative">
        <div className="page-wrapper wer">
          <div className="container-fluid">
            {/* <Sidebar /> */}

            <div className="row g-4">
              <CustomerWelcome />

              <PropertySearch />

              <RecommendedProperties />

              <CustomerWishlist />

              <ScheduledVisits />
              <RecentMessages />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
