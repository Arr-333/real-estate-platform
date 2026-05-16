import React from "react";
import Topbar from "@/components/dashboard/owner/Topbar";
import PortfolioBanner from "@/components/dashboard/owner/PortfolioBanner";

import KpiStrip from "@/components/dashboard/owner/KpiStrip";
import OwnerDetail from "@/components/dashboard/owner/OwnerDeatil";

import RevenueChart from "@/components/dashboard/owner/RevenueChart";
import PropertyStatus from "@/components/dashboard/owner/PropertyStatus";

// import DealPipeline from '@/components/dashboard/owner/DealPipeline'

import BrokerLeaderboard from "@/components/dashboard/owner/BrokeLeaderboard";
import AlertsActivity from "@/components/dashboard/owner/AlertActivity";

import TopDeals from "@/components/dashboard/owner/TopDeals";
import CommissionBreakdown from "@/components/dashboard/owner/CommissionBreakdown";

import QuickAction from "@/components/dashboard/owner/QuickAction";

export default function page() {
  return (
    <>
      <div className="min-vh-100 position-relative owby">
        <div className="page-wrapper wer">
          <div className="container-fluid">
            <div className="main">
              <Topbar />

              <div className="row">
                <div className="col col-lg-6 col-sm-12 ">
                  <OwnerDetail />
                </div>
                <div className="col col-lg-6 col-sm-12 ">
                  <PortfolioBanner />
                </div>
              </div>
              <div className="row">
                <div className="col col-lg- col-sm-12">
                  <KpiStrip />
                </div>
              </div>

              <div className="row">
                <div className="col col-lg-6 col-sm-12">
                  <RevenueChart />
                </div>
                <div className="col col-lg-6 col-sm-12 ddd">
                  <PropertyStatus />
                </div>
              </div>

              {/* <div className="row">
                                <div className="col col-lg- col-sm-12">
                                    <DealPipeline />
                                </div>
                            </div> */}

              <div className="row">
                <div className="col col-lg-6 col-sm-12">
                  <BrokerLeaderboard />
                </div>
                <div className="col col-lg-6 col-sm-12 ddd">
                  <AlertsActivity />
                </div>
              </div>

              <div className="row">
                <div className="col col-lg-6 col-sm-12">
                  <TopDeals />
                </div>
                <div className="col col-lg-6 col-sm-12 p-2">
                  <CommissionBreakdown />
                </div>
              </div>

              <div className="row">
                <div className="col col-lg-12 col-sm-12">
                  <QuickAction />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
