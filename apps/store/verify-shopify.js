/**
 * Verify Shopify Storefront API connection.
 * Usage: SHOPIFY_STORE_DOMAIN=x SHOPIFY_STOREFRONT_TOKEN=y node verify-shopify.js
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !token) {
	console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_TOKEN');
	process.exit(1);
}

const url = `https://${domain}/api/2024-10/graphql.json`;

fetch(url, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'X-Shopify-Storefront-Access-Token': token,
	},
	body: JSON.stringify({ query: '{ shop { name } }' }),
})
	.then((res) => res.json())
	.then((data) => {
		if (data.errors) {
			console.error('Shopify API Error:', JSON.stringify(data.errors, null, 2));
			process.exit(1);
		}
		console.log('Shopify connection OK. Store:', data.data.shop.name);
	})
	.catch((err) => {
		console.error('Connection failed:', err.message);
		process.exit(1);
	});
