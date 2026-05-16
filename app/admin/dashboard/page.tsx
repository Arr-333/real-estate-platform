import React from "react";
import Details from "@/components/dashboard/details";
import Sidebar from "@/components/dashboard/sidebar";
import PropertyStatus from "@/components/dashboard/admin/PropertyStatus";
import SoldProperty from "@/components/dashboard/SoldProperty";
import ToManage from "@/components/dashboard/admin/ToManage";
import TotalProperty from "@/components/dashboard/admin/TotalProperty";
import SalesChart from "@/components/dashboard/admin/SaleChart";
import QuickActions from "@/components/dashboard/admin/QuickActions";
import SalesInsight from "@/components/dashboard/admin/SaleInsight";
import TopLocations from "@/components/dashboard/TopLocations";
import UpcomingEvent from "@/components/dashboard/admin/UpComingEvent";

export default function page() {
  return (
    <>
      <div className="">
        <div className="me-5 mt-5">
          <div className="row">
            <div className="col col-lg-2 col-sm-12">
              <Sidebar />
            </div>
            <div className="col col-lg-10 col-sm-12 mt-7">
              <div className="row">
                <Details />
                <div className="col-md-6 ">
                  <TopLocations />
                </div>

                <TotalProperty />
                <PropertyStatus />

                <QuickActions />

                <SalesInsight />
                <UpcomingEvent />

                <SalesChart />

                <ToManage />
                <div className="col-xxl-5">
                  <SoldProperty />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
