import React from 'react'

/**
 * Renders alignment in the block editor when user applies Left/Center/Right.
 * Props come from the decorator (value = 'left' | 'center' | 'right').
 */
export function TextAlignDecorator(props: { value?: string; children?: React.ReactNode }) {
  const align = props.value === 'center' || props.value === 'right' ? props.value : 'left'
  return (
    <div style={{ textAlign: align, width: '100%' }}>
      {props.children}
    </div>
  )
}
