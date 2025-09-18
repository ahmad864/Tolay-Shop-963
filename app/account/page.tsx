"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Heart, ShoppingBag, Settings } from "lucide-react"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { favorites, getFavoritesCount } = useFavorites()
  const {
    state: { products },
  } = useProducts()

  // Get favorite products
  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#7f5c7e]">حسابي</CardTitle>
              <p className="text-muted-foreground">سجل دخولك أو أنشئ حساب جديد</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full border-[#7f5c7e] text-[#7f5c7e] hover:bg-[#7f5c7e] hover:text-white bg-transparent hover:scale-105 active:scale-95 transition-all"
                >
                  إنشاء حساب جديد
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7f5c7e] mb-2">حسابي</h1>
          <p className="text-muted-foreground">إدارة معلوماتك الشخصية وطلباتك</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="hover:scale-105 active:scale-95 transition-transform">
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="orders" className="hover:scale-105 active:scale-95 transition-transform">
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="hover:scale-105 active:scale-95 transition-transform">
              المفضلة ({getFavoritesCount()})
            </TabsTrigger>
            <TabsTrigger value="settings" className="hover:scale-105 active:scale-95 transition-transform">
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">الاسم الأول</Label>
                    <Input id="firstName" placeholder="أدخل اسمك الأول" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">الاسم الأخير</Label>
                    <Input id="lastName" placeholder="أدخل اسمك الأخير" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="+963 xxx xxx xxx" />
                </div>
                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Input id="address" placeholder="أدخل عنوانك" />
                </div>
                <Button className="bg-[#7f5c7e] text-white hover:bg-purple-600">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  طلباتي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد طلبات حتى الآن</p>
                  <Link href="/products">
                    <Button className="mt-4 bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all">
                      تسوق الآن
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  المنتجات المفضلة ({getFavoritesCount()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteProducts.map((product) => (
                      <Card key={product.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                          <p className="text-[#7f5c7e] font-bold">{product.price} ر.س</p>
                          <Link href={`/product/${product.id}`}>
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-[#7f5c7e] hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all"
                            >
                              عرض المنتج
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد منتجات مفضلة حتى الآن</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all">
                        استكشف المنتجات
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  إعدادات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-[#7f5c7e] text-white hover:bg-purple-600">تحديث كلمة المرور</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
