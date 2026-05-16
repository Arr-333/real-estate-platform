import React from "react";

import Sidebar from "@/components/dashboard/sidebar";
import Topper from "@/components/dashboard/broker/Topper";
import TopLocations from "@/components/dashboard/TopLocations";
import BrokerDetails from "@/components/dashboard/broker/BrokerDeatil";
import ClientList from "@/components/dashboard/broker/ClientList";
import Metric from "@/components/dashboard/broker/Metric";
import SmartQuickActions from "@/components/dashboard/broker/SmartQuickActions";
import SoldProperty from "@/components/dashboard/SoldProperty";
import StatusBreakdown from "@/components/dashboard/broker/StatusBreakdown";
import PropertyGrid from "@/components/dashboard/broker/PropertyGrid";

export default function page() {
  return (
    <>
      <div className="min-vh-100 position-relative">
        <div className="page-wrapper wer">
          <div className="container-fluid">
            {/* <Sidebar /> */}

            <div className="main">
              <Topper />
              <Metric />

              {/* <SoldStatus /> */}

              <div>
                <div className="row">
                  <BrokerDetails />
                  <StatusBreakdown />
                  <div className="col col-lg-3 col-sm-12  m-2">
                    <TopLocations />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col col-lg-5 col-sm-12  m-2">
                  <SoldProperty />
                </div>

                <div className="col col-lg-6 col-sm-12">
                  <SmartQuickActions />
                </div>
              </div>

              <ClientList />
              <PropertyGrid />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
