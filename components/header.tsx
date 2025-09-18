"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { Search, Menu, X, Heart, User } from "lucide-react"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { CurrencySelector } from "@/components/currency-selector"
import { useFavorites } from "@/lib/favorites-store"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getFavoritesCount } = useFavorites()
  const favoritesCount = getFavoritesCount()

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ backgroundColor: "rgba(127, 92, 126, 0.1)" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <span
              className="text-6xl font-black bg-gradient-to-r from-[#7f5c7e] to-purple-700 bg-clip-text text-transparent font-cinzel-decorative tracking-wider drop-shadow-lg hover:scale-105 transition-transform duration-200 active:scale-95"
              style={{
                textShadow: "3px 3px 6px rgba(127, 92, 126, 0.4)",
                fontFamily: "var(--font-cinzel-decorative)",
              }}
            >
              TOLAY
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <SearchBar />
          </div>

          {/* Navigation links (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              الصفحة الرئيسية
            </Link>
            <Link
              href="/about"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              من نحن
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              تواصل معنا
            </a>
            <Link
              href="/login"
              className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
            >
              تسجيل الدخول
            </Link>
          </nav>

          {/* ===== Actions (desktop + mobile) ===== */}
          <div className="flex items-center space-x-4">
            <CurrencySelector />

            {/* أيقونة البحث (تظهر فقط في الكمبيوتر) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:scale-110 active:scale-95 transition-transform"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* المفضلة */}
            <Link href="/account?tab=favorites">
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 active:scale-95 transition-transform relative"
              >
                <Heart className={`h-5 w-5 ${favoritesCount > 0 ? "fill-[#7f5c7e] text-[#7f5c7e]" : ""}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7f5c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* المستخدم */}
            <Link href="/account">
              <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-95 transition-transform">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* السلة (مرئية دائمًا) */}
            <CartDrawer />

            {/* زر القائمة الجانبية (ثلاث نقاط) مرئي على الهاتف دائمًا */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:scale-110 active:scale-95 transition-transform"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* قائمة الجوال */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4" style={{ backgroundColor: "rgba(127, 92, 126, 0.05)" }}>
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/about"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                من نحن
              </Link>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                تواصل معنا
              </a>
              <Link
                href="/login"
                className="text-lg font-bold text-foreground hover:text-[#7f5c7e] transition-colors font-tajawal hover:scale-105 active:scale-95"
              >
                تسجيل الدخول
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
