import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Actions, serve from /<repo-name>/ so the build works on
// GitHub Pages project sites without hardcoding the repo name.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  plugins: [react()],
  base: repo ? `/${repo}/` : '/',
})
