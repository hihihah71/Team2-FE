type TextValidationOptions = {
  required?: boolean
  minLength?: number
  maxLength?: number
  maxWords?: number
  maxWordLength?: number
  pattern?: RegExp
  emptyMessage?: string
  invalidMessage?: string
}

type PayloadValidationOptions = {
  maxWords?: number
  maxWordLength?: number
  skipKeyPattern?: RegExp
}

type FieldRule = {
  pathPattern: RegExp
  maxWords?: number
  maxWordLength?: number
}

const FIELD_RULES: FieldRule[] = [
  { pathPattern: /fullName|name$/i, maxWords: 8, maxWordLength: 20 },
  { pathPattern: /title$/i, maxWords: 16, maxWordLength: 24 },
  { pathPattern: /company|organization/i, maxWords: 12, maxWordLength: 24 },
  { pathPattern: /location|address/i, maxWords: 30, maxWordLength: 30 },
  { pathPattern: /summary|about/i, maxWords: 120, maxWordLength: 24 },
  { pathPattern: /description|requirements|responsibilit|achievement/i, maxWords: 350, maxWordLength: 28 },
  { pathPattern: /skill|keyword|tag/i, maxWords: 60, maxWordLength: 24 },
  { pathPattern: /jobDescription|jdText/i, maxWords: 500, maxWordLength: 30 },
  { pathPattern: /prompt|question|answer|message|content/i, maxWords: 400, maxWordLength: 30 },
]

export function countWords(text: string): number {
  const normalized = text.trim()
  if (!normalized) return 0
  return normalized.split(/\s+/).length
}

export function hasOverlongWord(text: string, maxWordLength = 20): boolean {
  return text
    .trim()
    .split(/\s+/)
    .some((word) => word.length > maxWordLength)
}

export function validateText(
  text: string,
  options: TextValidationOptions = {},
): string | null {
  const value = text.trim()

  if (options.required && !value) {
    return options.emptyMessage || 'Truong nay la bat buoc.'
  }

  if (!value) return null

  if (options.minLength && value.length < options.minLength) {
    return `Noi dung phai co it nhat ${options.minLength} ky tu.`
  }

  if (options.maxLength && value.length > options.maxLength) {
    return `Noi dung khong duoc vuot qua ${options.maxLength} ky tu.`
  }

  if (options.maxWords && countWords(value) > options.maxWords) {
    return `Noi dung khong duoc vuot qua ${options.maxWords} tu.`
  }

  if (hasOverlongWord(value, options.maxWordLength ?? 20)) {
    return `Moi tu khong duoc dai qua ${options.maxWordLength ?? 20} ky tu.`
  }

  if (options.pattern && !options.pattern.test(value)) {
    return options.invalidMessage || 'Noi dung chua ky tu khong hop le.'
  }

  return null
}

export function validatePayloadTextFields(
  payload: unknown,
  options: PayloadValidationOptions = {},
): string | null {
  const maxWords = options.maxWords ?? 300
  const maxWordLength = options.maxWordLength ?? 20
  const skipKeyPattern =
    options.skipKeyPattern ??
    /(token|password|email|url|uri|link|base64|image|avatar|cover|otp|code|phone|jwt)/i
  const resolveRule = (path: string): { maxWords: number; maxWordLength: number } => {
    const rule = FIELD_RULES.find((item) => item.pathPattern.test(path))
    return {
      maxWords: rule?.maxWords ?? maxWords,
      maxWordLength: rule?.maxWordLength ?? maxWordLength,
    }
  }

  const walk = (value: unknown, path: string, key?: string): string | null => {
    if (value == null) return null

    if (typeof value === 'string') {
      if (key && skipKeyPattern.test(key)) return null
      const rule = resolveRule(path)
      const error = validateText(value, {
        maxWords: rule.maxWords,
        maxWordLength: rule.maxWordLength,
      })
      if (!error) return null
      return `Truong ${path}: ${error}`
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        const childError = walk(value[i], `${path}[${i}]`, key)
        if (childError) return childError
      }
      return null
    }

    if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        const childPath = path ? `${path}.${k}` : k
        const childError = walk(v, childPath, k)
        if (childError) return childError
      }
    }

    return null
  }

  return walk(payload, 'body')
}
