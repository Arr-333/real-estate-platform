import { ROLES } from "./role";

export const ACCESS_CONTROL = {
  broker: {
    create: ["PUBLIC"],
    getAll: [ROLES.ADMIN, ROLES.OWNER, ROLES.BROKER], // public route
    getSingle: ["PUBLIC"],
    update: [ROLES.BROKER],
    delete: [ROLES.ADMIN],
  },

  city: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC", ROLES.ADMIN],
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  company: {
    create: [ROLES.ADMIN, ROLES.OWNER, ROLES.BROKER],
    getAll: ["PUBLIC"],
    getSingle: ["PUBLIC"],
    update: [ROLES.OWNER],
    delete: [ROLES.ADMIN],
  },

  contact: {
    create: ["PUBLIC"],
    getAll: [ROLES.ADMIN],
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  demography: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: ["PUBLIC"],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  listing: {
    create: [ROLES.ADMIN, ROLES.OWNER, ROLES.BROKER],
    getAll: ["PUBLIC"], // public route
    getSingle: ["PUBLIC"],
    update: [ROLES.ADMIN, ROLES.OWNER, ROLES.BROKER],
    // delete: [ROLES.ADMIN],
  },

  newsletter: {
    create: ["PUBLIC"],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  role: {
    create: [ROLES.ADMIN],
    getAll: [ROLES.ADMIN],
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  state: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  testimonial: {
    create: ["PUBLIC"],
    getAll: [ROLES.ADMIN], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },

  user: {
    create: ["PUBLIC"],
    getAll: [ROLES.ADMIN], // public route
    getSingle: [ROLES.ADMIN, ROLES.BROKER, ROLES.OWNER, ROLES.CUSTOMER],
    update: [ROLES.ADMIN, ROLES.BROKER, ROLES.OWNER, ROLES.CUSTOMER],
    delete: [ROLES.ADMIN],
  },

  propertyType: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  clientactivity: {
    create: [ROLES.CUSTOMER],
    getAll: [ROLES.ADMIN, ROLES.CUSTOMER], // public route
    getSingle: [ROLES.ADMIN, ROLES.BROKER, ROLES.OWNER, ROLES.CUSTOMER],
    update: [ROLES.BROKER, ROLES.OWNER],
    delete: [ROLES.ADMIN],
  },
  location: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  banner: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  brokdetail: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  kpi: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  profile: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  publicprop: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  search: {
    create: [ROLES.ADMIN],
    getAll: ["PUBLIC"], // public route
    getSingle: [ROLES.ADMIN],
    update: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  wishlist: {
    create: [ROLES.CUSTOMER],
    getAll: ["PUBLIC"], // public route
    // getSingle: [ROLES.ADMIN],
    // update: [ROLES.CUSTOMER],
    delete: [ROLES.CUSTOMER],
  },
};
