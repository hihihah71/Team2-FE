/**
 * Simple HTML Sanitizer to prevent XSS while allowing basic rich text tags
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // 1. Create a temporary DOM element to parse the HTML string
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  // 2. Define whitelist of allowed tags and attributes
  const allowedTags = ['B', 'I', 'U', 'UL', 'LI', 'P', 'BR', 'SPAN', 'DIV', 'STRONG', 'EM']
  const allowedAttrs = ['class', 'style'] // Allow style for basic colors/aligning if needed, but risky

  // 3. Recursively clean the nodes
  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      
      // Remove disallowed tags
      if (!allowedTags.includes(el.tagName)) {
        // Replace tag with its text content or just remove
        const text = document.createTextNode(el.innerText)
        el.parentNode?.replaceChild(text, el)
        return
      }

      // Remove disallowed attributes (on*, javascript:, etc.)
      const attrs = Array.from(el.attributes)
      for (const attr of attrs) {
        if (!allowedAttrs.includes(attr.name.toLowerCase()) || attr.value.trim().toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr.name)
        }
      }

      // Recurse children
      Array.from(el.childNodes).forEach(cleanNode)
    }
  }

  Array.from(body.childNodes).forEach(cleanNode)

  return body.innerHTML
}
