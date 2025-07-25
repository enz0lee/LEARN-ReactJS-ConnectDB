import { useCallback, useRef, useState } from 'react'

import logoImg from './assets/logo.png'
import AvailablePlaces from './components/AvailablePlaces.jsx'
import DeleteConfirmation from './components/DeleteConfirmation.jsx'
import Error from './components/Error.jsx'
import Modal from './components/Modal.jsx'
import Places from './components/Places.jsx'
import { updateUserPlaces } from './http.js'

function App() {
  const selectedPlace = useRef()

  const [userPlaces, setUserPlaces] = useState([])
  const [error, setError] = useState()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  function handleStartRemovePlace(place) {
    setModalIsOpen(true)
    selectedPlace.current = place
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = []
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces
      }
      return [selectedPlace, ...prevPickedPlaces]
    })

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces])
    } catch (error) {
      console.error('Failed to update user places:', error)
      setUserPlaces(userPlaces)
      setError({
        message:
          error.message ||
          'Failed to update user places. Please try again later.',
      })
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      )

      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        )
      } catch (error) {
        setUserPlaces(userPlaces)
        console.error('Failed to update user places:', error)
        setError({
          message:
            error.message ||
            'Failed to update user places. Please try again later.',
        })
      }

      setModalIsOpen(false)
    },
    [userPlaces]
  )

  function handleErrorConfirm() {
    setError(undefined)
  }

  return (
    <>
      <Modal open={!!error} onClose={() => setError(undefined)}>
        {error && (
          <Error
            title="An error occurred"
            message={error?.message || 'An unexpected error occurred.'}
            onConfirm={handleErrorConfirm}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  )
}

export default App
