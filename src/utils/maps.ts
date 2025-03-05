/**
 * Generates a Google Maps URL for the given address
 * @param address The address to generate a Google Maps URL for
 * @returns A Google Maps URL that opens the address in Google Maps
 */
export function getGoogleMapsUrl(address: string): string {
  // Encode the address so it can be used in a URL
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}
