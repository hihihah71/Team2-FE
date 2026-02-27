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

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return handleResponse<TResponse>(response)
}

