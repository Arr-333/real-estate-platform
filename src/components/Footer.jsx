"use client";
import React, { useState } from "react";

function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  return (
    <>
      {/* <div class="relative-bottom"> */}
      <footer className="ln-footer">
        {/* Decorative top accent */}
        <div className="ln-footer__accent" />

        <div className="ln-footer__inner">
          {/* Brand Column */}
          <div className="ln-footer__brand">
            <div className="ln-footer__logo-wrap">
              <img
                src="/content/images/logos/logo-loopnet-red.svg?v=e6f8b5d7a9464252842dec9e3abac1fe"
                alt="IndProp"
                className="ln-footer__logo"
              />
            </div>

            <p className="ln-footer__tagline">
              The Most Visited Commercial Real Estate Marketplace
            </p>

            <p className="ln-footer__connect-label">Connect With Us</p>
            <ul className="ln-footer__socials">
              {[
                {
                  key: "linkedin",
                  href: "https://www.linkedin.com/",
                  title: "LinkedIn",
                  icon: <LinkedInIcon />,
                },
                {
                  key: "facebook",
                  href: "https://www.facebook.com/",
                  title: "Facebook",
                  icon: <FacebookIcon />,
                },
                {
                  key: "instagram",
                  href: "https://www.instagram.com/",
                  title: "Instagram",
                  icon: <InstagramIcon />,
                },
                {
                  key: "youtube",
                  href: "https://www.youtube.com/",
                  title: "YouTube",
                  icon: <YouTubeIcon />,
                },
              ].map(({ key, href, title, icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Follow LoopNet on ${title}`}
                    className={`ln-footer__social-btn ln-footer__social-btn--${key}`}
                    onMouseEnter={() => setHoveredSocial(key)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>

            <p className="ln-footer__copyright">© 2026 CoStar Group</p>
          </div>

          {/* Nav Columns */}
          <nav className="ln-footer__nav">
            <FooterColumn title="Search" accentColor="var(--ln-red)">
              <FooterLink href="/" title="Commercial Real Estate for Sale">
                Properties For Sale
              </FooterLink>

              <FooterLink href="/" title="Find a Commercial Real Estate Broker">
                Find a Broker
              </FooterLink>
            </FooterColumn>

            <FooterColumn
              title="Products & Services"
              accentColor="var(--ln-orange)"
            >
              <FooterLink href="/" title="Commercial Real Estate Marketing">
                Advertise With Us
              </FooterLink>

              <FooterLink href="/" title="Help">
                Help
              </FooterLink>
            </FooterColumn>

            {/* <FooterColumn title="Marketplace" accentColor="var(--ln-amber)">
              <FooterLink
                href="https://www.showcase.com/"
                title="Showcase"
                external
              >
                Showcase
              </FooterLink>
              <FooterLink
                href="https://www.cityfeet.com/"
                title="CityFeet"
                external
              >
                CityFeet
              </FooterLink>
              <FooterLink
                href="https://www.bureauxlocaux.com/"
                title="Bureaux Locaux"
                external
              >
                Bureaux Locaux
              </FooterLink>
              <FooterLink
                href="https://www.land.com/"
                title="Land.com"
                external
              >
                Land.com
              </FooterLink>
              <FooterLink
                href="https://www.bizbuysell.com/"
                title="BizBuySell"
                external
              >
                BizBuySell
              </FooterLink>
              <FooterLink
                href="https://www.apartments.com/"
                title="Apartments.com"
                external
              >
                Apartments.com
              </FooterLink>
              <FooterLink
                href="https://www.homes.com/"
                title="Homes.com"
                external
              >
                Homes.com
              </FooterLink>
            </FooterColumn> */}

            <FooterColumn title="Resources" accentColor="var(--ln-teal)">
              <FooterLink href="/contact-us" title="Contact Us">
                Contact Us
              </FooterLink>

              <FooterLink href="/" title="Tenant Trends Report">
                Tenant Trends Report
              </FooterLink>
            </FooterColumn>

            <FooterColumn title="Company" accentColor="var(--ln-slate)">
              <FooterLink href="/about-us" title="About Us">
                About Us
              </FooterLink>
              <FooterLink href="/" title="Terms of Use">
                Terms of Use
              </FooterLink>
              <FooterLink href="/" title="Privacy Policy" external>
                Privacy Policy
              </FooterLink>
              <FooterLink href="" title="Licensing" external>
                Licensing
              </FooterLink>
              <FooterLink href="" title="Accessibility" external>
                Accessibility Commitment
              </FooterLink>
            </FooterColumn>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="ln-footer__bottom">
          <span>© 2026 CoStar Group, Inc. All rights reserved.</span>
          <span className="ln-footer__bottom-links">
            <a href="/">Terms</a>
            <span className="ln-footer__dot">·</span>
            <a href="/" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            <span className="ln-footer__dot">·</span>
            <a href="/" target="_blank" rel="noopener noreferrer">
              Accessibility
            </a>
          </span>
        </div>
      </footer>
      {/* 
      </div> */}
    </>
  );
}

/* ── Helper sub-components ── */

function FooterColumn({ title, accentColor, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ln-footer__col">
      <button
        className="ln-footer__col-title"
        style={{ "--accent": accentColor }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {title}
        <span className="ln-footer__chevron">{open ? "−" : "+"}</span>
      </button>
      <ul
        className={`ln-footer__col-list${open ? " ln-footer__col-list--open" : ""}`}
      >
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ href, title, external, children }) {
  return (
    <li>
      <a
        href={href}
        title={title}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="ln-footer__link"
      >
        {children}
        {external && <ExternalIcon />}
      </a>
    </li>
  );
}

/* ── SVG Icons ── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);
const GooglePlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M3.18 23.76c.3.17.64.24.99.2l.1-.03L13.64 12 3.27.07l-.1-.02c-.35-.04-.69.03-.99.2C1.6.73 1.08 1.5 1.08 2.48v19.04c0 .98.52 1.75 2.1 2.24zM14.62 13l2.5 2.5-9.32 5.27L14.62 13zm3.4-3.4l2.1 1.19c.85.48.85 1.24 0 1.72l-2.1 1.19L15.5 12l2.52-2.4zm-11.22-6.77l9.32 5.27-2.5 2.5L6.8 3.83z" />
  </svg>
);
const ExternalIcon = () => (
  <svg
    viewBox="0 0 12 12"
    fill="currentColor"
    width="10"
    height="10"
    style={{ marginLeft: "4px", opacity: 0.5 }}
  >
    <path d="M10 7.5v2a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h2V0H.5A.5.5 0 0 0 0 .5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7.5H10zM7 0v1.5h2.293L4.146 6.646l1.06 1.061L10.353 2.56V5H12V0H7z" />
  </svg>
);

export default Footer;
