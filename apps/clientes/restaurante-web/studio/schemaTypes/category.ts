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
      description: 'The name of the category (e.g., Starters, Mains, Desserts, Drinks)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
      description: 'The display order of this category on the menu (e.g., 1 for Starters)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'order',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: `Order: ${subtitle}`,
      }
    },
  },
})
