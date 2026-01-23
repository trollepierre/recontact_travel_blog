import { resolve } from 'node:path'
import { existsSync, copyFileSync } from 'node:fs'

const root = resolve(process.cwd())
const envLocal = resolve(root, '.env.local')
const envDefaults = resolve(root, '.env.defaults')

try {
	if (existsSync(envLocal)) {
		console.log('[back env] .env.local already exists')
		process.exit(0)
	}
	if (existsSync(envDefaults)) {
		copyFileSync(envDefaults, envLocal)
		console.log('[back env] Created .env.local from .env.defaults')
		process.exit(0)
	}
	console.log('[back env] No .env.local and no .env.defaults found, skipping')
	process.exit(0)
} catch (e) {
	console.error('[back env] Failed to prepare .env.local:', e && e.message ? e.message : e)
	process.exit(0)
}

