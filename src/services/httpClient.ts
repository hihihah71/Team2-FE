const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import { validatePayloadTextFields } from '../utils/inputValidation'

type ApiErrorShape = {
  message?: string
}

function getHeaders(isFormData: boolean = false) {
  const token = localStorage.getItem("access_token");
  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
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
  const validationError = validatePayloadTextFields(body)
  if (validationError) throw new Error(validationError)
  const isFormData = body instanceof FormData;
  return fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    method: "POST",
    headers: getHeaders(isFormData),
    body: isFormData ? body : JSON.stringify(body)
  }).then(handleResponse<T>);
}

export function apiPut<T>(path: string, body: any) {
  const validationError = validatePayloadTextFields(body)
  if (validationError) throw new Error(validationError)
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body)
  })
}

export function apiPatch<T>(path: string, body: any) {
  const validationError = validatePayloadTextFields(body)
  if (validationError) throw new Error(validationError)
  return request<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body)
  })
}

export function apiDelete<T>(path: string) {
  return request<T>(path, {
    method: "DELETE"
  })
}

export function sendForgotPasswordEmail(email: string) {
  return apiPost<{ message: string }>('/auth/forgot-password', { email })
}

