import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub project Pages URL: https://<user>.github.io/<REPO>/
// Must match the repository name (change if your repo is not "GiovannyPortfolio").
const GH_PAGES_BASE = '/GiovannyPortfolio/'


// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
   base: mode === 'production' ? GH_PAGES_BASE : '/',
  // base: '/',
  plugins: [react()],
  /** So `import '…/file.fbx?url'` works from `src/assets` */
  assetsInclude: ['**/*.fbx', '**/*.FBX', '**/*.pdf'],
}))
