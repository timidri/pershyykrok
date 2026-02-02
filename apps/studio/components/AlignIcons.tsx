import React from 'react'

/** Simple alignment icons for block content decorators (no @sanity/icons dependency). */
const size = 16

export function AlignLeftIcon() {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M2 3h12v1.5H2V3zm0 4h8v1.5H2V7zm0 4h12v1.5H2V11z" />
    </svg>
  )
}

export function AlignCenterIcon() {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M2 3h12v1.5H2V3zm2 4h8v1.5H4V7zm-2 4h12v1.5H2V11z" />
    </svg>
  )
}

export function AlignRightIcon() {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M2 3h12v1.5H2V3zm4 4h8v1.5H6V7zm-4 4h12v1.5H2V11z" />
    </svg>
  )
}
