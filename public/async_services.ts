/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This file re-exports all parts of visualizations and datasources which can be loaded lazily
 * (to reduce page load bundle size) when Lens is actually accessed via editor or embeddable.
 *
 * It's also possible for each visualization and datasource to resolve this locally, but this causes
 * a burst of bundles being loaded on Lens startup at once (and in some scenarios cascading bundle loads).
 * This file causes all of them to be served in a single request.
 */
export * from './datatable_visualization';