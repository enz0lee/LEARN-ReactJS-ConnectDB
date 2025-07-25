import { useEffect, useState } from 'react'
import Places from './Places.jsx'

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true)
      const response = await fetch('http://localhost:3000/places')
      if (!response.ok) {
        throw new Error('Failed to fetch places')
      }
      const data = await response.json()
      setAvailablePlaces(data.places)
    }
    fetchPlaces()
      .catch((error) => {
        console.error('Error fetching places:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Fetching available places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  )
}
