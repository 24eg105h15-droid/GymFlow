const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('gymflow-token')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const problem = await response.json()
      message = problem.detail || problem.message || message
    } catch {
      // Keep the status message when the response has no JSON body.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}