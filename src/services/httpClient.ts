const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type ApiErrorShape = {
  message?: string
}

function getToken() {
  return localStorage.getItem("access_token")
}

function getHeaders() {
  const token = getToken()

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "API error"

    try {
      const data: ApiErrorShape = await response.json()
      if (data.message) message = data.message
    } catch {}

    throw new Error(message)
  }

  return response.json()
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getHeaders(),
    ...options
  })

  return handleResponse<T>(response)
}

export function apiGet<T>(path: string) {
  return request<T>(path)
}

export function apiPost<T>(path: string, body: any) {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body)
  })
}

export function apiPut<T>(path: string, body: any) {
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body)
  })
}

export function apiDelete<T>(path: string) {
  return request<T>(path, {
    method: "DELETE"
  })
}

