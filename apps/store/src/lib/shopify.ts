import { SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_STORE_DOMAIN } from '$env/static/private';

const STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`;

export class ShopifyError extends Error {
	constructor(
		message: string,
		public readonly code: 'NETWORK_ERROR' | 'HTTP_ERROR' | 'GRAPHQL_ERROR' | 'PARSE_ERROR',
		public readonly statusCode?: number,
		public readonly recoverable: boolean = false
	) {
		super(message);
		this.name = 'ShopifyError';
	}
}

interface ShopifyResponse<T> {
	data: T;
	errors?: Array<{ message: string; locations?: Array<{ line: number; column: number }> }>;
}

async function fetchWithTimeout(
	url: string,
	options: RequestInit,
	timeoutMs: number = 10000
): Promise<Response> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		return response;
	} catch (err) {
		clearTimeout(timeout);
		if (err instanceof Error) {
			if (err.name === 'AbortError') {
				throw new ShopifyError('Request timed out', 'NETWORK_ERROR', undefined, true);
			}
			throw new ShopifyError(`Network error: ${err.message}`, 'NETWORK_ERROR', undefined, true);
		}
		throw new ShopifyError('Unknown network error', 'NETWORK_ERROR', undefined, true);
	} finally {
		clearTimeout(timeout);
	}
}

export async function storefront<T>(
	query: string,
	variables: Record<string, unknown> = {},
	options: { retries?: number; timeoutMs?: number } = {}
): Promise<T> {
	const { retries = 0, timeoutMs = 10000 } = options;
	let lastError: ShopifyError | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetchWithTimeout(
				STOREFRONT_URL,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
					},
					body: JSON.stringify({ query, variables }),
				},
				timeoutMs
			);

			if (!res.ok) {
				const isRecoverable = res.status === 429 || res.status >= 500;
				throw new ShopifyError(
					`Shopify API error: ${res.status} ${res.statusText}`,
					'HTTP_ERROR',
					res.status,
					isRecoverable
				);
			}

			let json: ShopifyResponse<T>;
			try {
				json = await res.json();
			} catch {
				throw new ShopifyError('Failed to parse Shopify response', 'PARSE_ERROR', res.status);
			}

			if (json.errors) {
				const messages = json.errors.map((e) => e.message).join(', ');
				throw new ShopifyError(`GraphQL error: ${messages}`, 'GRAPHQL_ERROR', undefined, false);
			}

			return json.data;
		} catch (err) {
			if (err instanceof ShopifyError) {
				lastError = err;
				if (!err.recoverable || attempt >= retries) {
					throw err;
				}
				await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
			} else {
				throw new ShopifyError(
					err instanceof Error ? err.message : 'Unknown error',
					'NETWORK_ERROR',
					undefined,
					true
				);
			}
		}
	}

	throw lastError || new ShopifyError('Max retries exceeded', 'NETWORK_ERROR', undefined, true);
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
