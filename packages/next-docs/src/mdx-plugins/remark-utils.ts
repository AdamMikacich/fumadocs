import type { Content, Literal } from 'mdast'
import { visit } from './unist-visit'

const textTypes = ['text', 'inlineCode', 'code']

export function flattenNode(node: Content): string {
  const p: string[] = []

  visit(node, textTypes, (child: Literal) => {
    p.push(child.value)
  })

  return p.join('')
}