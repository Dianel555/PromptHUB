import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { getTagThemeClasses, type TagType } from "@/lib/enhanced-tag-system"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  tagType?: TagType
}

function Badge({ className, variant, tagType, ...props }: BadgeProps) {
  // 如果指定了tagType，使用增强的主题系统
  if (tagType) {
    const themeClasses = getTagThemeClasses(tagType, "solid")
    return <div className={cn(themeClasses, className)} {...props} />
  }

  // 否则使用原有的变体系统
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
