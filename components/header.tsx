"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Phone, Mail, Menu, X, Home, Building, Users, FileText, MessageCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    { name: "Inicio", href: "#inicio", icon: Home },
    { name: "Nosotros", href: "#nosotros", icon: Users },
    { name: "Propiedades", href: "/propiedades", icon: Building, external: true },
    { name: "Contacto", href: "#contacto", icon: MessageCircle },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/propiedades?busqueda=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push(`/${href}`)
        setIsMenuOpen(false)
      } else {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNav('#inicio')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none"
            style={{ minHeight: 64 }}
          >
            <Image src="/logo.svg" alt="Morales Propiedades" width={60} height={60} priority />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              item.external ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </button>
              )
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar propiedades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="tel:+5491123456789" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Llamar</span>
              </a>
            </Button>
            <Button size="sm" onClick={() => handleNav('#contacto')} className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>Contacto</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                item.external ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNav(item.href)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors text-left w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                )
              ))}
              
              <div className="px-4 py-2">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Buscar propiedades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div className="px-4 py-2 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <a href="tel:+5491123456789" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Llamar</span>
                  </a>
                </Button>
                <Button size="sm" className="w-full justify-start" onClick={() => handleNav('#contacto')}>
                  <MessageCircle className="h-4 w-4" />
                  <span>Contacto</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 