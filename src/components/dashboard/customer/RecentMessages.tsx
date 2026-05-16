"use client";

import React, { useState } from "react";

type Message = {
  id: number;
  from: string;
  role: "Broker" | "Owner" | "Support";
  text: string;
  time: string;
  isUnread: boolean;
  avatarColor: string;
  initials: string;
  propertyTitle?: string;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    from: "Rahul Mehta",
    role: "Broker",
    text: "Hi! Documents for the 2BHK flat are ready. Can we meet this week?",
    time: "2 min ago",
    isUnread: true,
    avatarColor: "#3b82f6",
    initials: "RM",
    propertyTitle: "2BHK Apt, Sector 21",
  },
  {
    id: 2,
    from: "Support Team",
    role: "Support",
    text: "Your site visit for Mar 17 has been confirmed. Please be on time.",
    time: "1 hr ago",
    isUnread: true,
    avatarColor: "#10b981",
    initials: "ST",
  },
  {
    id: 3,
    from: "Sunita Gupta",
    role: "Owner",
    text: "The property is available for walkthrough anytime this week.",
    time: "Yesterday",
    isUnread: false,
    avatarColor: "#f59e0b",
    initials: "SG",
    propertyTitle: "3BHK Villa, Gurgaon",
  },
  {
    id: 4,
    from: "Kavita Kapoor",
    role: "Broker",
    text: "Found 3 new properties matching your ₹60L budget in Noida.",
    time: "2 days ago",
    isUnread: false,
    avatarColor: "#8b5cf6",
    initials: "KK",
  },
];

const roleBadge: Record<Message["role"], string> = {
  Broker: "bg-primary-subtle text-primary border-primary-subtle",
  Owner: "bg-warning-subtle text-warning border-warning-subtle",
  Support: "bg-success-subtle text-success border-success-subtle",
};

export default function RecentMessages() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [showContactForm, setShowContactForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => m.isUnread).length;

  function markRead(id: number) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isUnread: false } : m))
    );
  }

  function markAllRead() {
    setMessages((prev) => prev.map((m) => ({ ...m, isUnread: false })));
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/contactus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, active: true }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
        setShowContactForm(false);
      }, 3000);
    } catch {
      setFormError("Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="col-xl-6 col-xxl-6">
      <div className="card card-h-100">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h5 className="card-title mb-1">Messages</h5>
            <p className="text-muted fs-13 mb-0">
              From brokers, owners & support
            </p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            {unreadCount > 0 && (
              <>
                <span className="badge bg-danger text-white fs-12">
                  {unreadCount} unread
                </span>
                <button
                  onClick={markAllRead}
                  className="btn btn-sm btn-soft-secondary py-1 px-2 fs-12"
                >
                  Mark all read
                </button>
              </>
            )}
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="btn btn-sm btn-primary py-1 px-3 fs-12 d-flex align-items-center gap-1"
            >
              <i className="las la-plus" />
              New Message
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {/* ── Contact form (toggle) ──────── */}
          {showContactForm && (
            <div className="p-3 border-bottom bg-light">
              {submitted ? (
                <div className="alert alert-success fs-13 py-2 mb-0 d-flex align-items-center gap-2">
                  <i className="las la-check-circle fs-18" />
                  Message sent! Our team will get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <p className="fw-medium fs-13 mb-2">
                    Contact Support / Send Enquiry
                  </p>
                  {formError && (
                    <div className="alert alert-danger fs-12 py-2 mb-2">
                      {formError}
                    </div>
                  )}
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-sm fs-12"
                        placeholder="Your Name *"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="email"
                        className="form-control form-control-sm fs-12"
                        placeholder="Email *"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="tel"
                        className="form-control form-control-sm fs-12"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-sm fs-12"
                        placeholder="Subject *"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, subject: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-12">
                      <textarea
                        className="form-control form-control-sm fs-12"
                        rows={3}
                        placeholder="Your message *"
                        required
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary btn-sm fs-12 d-flex align-items-center gap-1"
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <i className="las la-paper-plane" />
                            Send
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="btn btn-soft-secondary btn-sm fs-12"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── Message list ──────────────── */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 border-bottom d-flex gap-3 ${
                msg.isUnread ? "bg-primary-subtle bg-opacity-25" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => markRead(msg.id)}
            >
              {/* Avatar */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-medium flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  fontSize: 12,
                  background: msg.avatarColor,
                }}
              >
                {msg.initials}
              </div>

              {/* Content */}
              <div className="flex-grow-1 overflow-hidden">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium fs-13">{msg.from}</span>
                    <span
                      className={`badge border fs-11 ${roleBadge[msg.role]}`}
                    >
                      {msg.role}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1 flex-shrink-0">
                    {msg.isUnread && (
                      <span
                        className="rounded-circle bg-primary"
                        style={{
                          width: 7,
                          height: 7,
                          display: "inline-block",
                        }}
                      />
                    )}
                    <span className="text-muted fs-11">{msg.time}</span>
                  </div>
                </div>

                {msg.propertyTitle && (
                  <p className="text-muted fs-12 mb-1 d-flex align-items-center gap-1">
                    <i className="las la-home" />
                    {msg.propertyTitle}
                  </p>
                )}

                <p className="text-muted fs-12 mb-0 text-truncate">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
