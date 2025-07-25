export async function fetchAvailablePlaces() {
  try {
    const response = await fetch('http://localhost:3000/places')
    if (!response.ok) {
      throw new Error('Failed to fetch places')
    }
    const data = await response.json()
    return data.places
  } catch (error) {
    console.error('Error fetching places:', error)
    throw error
  }
}

export async function updateUserPlaces(userPlaces) {
  try {
    const response = await fetch('http://localhost:3000/user-places', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ places: userPlaces }),
    })
    if (!response.ok) {
      throw new Error('Failed to update user places')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating user places:', error)
    throw error
  }
}

export async function fetchUserPlaces() {
  try {
    const response = await fetch('http://localhost:3000/user-places')
    if (!response.ok) {
      throw new Error('Failed to fetch user places')
    }
    const data = await response.json()
    return data.places
  } catch (error) {
    console.error('Error fetching user places:', error)
    throw error
  }
}
