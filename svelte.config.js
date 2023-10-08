import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // files: {
    //   serviceWorker: 'service-worker.js',
    // }
  },
  preprocess: vitePreprocess()
};
export default config;