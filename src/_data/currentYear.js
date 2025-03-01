/**
 * Dynamically returns the current year
 * This will be available in templates as {{ currentYear }}
 */
module.exports = () => {
  return new Date().getFullYear();
};
