#!/usr/bin/env tsx
import { HttpTypes } from "@medusajs/types";
import "dotenv/config";
import { writeFileSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

export interface StaticRoute {
  path: string;
  priority: 'high' | 'medium' | 'low';
  lastModified?: string;
}

interface RouteGenerationOptions {
  outputFile?: string;
}

interface DiscoveredRoute {
  path: string;
  priority: 'high' | 'medium' | 'low';
  isDataDriven: boolean;
}

// Configuration
const MEDUSA_BACKEND_URL = process.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";

// Priority mapping for different route types
const ROUTE_PRIORITIES = {
  high: ['/', '/health'],
  medium: ['/store', '/login', '/cart', '/checkout', '/account'],
  low: []
} as const;

// Routes that should not have country-specific variants
const NO_COUNTRY_VARIANTS = ['/health'];

// Routes to exclude from static generation (both country and non-country variants)
const EXCLUDED_ROUTES: string[] = [
  "/health",
  "/checkout",
  "/account",
  "/login",
  "/register",
  "/cart",
  "/order"
];

// Data-driven routes that need special handling
const DATA_DRIVEN_ROUTES = ['/products', '/categories'];

/**
 * Fetch regions from Medusa backend
 */
async function fetchRegions(): Promise<HttpTypes.StoreRegion[]> {
  const queryParams = new URLSearchParams({
    limit: '1000',
    fields: "*countries"
  });
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/regions?${queryParams.toString()}`, {
    headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    
  });
  const data = await response.json();
  return data.regions || [];
}

/**
 * Fetch product categories from Medusa backend
 */
async function fetchCategories(): Promise<HttpTypes.StoreProductCategory[]> {
  const queryParams = new URLSearchParams({
    limit: '1000',
    fields: "handle,updated_at"
  });
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/product-categories?${queryParams.toString()}`, {
    headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
  });
  const data = await response.json();
  return data.product_categories || [];
}

/**
 * Fetch products from Medusa backend
 */
