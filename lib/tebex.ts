const TEBEX_API_BASE = 'https://headless.tebex.io/api';
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;
const PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;
// Project ID for Checkout API authentication
export const TEBEX_PROJECT_ID = '1426490';

export interface TebexCategory {
  id: number;
  name: string;
  description: string;
  image?: string;
  order: number;
  parent?: number;
  packages?: TebexPackage[];
}

export interface TebexPackageVariable {
  identifier: string;
  description: string;
  type: 'text' | 'dropdown';
  required: boolean | number;
  options?: Array<{ name: string; value: string }>;
}

export interface TebexPackage {
  id: number;
  name: string;
  description: string;
  image?: string;
  type: string;
  category: {
    id: number;
    name: string;
  };
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  discount: number;
  disable_quantity: boolean;
  disable_gifting: boolean;
  expiration_date?: string;
  created_at?: string;
  updated_at?: string;
  variables?: TebexPackageVariable[];
}

export interface TebexBasketPackage {
  id: number;
  name: string;
  description: string;
  image?: string;
  in_basket: {
    quantity: number;
    price: number;
    gift_username_id?: number;
  };
}

export interface TebexBasket {
  ident: string;
  complete: boolean;
  id: number;
  country: string;
  ip: string;
  username_id?: number;
  username?: string;
  cancel_url: string;
  complete_url: string;
  complete_auto_redirect: boolean;
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  packages: TebexBasketPackage[];
  coupons: unknown[];
  giftcards: unknown[];
  creator_code?: string;
  links: {
    checkout: string;
  };
}

export interface WebstoreInfo {
  id: number;
  description: string;
  name: string;
  webstore_url: string;
  currency: string;
  lang: string;
  logo?: string;
  platform_type: string;
  platform_type_id: string;
  created_at: string;
}

// Get webstore info
export async function getWebstore(): Promise<WebstoreInfo | null> {
  if (!PUBLIC_TOKEN) {
    console.error('[Tebex] No public token configured');
    return null;
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to fetch webstore:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[Tebex] Error fetching webstore:', error);
    return null;
  }
}

// Fetch all categories with packages
export async function getCategories(): Promise<TebexCategory[]> {
  if (!PUBLIC_TOKEN) {
    console.error('[Tebex] No public token configured');
    return [];
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/categories?includePackages=1`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to fetch categories:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('[Tebex] Error fetching categories:', error);
    return [];
  }
}

// Fetch all packages from all categories
export async function getPackages(): Promise<TebexPackage[]> {
  const categories = await getCategories();
  const allPackages: TebexPackage[] = [];

  for (const category of categories) {
    if (category.packages) {
      allPackages.push(...category.packages);
    }
  }

  return allPackages;
}

// Fetch single package
export async function getPackage(id: number): Promise<TebexPackage | null> {
  if (!PUBLIC_TOKEN) {
    console.error('[Tebex] No public token configured');
    return null;
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/packages/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to fetch package:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[Tebex] Error fetching package:', error);
    return null;
  }
}

// Fetch single category
export async function getCategory(id: number): Promise<TebexCategory | null> {
  if (!PUBLIC_TOKEN) {
    console.error('[Tebex] No public token configured');
    return null;
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/categories/${id}?includePackages=1`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to fetch category:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[Tebex] Error fetching category:', error);
    return null;
  }
}

// Create basket
export async function createBasket(returnUrl: string, completeUrl: string): Promise<TebexBasket | null> {
  if (!PUBLIC_TOKEN) {
    console.error('[Tebex] No public token configured');
    return null;
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_url: returnUrl,
        complete_url: completeUrl,
        complete_auto_redirect: true,
      }),
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to create basket:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[Tebex] Error creating basket:', error);
    return null;
  }
}

// Fetch basket
export async function getBasket(ident: string): Promise<TebexBasket | null> {
  if (!PUBLIC_TOKEN) {
    console.error('[Tebex] No public token configured');
    return null;
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/baskets/${ident}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to fetch basket:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[Tebex] Error fetching basket:', error);
    return null;
  }
}

// Add package to basket
export async function addToBasket(
  ident: string,
  packageId: number,
  quantity: number = 1,
  variableData?: Record<string, string>,
): Promise<TebexBasket | null> {
  try {
    const body: Record<string, unknown> = {
      package_id: packageId,
      quantity,
    };

    if (variableData && Object.keys(variableData).length > 0) {
      body.variable_data = variableData;
    }

    const response = await fetch(`${TEBEX_API_BASE}/baskets/${ident}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Tebex] Failed to add to basket:', response.status, errorText);
      
      // Parse error and throw with meaningful message
      try {
        const errorJson = JSON.parse(errorText);
        const message = errorJson.message || errorJson.error || errorJson.detail || 'Failed to add item';
        throw new Error(message);
      } catch (parseErr) {
        if (parseErr instanceof SyntaxError) {
          // JSON parse failed, use status-based message
          if (response.status === 404) {
            throw new Error('Basket expired. Please refresh the page.');
          } else if (response.status === 422) {
            throw new Error('This package cannot be added to your cart.');
          } else if (response.status === 403) {
            throw new Error('You must be logged in to add items to your cart.');
          }
          throw new Error(`Failed to add item (Error ${response.status})`);
        }
        throw parseErr;
      }
    }

    // /baskets/{ident}/packages returns the basket directly, not wrapped in { data: ... }
    return await response.json();
  } catch (error) {
    console.error('[Tebex] Error adding to basket:', error);
    throw error; // Re-throw to preserve error message
  }
}

export async function removeFromBasket(ident: string, packageId: number): Promise<TebexBasket | null> {
  try {
    const response = await fetch(`${TEBEX_API_BASE}/baskets/${ident}/packages/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
      }),
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to remove from basket:', response.status, response.statusText);
      return null;
    }

    // /baskets/{ident}/packages/remove returns the basket directly, not wrapped in { data: ... }
    return await response.json();
  } catch (error) {
    console.error('[Tebex] Error removing from basket:', error);
    return null;
  }
}

// Get auth URL for username - using server-side endpoint with private key
export async function getAuthUrl(ident: string, returnUrl: string): Promise<string | null> {
  try {
    // Use server-side API route that has access to private key
    const response = await fetch(`/api/tebex/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basketIdent: ident,
        returnUrl,
      }),
    });

    if (!response.ok) {
      console.error('[Tebex] Failed to get auth URL:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error('[Tebex] Error getting auth URL:', error);
    return null;
  }
}

// Format price helper
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}
