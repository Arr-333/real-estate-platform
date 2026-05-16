import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Details() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const displayRole = user?.role ?? "";
  // const displayImage = user?.image ?? "/assets/images/default-avatar.png";

  // const imageSrc =
  //   user?.image && user.image.trim() !== "" ? user.image : "/img/noimage.png";
  // console.log("objectimage", imageSrc);

  const imageSrc = user?.image?.trim()
    ? user.image.startsWith("/")
      ? user.image
      : `/${user.image}`
    : "/img/noimage.png";

  return (
    <>
      <div className="col-xxl-6">
        <div className="row">
          <div className="col-md-4">
            <div className="card pb1">
              <Image src={imageSrc} width={500} height={470} alt="User" />
            </div>
          </div>

          <div className="col-md-8">
            <div className="card card-h-100 welcome-card">
              <div className="card-body">
                <div className="row h-100">
                  <div className="col-md-10 col-lg-9">
                    <div className="d-flex flex-column h-100 justify-content-between">
                      <div>
                        {/* User info */}
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <img
                            src={imageSrc}
                            alt={displayName}
                            className="rounded-circle"
                            width={48}
                            height={48}
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <h5 className="mb-0">
                              Welcome Back, {displayName}!
                            </h5>
                            {displayRole && (
                              <span className="badge bg-primary-subtle text-primary fs-12 mt-1">
                                {displayRole}
                              </span>
                            )}
                            {displayEmail && (
                              <p className="text-muted mb-0 fs-13 mt-1">
                                <i className="ri-mail-line me-1"></i>
                                {displayEmail}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-muted mb-4 fs-15 lh-base">
                          You have 8 new property leads and 3 deals.
                        </p>

                        <h6 className="fs-15 mb-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trending-up text-success size-4 me-1"
                          >
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                          </svg>
                          <span className="font-monospace me-2">
                            <span
                              className="counter"
                              data-start="0"
                              data-end="2158"
                              data-duration="1000"
                            >
                              2,158
                            </span>
                          </span>
                          <span className="text-muted fw-normal">
                            / Total Properties
                          </span>
                        </h6>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Link
                          href="/auth/profileupdate"
                          className="btn btn-primary"
                        >
                          Update Profile
                        </Link>
                      </div>
                    </div>
                  </div>

                  <img
                    src="/assets/images/welcome-vector.png"
                    alt="Welcome Vector"
                    className="img-fluid position-absolute welcome-vector"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
