import { useEffect, useState } from 'react'
import Places from './Places.jsx'
import Error from './Error.jsx'
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js'

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true)

      try {
        const places = await fetchAvailablePlaces()
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const sortedPlaces = sortPlacesByDistance(
              places,
              position.coords.latitude,
              position.coords.longitude
            )
            setAvailablePlaces(sortedPlaces)
            setIsLoading(false)
          },
          (error) => {
            console.error('Geolocation error:', error)
            setAvailablePlaces(places)
          }
        )
      } catch (error) {
        setError({
          message:
            error.message || 'Counld not fetch places. Please try again later.',
        })
        console.error('Error fetching places:', error)
      }

      setIsLoading(false)
    }
    fetchPlaces()
  }, [])

  if (error) {
    return (
      <Error
        title="An error occurred"
        message={error.message}
        onConfirm={() => setError(undefined)}
      />
    )
  }
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
