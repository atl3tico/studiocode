import { PUBLIC_SHOPIFY_STORE_DOMAIN, PUBLIC_SHOPIFY_STOREFRONT_TOKEN } from '$env/static/public';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2025-01',
  publicAccessToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
});

export async function getProducts(first = 10) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await client.request(query, { variables: { first } });
  
  if (errors) {
    console.error('Shopify API Error:', errors);
    return [];
  }
  
  return data.products.edges.map(edge => edge.node);
}
