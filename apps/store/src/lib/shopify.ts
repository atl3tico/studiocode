import { SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_STORE_DOMAIN } from '$env/static/private';

const STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`;

interface ShopifyResponse<T> {
	data: T;
	errors?: Array<{ message: string }>;
}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
	const res = await fetch(STOREFRONT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
		},
		body: JSON.stringify({ query, variables }),
	});

	const json: ShopifyResponse<T> = await res.json();

	if (json.errors) {
		throw new Error(json.errors.map((e) => e.message).join(', '));
	}

	return json.data;
}

// Types
export interface MoneyV2 {
	amount: string;
	currencyCode: string;
}

export interface ProductImage {
	url: string;
	altText: string | null;
	width: number;
	height: number;
}

export interface ProductVariant {
	id: string;
	title: string;
	availableForSale: boolean;
	price: MoneyV2;
	compareAtPrice: MoneyV2 | null;
	selectedOptions: Array<{ name: string; value: string }>;
	image: ProductImage | null;
}

export interface Product {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	featuredImage: ProductImage | null;
	images: { edges: Array<{ node: ProductImage }> };
	variants: { edges: Array<{ node: ProductVariant }> };
	priceRange: {
		minVariantPrice: MoneyV2;
		maxVariantPrice: MoneyV2;
	};
	tags: string[];
	availableForSale: boolean;
}

export interface Collection {
	id: string;
	handle: string;
	title: string;
	description: string;
	image: ProductImage | null;
	products: { edges: Array<{ node: Product }> };
}

export interface CartLine {
	id: string;
	quantity: number;
	merchandise: {
		id: string;
		title: string;
		product: { title: string; handle: string; featuredImage: ProductImage | null };
		price: MoneyV2;
	};
}

export interface Cart {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	cost: {
		subtotalAmount: MoneyV2;
		totalAmount: MoneyV2;
		totalTaxAmount: MoneyV2 | null;
	};
	lines: { edges: Array<{ node: CartLine }> };
}

// Queries
export const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          availableForSale
          featuredImage { url altText width height }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          tags
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      availableForSale
      featuredImage { url altText width height }
      images(first: 10) {
        edges { node { url altText width height } }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            image { url altText width height }
          }
        }
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      tags
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title handle featuredImage { url altText width height } }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
        totalTaxAmount { amount currencyCode }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product { title handle featuredImage { url altText width height } }
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title handle featuredImage { url altText width height } }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title handle featuredImage { url altText width height } }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product { title handle featuredImage { url altText width height } }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;
