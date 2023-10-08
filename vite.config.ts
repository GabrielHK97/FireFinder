import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	},
	plugins: [
		sveltekit(),
		//VitePWA(),
		SvelteKitPWA({ strategies: 'injectManifest', filename: 'worker.js' })
	],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
					process: true
				}),
				NodeModulesPolyfillPlugin()
			]
		}
	},
	build: {
		rollupOptions: {
			plugins: [rollupNodePolyFill()]
		}
	}
});
