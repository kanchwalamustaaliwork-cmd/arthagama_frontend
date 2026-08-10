/**
 * Terminal SDK — unified client interface for all terminal sub-systems.
 *
 * Hooks and UI components import ONLY from this SDK, never from axios directly.
 * All normalization, response shaping, and endpoint path definitions live here.
 */

export * as searchSdk from './search'
export * as marketSdk from './market'
export * as chartSdk from './chart'
export * as optionsSdk from './options'
export * as newsSdk from './news'
export * as fundamentalsSdk from './fundamentals'
export * as macroSdk from './macro'
export * as instrumentsSdk from './instruments'
