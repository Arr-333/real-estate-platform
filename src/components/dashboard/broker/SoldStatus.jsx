import React from "react";

export default function SoldStatus() {
  return (
    <>
      <div>
        <div class="sec">
          <div class="sec-title">All Property Listings</div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="display:flex;gap:5px;">
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#edf9f0;color:#1e7e4a;font-weight:500;">
                8 Sold
              </span>
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#e8f4fd;color:#1a5fa8;font-weight:500;">
                10 Available
              </span>
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#fff8e8;color:#8a5500;font-weight:500;">
                4 Pending
              </span>
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#f5eefa;color:#6c22a8;font-weight:500;">
                2 Rented
              </span>
            </div>
            <div class="sec-link">View all →</div>
          </div>
        </div>

        {/* <!-- SOLD BY HIM STATS --> */}
        <div class="sold-stats">
          <div class="ss-box">
            <div class="ss-num" style="color:#2ecc71;">
              31
            </div>
            <div class="ss-lbl">Properties Sold</div>
          </div>
          <div class="ss-box">
            <div class="ss-num" style="color:#c8a97e;">
              ₹18.4Cr
            </div>
            <div class="ss-lbl">Total Sale Value</div>
          </div>
          <div class="ss-box">
            <div class="ss-num" style="color:#3498db;">
              ₹59.4L
            </div>
            <div class="ss-lbl">Avg. Property Value</div>
          </div>
          <div class="ss-box">
            <div class="ss-num" style="color:#9b59b6;">
              34d
            </div>
            <div class="ss-lbl">Avg. Days to Close</div>
          </div>
        </div>

        <div class="carousel-wrap">
          <div class="carousel-btn prev" id="prevBtn">
            ‹
          </div>
          <div style="overflow:hidden;margin:0 34px;">
            <div class="carousel-track" id="track">
              <div class="prop-card">
                <div class="prop-img-box" style="background:#e8f4fd;">
                  🏢<span class="prop-sold-badge">SOLD</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Prestige Tower 3BHK</div>
                  <div class="pc-loc">Sector 62, Noida</div>
                  <div class="pc-price">₹1.85Cr</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#edf9f0;color:#1e7e4a;"
                    >
                      SOLD
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      1450 sqft
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#edf9f0;">
                  🏘<span class="prop-pending-badge">PENDING</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Green Valley Villa 4BHK</div>
                  <div class="pc-loc">DLF Phase 4, Gurgaon</div>
                  <div class="pc-price">₹4.20Cr</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#fff8e8;color:#8a5500;"
                    >
                      PENDING
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      3200 sqft
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#fdf3e8;">
                  🏙<span class="prop-available-badge">AVAIL.</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Skyline Residency 2BHK</div>
                  <div class="pc-loc">Indirapuram, Ghaziabad</div>
                  <div class="pc-price">₹72L</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      BUYER REQ.
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#f5eefa;">
                  🏗<span class="prop-available-badge">AVAIL.</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Orion Heights Studio</div>
                  <div class="pc-loc">Cyber City, Gurgaon</div>
                  <div class="pc-price">₹28K/mo</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#f5eefa;color:#6c22a8;"
                    >
                      RENT
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      520 sqft
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#fff0f0;">
                  🏠<span class="prop-pending-badge">PENDING</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Maple Grove 5BHK</div>
                  <div class="pc-loc">Greater Kailash II, Delhi</div>
                  <div class="pc-price">₹9.80Cr</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#fde8e8;color:#a82222;"
                    >
                      HOT
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      5400 sqft
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#e8f4fd;">
                  🏛<span class="prop-sold-badge">SOLD</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Lotus Arcade — Commercial</div>
                  <div class="pc-loc">Rajouri Garden, Delhi</div>
                  <div class="pc-price">₹1.20Cr</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#edf9f0;color:#1e7e4a;"
                    >
                      SOLD
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      800 sqft
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#edf9f0;">
                  🏡<span class="prop-available-badge">AVAIL.</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Emerald Greens 3BHK</div>
                  <div class="pc-loc">Sector 56, Gurgaon</div>
                  <div class="pc-price">₹2.45Cr</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      FOR SALE
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      1800 sqft
                    </span>
                  </div>
                </div>
              </div>
              <div class="prop-card">
                <div class="prop-img-box" style="background:#fdf3e8;">
                  🌆<span class="prop-sold-badge">SOLD</span>
                </div>
                <div class="prop-card-body">
                  <div class="pc-name">Sunrise Heights 2BHK</div>
                  <div class="pc-loc">Vaishali, Ghaziabad</div>
                  <div class="pc-price">₹68L</div>
                  <div class="pc-meta">
                    <span
                      class="pc-tag"
                      style="background:#edf9f0;color:#1e7e4a;"
                    >
                      SOLD
                    </span>
                    <span
                      class="pc-tag"
                      style="background:#e8f4fd;color:#1a5fa8;"
                    >
                      960 sqft
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-btn next" id="nextBtn">
            ›
          </div>
        </div>
        <div class="carousel-dots" id="dots">
          <div class="dot active"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </>
  );
}
