// Schedule document model
type Schedule = {
  day: number
  flight: string
  utc: string
}

// Route document model
type Route = {
  airline?: string
  airlineid?: string
  sourceairport?: string
  destinationairport?: string
  stops?: number
  equipment?: string
  schedule?: Schedule[]
  distance?: number
}

export type { Route }
