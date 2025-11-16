import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // NOME EXATO DO SEU REPOSITÓRIO NO GITHUB!!!
  base: '/pvd-museu-amazonia-projeto/',
})
