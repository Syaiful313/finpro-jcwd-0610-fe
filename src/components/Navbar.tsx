'use client'
import { Button } from '@/components/ui/button'
import { MenuList } from '@/features/extra/components/MenuListNavbar'
import { ProfileImage } from '@/features/extra/components/ProfileImageNavbar'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Navbar = () => {
  const { data: session } = useSession()
  const [menuState, setMenuState] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && 'active'} className="fixed z-20 w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5'
          )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Image src="/logo-text.svg" alt="bubblify-logo" height={100} width={100} className="h-8 w-auto lg:h-15" />
              </Link>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <MenuList className="flex gap-8 text-sm" onNavigate={() => setMenuState(false)}/>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <MenuList className="space-y-6 text-base" onNavigate={() => setMenuState(false)}/>
              </div>

              {!!session?.user ? (
                <div className="flex items-center space-x-4">
                  <ProfileImage user={session.user} />
                  <Button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    size="sm"
                    className={cn(isScrolled && 'lg:hidden', 'rounded-full', 'hover:cursor-pointer')}
                    variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className={cn(isScrolled && 'rounded-full bg-secondary text-primary hover:bg-secondary/90 transition')}
                    onClick={() => setMenuState(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className={cn(isScrolled && 'rounded-full bg-primary text-white hover:bg-primary/90 transition')}
                    onClick={() => setMenuState(false)}>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}