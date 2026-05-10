// (Andy) Tell TypeScript that lucide deep icon modules export normal Lucide icons.
declare module "lucide-react/dist/esm/icons/*.js" {
  import type { LucideIcon } from "lucide-react"

  const icon: LucideIcon

  export default icon
}

declare module "lucide-react/dist/esm/icons/*.mjs" { // (Andy) For the ESM version of the icons
  import type { LucideIcon } from "lucide-react"

  const icon: LucideIcon

  export default icon
}
