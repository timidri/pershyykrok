import React from 'react'
import {defineType, defineArrayMember} from 'sanity'
import {AlignLeftIcon, AlignCenterIcon, AlignRightIcon} from '../../components/AlignIcons'
import {TextAlignDecorator} from '../../components/TextAlignDecorator'

/**
 * Block content with alignment decorators (Left/Center/Right).
 * Reuse with: { name: 'fieldName', type: 'blockContent' }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {
            title: 'Left',
            value: 'left',
            icon: AlignLeftIcon,
            component: (props: {value?: string; children?: React.ReactNode}) => (
              <TextAlignDecorator value="left" {...props} />
            ),
          },
          {
            title: 'Center',
            value: 'center',
            icon: AlignCenterIcon,
            component: (props: {value?: string; children?: React.ReactNode}) => (
              <TextAlignDecorator value="center" {...props} />
            ),
          },
          {
            title: 'Right',
            value: 'right',
            icon: AlignRightIcon,
            component: (props: {value?: string; children?: React.ReactNode}) => (
              <TextAlignDecorator value="right" {...props} />
            ),
          },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
