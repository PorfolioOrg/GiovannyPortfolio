import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /** So `import '…/file.fbx?url'` works from `src/assets` */
  assetsInclude: ['**/*.fbx', '**/*.FBX'],
})
