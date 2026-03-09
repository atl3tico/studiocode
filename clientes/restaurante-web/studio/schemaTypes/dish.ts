import { defineType, defineField } from 'sanity'

export const dishType = defineType({
  name: 'dish',
  title: 'Dish',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The name of the dish',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A mouth-watering description of the dish',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      description: 'The price of the dish',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
      description: 'The menu category this dish belongs to',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'An appetizing photo of the dish',
    }),
    defineField({
      name: 'spicyLevel',
      title: 'Spicy Level',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5).integer(),
      description: 'Spiciness from 0 (not spicy) to 5 (extremely spicy)',
      initialValue: 0,
    }),
    defineField({
      name: 'isVegetarian',
      title: 'Vegetarian',
      type: 'boolean',
      description: 'Is this dish vegetarian?',
      initialValue: false,
    }),
    defineField({
      name: 'isVegan',
      title: 'Vegan',
      type: 'boolean',
      description: 'Is this dish vegan?',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.name',
      media: 'image',
    },
  },
})
