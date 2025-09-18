"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Package,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Settings,
  Palette,
  Upload,
} from "lucide-react"
import { useProducts, type Product } from "@/lib/products-store"

export default function AdminDashboard() {
  const {
    state: { products, categories },
    dispatch,
  } = useProducts()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    description: "",
    rating: 5,
    reviews: 0,
    isNew: true,
    isSale: false,
  })

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "متجر الإكسسوارات الأنيقة",
    logo: "",
    primaryColor: "#8b5cf6",
    whatsappNumber: "+966501234567",
  })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        image: newProduct.image || "/placeholder.svg",
        category: newProduct.category,
        rating: newProduct.rating || 5,
        reviews: newProduct.reviews || 0,
        isNew: newProduct.isNew || false,
        isSale: newProduct.isSale || false,
        stock: newProduct.stock || 0,
        description: newProduct.description || "",
        colors: newProduct.colors || [],
        sizes: newProduct.sizes || [],
      }
      dispatch({ type: "ADD_PRODUCT", payload: product })
      setNewProduct({
        name: "",
        price: 0,
        category: "",
        stock: 0,
        description: "",
        rating: 5,
        reviews: 0,
        isNew: true,
        isSale: false,
      })
      setIsAddingProduct(false)
    }
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      dispatch({ type: "UPDATE_PRODUCT", payload: editingProduct })
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: number) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id })
  }

  const handleUpdateStock = (id: number, stock: number) => {
    dispatch({ type: "UPDATE_STOCK", payload: { id, stock } })
  }

  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock <= 5).length
  const outOfStockProducts = products.filter((p) => p.stock === 0).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">لوحة التحكم</h1>
          <p className="text-lg text-muted-foreground">إدارة شاملة لمتجرك</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">منتج متاح</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">كمية قليلة</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{lowStockProducts}</div>
                  <p className="text-xs text-muted-foreground">منتج يحتاج تجديد</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">نفدت الكمية</CardTitle>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{outOfStockProducts}</div>
                  <p className="text-xs text-muted-foreground">منتج غير متاح</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">قيمة المخزون</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{totalValue.toLocaleString()} ر.س</div>
                  <p className="text-xs text-muted-foreground">إجمالي قيمة المخزون</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>المنتجات التي تحتاج انتباه</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .filter((p) => p.stock <= 5)
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                            {product.stock === 0 ? "نفدت الكمية" : `${product.stock} قطعة`}
                          </Badge>
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => handleUpdateStock(product.id, Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة منتج جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة منتج جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المنتج</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">الفئة</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">الكمية</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">رابط الصورة</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">السعر الأصلي (اختياري)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={newProduct.originalPrice || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            originalPrice: Number.parseFloat(e.target.value) || undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddProduct}>إضافة المنتج</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-primary">{product.price} ر.س</span>
                      <Badge variant={product.stock <= 5 ? "destructive" : "secondary"}>{product.stock} قطعة</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                            className="flex-1"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>تعديل المنتج</DialogTitle>
                          </DialogHeader>
                          {editingProduct && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">اسم المنتج</Label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">السعر</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-stock">الكمية</Label>
                                <Input
                                  id="edit-stock"
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      stock: Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">الفئة</Label>
                                <Select
                                  value={editingProduct.category}
                                  onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2 space-y-2">
                                <Label htmlFor="edit-description">الوصف</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingProduct.description}
                                  onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, description: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setEditingProduct(null)}>
                              إلغاء
                            </Button>
                            <Button onClick={handleUpdateProduct}>حفظ التغييرات</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <h2 className="text-2xl font-bold">إدارة المخزون</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-sm font-medium">{product.price} ر.س</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={product.stock <= 5 ? (product.stock === 0 ? "destructive" : "secondary") : "outline"}
                        >
                          {product.stock === 0 ? "نفدت الكمية" : product.stock <= 5 ? "كمية قليلة" : "متوفر"}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`stock-${product.id}`} className="text-sm">
                            الكمية:
                          </Label>
                          <Input
                            id={`stock-${product.id}`}
                            type="number"
                            value={product.stock}
                            onChange={(e) => handleUpdateStock(product.id, Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد طلبات حالياً</h3>
                  <p className="text-muted-foreground">ستظهر الطلبات الواردة عبر الواتساب هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">إعدادات المتجر</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    الإعدادات العامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">اسم المتجر</Label>
                    <Input
                      id="store-name"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">رقم الواتساب</Label>
                    <Input
                      id="whatsapp"
                      value={storeSettings.whatsappNumber}
                      onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">رابط الشعار</Label>
                    <Input
                      id="logo"
                      value={storeSettings.logo}
                      onChange={(e) => setStoreSettings({ ...storeSettings, logo: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    تخصيص الألوان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">اللون الأساسي</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={storeSettings.primaryColor}
                        onChange={(e) => setStoreSettings({ ...storeSettings, primaryColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={storeSettings.primaryColor}
                        onChange={(e) => setStoreSettings({ ...storeSettings, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    حفظ الإعدادات
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
