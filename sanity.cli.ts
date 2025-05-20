import { defineCliConfig } from 'sanity/cli';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineCliConfig({
	api: {
		projectId: 'ank3g73p',
		dataset: 'production'
	},
	project: {
		basePath: '/studio'
	},
	/**
	 * Enable auto-updates for studios.
	 * Learn more at https://www.sanity.io/docs/cli#auto-updates
	 */
	autoUpdates: true,
	vite: {
		plugins: [tsconfigPaths()]
	}
});
