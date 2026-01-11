/**
 * HR Feature Module
 * Human resources components, controllers, and types
 *
 * Note: For types that conflict with controller exports,
 * import directly from '@/features/hr/types'
 */

export * from './controllers';
// Services re-exported with namespace to avoid conflicts
export * as hrServices from './services';
// Components exported individually as needed
