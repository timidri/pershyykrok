/**
 * PTE behavior: make alignment decorators (left, center, right) mutually exclusive.
 * When the user toggles one alignment, the others are removed from the selection first.
 */
import { useEditor } from '@portabletext/editor'
import { defineBehavior, execute } from '@portabletext/editor/behaviors'
import { isActiveDecorator } from '@portabletext/editor/selectors'
import { useEffect } from 'react'

const ALIGNMENT_DECORATORS = ['left', 'center', 'right'] as const

const alignmentMutualExclusivityBehavior = defineBehavior({
  on: 'decorator.toggle',
  guard: ({ snapshot, event }) => {
    const decorator = event.decorator
    if (typeof decorator !== 'string' || !ALIGNMENT_DECORATORS.includes(decorator as (typeof ALIGNMENT_DECORATORS)[number])) {
      return false
    }
    const at = event.at ?? snapshot.context.selection
    if (!at) return false
    const wasActive = isActiveDecorator(decorator)(snapshot)
    return { decorator, at, wasActive }
  },
  actions: [
    (_, { decorator, at, wasActive }) => {
      const actions: ReturnType<typeof execute>[] = []
      for (const d of ALIGNMENT_DECORATORS) {
        actions.push(execute({ type: 'decorator.remove', decorator: d, at }))
      }
      if (!wasActive) {
        actions.push(execute({ type: 'decorator.add', decorator, at }))
      }
      return actions
    },
  ],
})

export function AlignmentMutualExclusivityPlugin() {
  const editor = useEditor()
  useEffect(() => {
    const unregister = editor.registerBehavior({
      behavior: alignmentMutualExclusivityBehavior,
    })
    return () => unregister()
  }, [editor])
  return null
}
