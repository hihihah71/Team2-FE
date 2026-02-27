const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type ApiErrorShape = {
  message?: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Đã xảy ra lỗi khi gọi API.'

    try {
      const data = (await response.json()) as ApiErrorShape
      if (data?.message) {
        message = data.message
      }
    } catch {
      // ignore JSON parse error
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  useAuth?: boolean
}

async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, useAuth = true } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (useAuth) {
    const token = window.localStorage.getItem('access_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  return handleResponse<TResponse>(response)
}

export function apiGet<TResponse>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return request<TResponse>(path, { ...(options ?? {}), method: 'GET' })
}

export function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: Omit<RequestOptions, 'method' | 'body'>,
) {
  return request<TResponse>(path, { ...(options ?? {}), method: 'POST', body })
}

export function apiPut<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: Omit<RequestOptions, 'method' | 'body'>,
) {
  return request<TResponse>(path, { ...(options ?? {}), method: 'PUT', body })
}

export function apiDelete<TResponse>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return request<TResponse>(path, { ...(options ?? {}), method: 'DELETE' })
}

