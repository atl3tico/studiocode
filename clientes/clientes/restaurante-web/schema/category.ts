import { defineType, defineField } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The category name (e.g. Starters, Mains, Desserts, Drinks)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer(),
      description: 'Order of appearance on the menu (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'order',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `Order: ${subtitle}`,
      }
    },
  },
})