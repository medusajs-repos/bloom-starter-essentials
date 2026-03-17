/**
 * Identity function that erases the return type for route loaders.
 *
 * Works around incompatibility between @medusajs/types (which uses
 * Record<string, unknown> for metadata fields) and TanStack Router's
 * structural type inference (which expands to { [x: string]: {} },
 * where `unknown` is not assignable to `{}`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitize = <T>(data: T): any => data
