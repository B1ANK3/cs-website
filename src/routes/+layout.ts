// Remove prerender from root layout to allow client-side hydration
// Individual routes can still prerender if needed

// Completely destroys all content :: WHYYYYYYYYYYYYYYYYYY
export const prerender = true;
export const trailingSlash = 'always';
export const csr = true;
