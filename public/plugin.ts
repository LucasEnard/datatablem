/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Plugin, CoreSetup } from '@kbn/core/public';
import type { ChartsPluginSetup } from '@kbn/charts-plugin/public';
import type { ExpressionsSetup } from '@kbn/expressions-plugin/public';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import type { EditorFrameSetup, EditorFrameInstance } from '../types';
import type { FormatFactory } from '../common';
import type { FieldFormatsSetup, FieldFormatsStart } from '@kbn/field-formats-plugin/public';


import { getDatatableRenderer, setupExpressions } from './expression';
import { getDatatableVisualization } from './visualization';
import { LensPublicSetup } from '../../../x-pack/plugins/lens/public';

import { createStartServicesGetter } from '@kbn/kibana-utils-plugin/public';

import type { PaletteRegistry } from '@kbn/coloring';


interface DatatableVisualizationPluginStartPlugins {
  data: DataPublicPluginStart;
  fieldFormats: FieldFormatsStart;
}
export interface DatatableVisualizationPluginSetupPlugins {
  lens: LensPublicSetup;
  expressions: ExpressionsSetup;
  formatFactory: FormatFactory;
  editorFrame: EditorFrameInstance;
  charts: ChartsPluginSetup;
  fieldFormats: FieldFormatsSetup;
  palettes: PaletteRegistry;
}

export class DatatableMPlugin implements Plugin<void, void, DatatableVisualizationPluginSetupPlugins, DatatableVisualizationPluginStartPlugins > 
{
  public setup(core: CoreSetup<DatatableVisualizationPluginStartPlugins, void>,{ lens, expressions, formatFactory, editorFrame, charts, fieldFormats, palettes }: DatatableVisualizationPluginSetupPlugins)
  {
    console.log("START OF THE  V0.1.6");

    // Got rid of the editorFrame as it initiliazed at Lens start and here is only an empty shell ?
    // editorFrame.registerVisualization(async () => {
    //   const { getDatatableRenderer, getDatatableVisualization } = await import('../async_services');
    //   const palettes = await charts.palettes.getPalettes();

    //   expressions.registerRenderer(() =>
    //     getDatatableRenderer({
    //       formatFactory,
    //       theme: core.theme,
    //       getType: core
    //         .getStartServices()
    //         .then(([_, { data: dataStart }]) => dataStart.search.aggs.types.get),
    //       paletteService: palettes,
    //       uiSettings: core.uiSettings,
    //     })
    //   );

    //   return getDatatableVisualization({ paletteService: palettes, theme: core.theme });
    // });

    



    // Replaced by importing paletteRegistry
    // const palettes = await charts.palettes.getPalettes();
    
    
    const startServices = createStartServicesGetter(core.getStartServices);

    // startServices().plugins.data.search.aggs.types.get
    // createStartServicesGetter(core.getStartServices)
    expressions.registerRenderer(() =>
      getDatatableRenderer({
        formatFactory,
        theme: core.theme,
        getType: core
          .getStartServices()
          .then(([_, { data: dataStart }]) => dataStart.search.aggs.types.get),
        paletteService: palettes,
        uiSettings: core.uiSettings,
      })
    );


    setupExpressions(
      expressions,
      () => startServices().plugins.fieldFormats.deserialize,
      async () => {
        const { getTimeZone } = await import('./utils');
        return getTimeZone(core.uiSettings);
      }
    );



    lens.registerVisualization(async () => getDatatableVisualization({ paletteService: palettes, theme: core.theme }));
  };

  public start() {}

  public stop() {}
}
