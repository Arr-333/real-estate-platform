export const formatRate = (space, type) => {
  switch (type) {
    case "yr":
      return `₹${space.rate} /SF/YR`;
    case "mo":
      return `₹${(space.rate / 12).toFixed(2)} /SF/MO`;
    case "amt_yr":
      return `₹${space.rate * space.size}`;
    case "amt_mo":
      return `₹${((space.rate * space.size) / 12).toFixed(0)}`;
    default:
      return "";
  }
};
