import { createClient } from '@sanity/client';

// Configure the Sanity client for fetching menu data
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'your_project_id',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // API version timestamp
  useCdn: import.meta.env.PROD, // Use CDN in production for performance
});

// TypeScript interfaces for robust typing
export interface Category {
  _id: string;
  name: string;
  order: number;
}

export interface Dish {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category: Category;
  imageUrl?: string;
  spicyLevel?: number;
  isVegetarian: boolean;
  isVegan: boolean;
}

/**
 * Fetches the entire restaurant menu, grouped by category.
 * Queries Sanity, expands category references, and returns a grouped list.
 */
export async function getRestaurantMenu(): Promise<Record<string, Dish[]>> {
  // GROQ query to fetch all dishes ordered by category order, then title
  const query = `
    *[_type == "dish"] | order(category->order asc, title asc) {
      _id,
      title,
      description,
      price,
      spicyLevel,
      isVegetarian,
      isVegan,
      "category": category->{
        _id,
        name,
        order
      },
      "imageUrl": image.asset->url
    }
  `;

  try {
    const dishes: Dish[] = await sanityClient.fetch(query);

    // Group dishes by category name
    const groupedMenu: Record<string, Dish[]> = {};

    for (const dish of dishes) {
      if (!dish.category) continue;

      const categoryName = dish.category.name;
      if (!groupedMenu[categoryName]) {
        groupedMenu[categoryName] = [];
      }

      groupedMenu[categoryName].push(dish);
    }

    return groupedMenu;
  } catch (error) {
    console.error("Error fetching menu from Sanity CMS:", error);
    return {};
  }
}
