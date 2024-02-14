// Geo document model
type Geo = {
  alt: number
  lat: number
  lon: number
}

// Airport document model
type Airport = {
  airportname?: string
  city: string
  country: string
  faa: string
  geo?: Geo
  icao?: string
  tz?: string
}

export type { Airport }
