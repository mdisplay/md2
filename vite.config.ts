import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import babel from '@rollup/plugin-babel';
import legacyPluginMod from 'vite-plugin-legacy';

const legacyPlugin = (legacyPluginMod as any).default; //

console.log('legacyPlugin', legacyPlugin);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // legacy({
    //   targets: { ie: '8' },
    // }),
    // The default options are listed below. Pass nothing to use them.
    // legacyPlugin({
    //   // The browsers that must be supported by your legacy bundle.
    //   // https://babeljs.io/docs/en/babel-preset-env#targets
    //   targets: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'],
    //   // Define which polyfills your legacy bundle needs. They will be loaded
    //   // from the Polyfill.io server. See the "Polyfills" section for more info.
    //   polyfills: [
    //     // Empty by default
    //   ],
    //   // Toggles whether or not browserslist config sources are used.
    //   // https://babeljs.io/docs/en/babel-preset-env#ignorebrowserslistconfig
    //   ignoreBrowserslistConfig: false,
    //   // When true, core-js@3 modules are inlined based on usage.
    //   // When false, global namespace APIs (eg: Object.entries) are loaded
    //   // from the Polyfill.io server.
    //   corejs: false,
    // }),
  ],
  // build: {
  //   minify: false,
  //   target: 'chrome39',
  // },
});
