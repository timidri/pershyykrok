import type { PortableTextPluginsProps } from 'sanity'
import { AlignmentMutualExclusivityPlugin } from './alignment-mutual-exclusivity-plugin'

export function PortableTextEditorPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {props.renderDefault(props)}
      <AlignmentMutualExclusivityPlugin />
    </>
  )
}
