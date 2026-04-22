/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// shadcn/ui usa deep-imports de lucide-react que não exponêm d.ts individuais.
// Delega ao tipo da biblioteca principal em vez de `any`.
declare module 'lucide-react/dist/esm/icons/*' {
  import { LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
