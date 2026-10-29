import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { createServerFnIdGenerator } from "#/utils/server-fn-id.ts";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		tanstackStart({
			srcDirectory: "src",
			router: {
				routesDirectory: "routes"
			},
			serverFns: {
				// Seed production ids on the function name only, so moving a file
				// doesn't 500 every tab open across the deploy (#1549).
				generateFunctionId: createServerFnIdGenerator()
			}
		}),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] })
	],
	environments: {
		ssr: {
			build: {
				rolldownOptions: {
					output: {
						// workerd holds every server chunk's source on the 128 MB heap
						// from boot, so its size is memory, not just upload (#1893).
						// Names are kept so stack traces and `.name` still read.
						minify: {
							compress: { keepNames: { function: true, class: true } },
							mangle: { keepNames: true }
						}
					}
				}
			}
		}
	},
	server: {
		port: Number.parseInt(process.env.PORT ?? "3000", 10) || 3000,
		strictPort: true,
		host: true, // Listen on all interfaces for QStash Docker to reach via host.docker.internal
		allowedHosts: ["localhost", "127.0.0.1"],
		watch: {
			ignored: [
				"**/e2e/.auth/**",
				"**/e2e/results/**",
				"**/playwright-report/**",
				"**/test-results/**"
			]
		}
	},
	preview: {
		port: 3000,
		host: true
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (
						id.includes("node_modules/react/") ||
						id.includes("node_modules/react-dom/")
					) {
						return "vendor";
					}
				}
			}
		},
		chunkSizeWarningLimit: 1000
	}
});

export default config;
