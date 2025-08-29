import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth-button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="bg-background/98 fixed top-0 z-[100] w-full border-b border-border/40 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="relative z-[110] flex items-center space-x-1">
            <AuthButton />
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="icon" variant="ghost">
                <Icons.gitHub className="size-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <div className="relative z-[120]">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
