"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { Search, Menu, X, Heart, User } from "lucide-react"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { CurrencySelector } from "@/components/currency-selector"
import { useFavorites } from "@/lib/favorites-store"

// ⚠️ أزلنا استيراد next-auth
// import { useSession, signOut } from "next-auth/react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getFavoritesCount } = useFavorites()
  const favoritesCount = getFavoritesCount()

  // لا يوجد منطق جلسة الآن
  const isLoggedIn = false

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
            style={{ backgroundColor: "rgba(127, 92, 126, 0.1)" }}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer max-w-[48%] md:max-w-none">
            <span className="block truncate text-3xl md:text-6xl font-black bg-gradient-to-r from-[#7f5c7e] to-purple-700 bg-clip-text text-transparent font-cinzel-decorative tracking-wider drop-shadow-lg hover:scale-105 transition-transform duration-200 active:scale-95"
                  style={{ textShadow: "3px 3px 6px rgba(127, 92, 126, 0.4)" }}>
              TOLAY
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <SearchBar />
          </div>

          {/* Navigation links (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">الصفحة الرئيسية</Link>
            <Link href="/about" className="nav-link">من نحن</Link>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-link">تواصل معنا</a>

            {/* زر تسجيل الدخول ثابت حالياً */}
            <Link href="/login" className="nav-link">تسجيل الدخول</Link>
          </nav>

          {/* ===== Actions ===== */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <CurrencySelector />

            <Button variant="ghost" size="icon" className="hidden md:flex hover:scale-110 active:scale-95 transition-transform shrink-0">
              <Search className="h-5 w-5" />
            </Button>

            {/* Favorites */}
            <Link href="/account?tab=favorites" className="shrink-0">
              <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-95 transition-transform relative">
                <Heart className={`h-5 w-5 ${favoritesCount > 0 ? "fill-[#7f5c7e] text-[#7f5c7e]" : ""}`} />
                {favoritesCount > 0 && (
                  <span className="badge">{favoritesCount}</span>
                )}
              </Button>
            </Link>

            {/* User icon معطل حالياً */}
            {isLoggedIn && (
              <Link href="/account" className="shrink-0">
                <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-95 transition-transform">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <div className="shrink-0">
              <CartDrawer />
            </div>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:scale-110 active:scale-95 transition-transform shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu content */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4" style={{ backgroundColor: "rgba(127, 92, 126, 0.05)" }}>
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="nav-link">الصفحة الرئيسية</Link>
              <Link href="/about" className="nav-link">من نحن</Link>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-link">تواصل معنا</a>
              <Link href="/login" className="nav-link">تسجيل الدخول</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