async function fetchProducts(): Promise<HttpTypes.StoreProduct[]> {
  const queryParams = new URLSearchParams({
    limit: '1000',
    fields: "handle,updated_at"
  });
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products?${queryParams.toString()}`, {
    headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
  });
  const data = await response.json();
  return data.products || [];
}

/**
 * Determine route priority based on path
 */
function getRoutePriority(path: string): 'high' | 'medium' | 'low' {
  if (ROUTE_PRIORITIES.high.some(route => path === route || path.startsWith(route + '/'))) {
    return 'high';
  }
  if (ROUTE_PRIORITIES.medium.some(route => path === route || path.startsWith(route + '/'))) {
    return 'medium';
  }
  return 'low';
}

/**
 * Check if a route is data-driven (products/categories)
 */
function isDataDrivenRoute(path: string): boolean {
  return DATA_DRIVEN_ROUTES.some(route => path.startsWith(route));
}

/**
 * Check if a route should be excluded from static generation
 */
function isExcludedRoute(path: string): boolean {
  return EXCLUDED_ROUTES.some(excludedRoute => {
    // Check for exact match or if the path starts with the excluded route
    return path === excludedRoute || path.startsWith(excludedRoute + '/');
  });
}

/**
 * Recursively discover routes from the filesystem
 */
function discoverRoutesFromFilesystem(): DiscoveredRoute[] {
  const routes: DiscoveredRoute[] = [];
  const routesDir = join(process.cwd(), 'src', 'routes');
  
  try {
    if (!statSync(routesDir).isDirectory()) {
      throw new Error('Routes directory not found');
    }
    
    const routeFiles = readdirSync(routesDir, { recursive: true });
    
    for (const file of routeFiles) {
      if (typeof file === 'string' && file.endsWith('.tsx')) {
        const filePath = join(routesDir, file);
        const content = readFileSync(filePath, 'utf8');
        
        // Extract route paths from createFileRoute calls
        const routeMatches = content.match(/createFileRoute\(["']([^"']+)["']\)/g);
        
        if (routeMatches) {
          for (const match of routeMatches) {
            const routeMatch = match.match(/createFileRoute\(["']([^"']+)["']\)/);
            if (routeMatch) {
              const routePath = routeMatch[1];
              
              // Convert TanStack Router paths to actual paths
              let actualPath = routePath
                .replace('/$countryCode', '') // Remove country code placeholder
                .replace(/\$[^/]+/g, '') // Remove dynamic segments for static generation
                .replace(/\/+/g, '/') // Normalize slashes
                .replace(/\/$/, '') || '/'; // Ensure root is '/'
              
              // Skip invalid paths
              if (actualPath.includes('$') || actualPath === '' || isExcludedRoute(actualPath)) {
                continue;
              }
              
              const priority = getRoutePriority(actualPath);
              const isDataDriven = isDataDrivenRoute(actualPath);
              
              routes.push({
                path: actualPath,
                priority,
                isDataDriven
              });
            }
          }
        }
      }
    }
    
    // Remove duplicates and sort
    const uniqueRoutes = routes.filter((route, index, self) => 
      index === self.findIndex(r => r.path === route.path)
    );
    
    console.log(`Discovered ${uniqueRoutes.length} routes from filesystem`);
    return uniqueRoutes;
    
  } catch (error) {
    console.warn('Could not discover routes from filesystem.');
    return []
  }
}

/**
 * Generate static routes for products and categories
 */
function generateDataDrivenRoutes(
  categories: HttpTypes.StoreProductCategory[],
  products: HttpTypes.StoreProduct[]
): StaticRoute[] {
  const routes: StaticRoute[] = [];
  
  // Generate base routes (without country codes) for products and categories
  for (const category of categories) {
    if (category.handle) {
      routes.push({
        path: `/categories/${category.handle}`,
        priority: 'medium',
        lastModified: new Date().toISOString()
      });
    }
  }
  
  for (const product of products) {
    if (product.handle) {
      routes.push({
        path: `/products/${product.handle}`,
        priority: 'medium',
        lastModified: product.updated_at || new Date().toISOString()
      });
    }
  }
  
  return routes;
}

/**
 * Generate country-specific routes for data-driven content
 */
function generateCountrySpecificDataRoutes(
  countryCodes: string[],
  categories: HttpTypes.StoreProductCategory[],
  products: HttpTypes.StoreProduct[]
): StaticRoute[] {
  const routes: StaticRoute[] = [];
  
  for (const countryCode of countryCodes) {
    routes.push({
      path: `/${countryCode}/`,
      priority: 'high',
      lastModified: new Date().toISOString()
    });
    // Generate country-specific category routes
    for (const category of categories) {
      if (category.handle) {
        routes.push({
          path: `/${countryCode}/categories/${category.handle}`,
          priority: 'medium',
          lastModified: new Date().toISOString()
        });
      }
    }
    
    // Generate country-specific product routes
    for (const product of products) {
      if (product.handle) {
        routes.push({
          path: `/${countryCode}/products/${product.handle}`,
          priority: 'medium',
          lastModified: product.updated_at || new Date().toISOString()
        });
      }
    }
  }
  
  return routes;
}

/**
 * Generate country-specific variants for static routes
 */
function generateCountrySpecificStaticRoutes(
  countryCodes: string[],
  staticRoutes: DiscoveredRoute[]
): StaticRoute[] {
  const routes: StaticRoute[] = [];
  
  for (const countryCode of countryCodes) {
    for (const route of staticRoutes) {
      // Skip data-driven routes and routes that shouldn't have country variants
      if (route.isDataDriven || NO_COUNTRY_VARIANTS.includes(route.path)) {
        continue;
      }
      
      const countrySpecificPath = `/${countryCode}${route.path}`;
      
      // Skip root route
      if (route.path === '/' || isExcludedRoute(route.path)) {
        continue;
      }
      
      routes.push({
        path: countrySpecificPath,
        priority: route.priority,
        lastModified: new Date().toISOString()
      });
    }
  }
  
  return routes;
}

/**
 * Main function to generate all static routes
 * Routes listed in EXCLUDED_ROUTES will be excluded from both country and non-country variants
 */
async function generateStaticRoutes(options: RouteGenerationOptions = {}): Promise<StaticRoute[]> {
  const { outputFile = 'static-routes.json' } = options;
  
  console.log('Starting static route generation...');
  
  try {
    // Fetch all data in parallel
    const [regions, categories, products] = await Promise.all([
      fetchRegions(),
      fetchCategories(),
      fetchProducts()
    ]);
    
    // Extract country codes from all regions
    const countryCodes = regions
      .flatMap(region => region.countries?.map(country => country.iso_2?.toLowerCase()) || [])
      .filter((code): code is string => Boolean(code));
    
    console.log(`Found ${countryCodes.length} countries: ${countryCodes.join(', ')}`);
    
    // Discover static routes from filesystem
    const discoveredRoutes = discoverRoutesFromFilesystem();
    const staticRoutes = discoveredRoutes.filter(route => !route.isDataDriven);
    const dataDrivenRoutes = discoveredRoutes.filter(route => route.isDataDriven);
    
    console.log(`Found ${staticRoutes.length} static routes and ${dataDrivenRoutes.length} data-driven routes`);
    
    const allRoutes: StaticRoute[] = [];
    
    // 1. Add base static routes (without country codes)
    for (const route of staticRoutes) {
      allRoutes.push({
        path: route.path,
        priority: route.priority,
        lastModified: new Date().toISOString()
      });
    }
    
    // 2. Add base data-driven routes (products/categories without country codes)
    const baseDataRoutes = generateDataDrivenRoutes(categories, products);
    allRoutes.push(...baseDataRoutes);
    
    // 3. Add country-specific static routes
    const countrySpecificStaticRoutes = generateCountrySpecificStaticRoutes(countryCodes, staticRoutes);
    allRoutes.push(...countrySpecificStaticRoutes);
    
    // 4. Add country-specific data-driven routes
    const countrySpecificDataRoutes = generateCountrySpecificDataRoutes(countryCodes, categories, products);
    allRoutes.push(...countrySpecificDataRoutes);
    
    // Sort routes by priority and path
    allRoutes.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.path.localeCompare(b.path);
    });
    
    // Write routes to file
    const outputPath = join(process.cwd(), outputFile);
    writeFileSync(outputPath, JSON.stringify(allRoutes, null, 2));
    
    // Log summary
    const baseRoutes = allRoutes.filter(route => !route.path.includes('/') || route.path === '/');
    const countryRoutes = allRoutes.filter(route => route.path !== '/' && route.path.includes('/'));
    
    console.log(`Generated ${allRoutes.length} static routes:`);
    console.log(`- ${baseRoutes.length} base routes (without country codes)`);
    console.log(`- ${countryRoutes.length} country-specific routes`);
    console.log(`Routes saved to: ${outputPath}`);
    
    return allRoutes;
    
  } catch (error) {
    console.error('Failed to generate static routes:', error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: RouteGenerationOptions = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const value = args[i + 1];
  
  switch (key) {
    case '--output':
      options.outputFile = value;
      break;
  }
}

// Execute the script
generateStaticRoutes(options)
  .then(() => {
    console.log('Static route generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Static route generation failed:', error);
    process.exit(1);
  });