import * as React from "react"

/* ==========================================
   CLIPBOARD
   HTTPS AND LOCALHOST BOTH ALLOW THE ASYNC
   CLIPBOARD API BUT AN HTTP DEPLOYMENT DOES
   NOT SO A LEGACY FALLBACK KEEPS COPY ALIVE
   ========================================== */

const COPY_FEEDBACK_MS = 2000

const writeToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const field = document.createElement("textarea")
  field.value = value
  field.setAttribute("readonly", "")
  field.style.position = "fixed"
  field.style.opacity = "0"
  document.body.appendChild(field)
  field.select()

  try {
    document.execCommand("copy")
  } finally {
    document.body.removeChild(field)
  }
}

/**
 * Copies text and reports the value it last copied, so a caller can
 * show a check mark against that exact value. The marker clears itself.
 */
export function useCopyToClipboard(resetAfterMs = COPY_FEEDBACK_MS) {
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy = React.useCallback(
    async (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      try {
        await writeToClipboard(value)
        setCopiedValue(value)
        timeoutRef.current = setTimeout(() => setCopiedValue(null), resetAfterMs)
        return true
      } catch {
        return false
      }
    },
    [resetAfterMs]
  )

  return { copiedValue, copy }
}