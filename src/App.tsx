import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Ebook from "@/pages/Ebook";
import Eaudio from "@/pages/Eaudio";
import Social from "@/pages/Social";
import FuturePrompts from "@/pages/FuturePrompts";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Payment from "@/pages/Payment";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import BookDetail from "@/pages/BookDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ImageUpload from "@/pages/ImageUpload";
import NotFound from "@/pages/NotFound";
import AdminRoute from "@/components/AdminRoute";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BooksManagement from "@/pages/admin/BooksManagement";
import AudioManagement from "@/pages/admin/AudioManagement";
import AnimatedSeriesManagement from "@/pages/admin/AnimatedSeriesManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CustomersManagement from "@/pages/admin/CustomersManagement";
import InventoryManagement from "@/pages/admin/InventoryManagement";
import Analytics from "@/pages/admin/Analytics";
import Settings from "@/pages/admin/Settings";
import Foundation from "@/pages/Foundation";
import EItems from "@/pages/EItems";
import Travel from "@/pages/Travel";
import MyOrders from "@/pages/MyOrders";
import MyAddresses from "@/pages/MyAddresses";
import MyPaymentMethods from "@/pages/MyPaymentMethods";
import EItemsManagement from "@/pages/admin/EItemsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Foundation Page - Public Home */}
                <Route path="/" element={
                  <Layout>
                    <Foundation />
                  </Layout>
                } />
                <Route path="/foundation" element={
                  <Layout>
                    <Foundation />
                  </Layout>
                } />

                {/* Protected routes with layout */}
                <Route path="/old-home" element={
                  <Layout>
                    <Home />
                  </Layout>
                } />
                <Route path="/ebook" element={
                  <Layout>
                    <Ebook />
                  </Layout>
                } />
                <Route path="/eaudio" element={
                  <Layout>
                    <Eaudio />
                  </Layout>
                } />
                <Route path="/e-items" element={
                  <Layout>
                    <EItems />
                  </Layout>
                } />
                <Route path="/travel" element={
                  <Layout>
                    <Travel />
                  </Layout>
                } />
                <Route path="/social" element={
                  <Layout>
                    <Social />
                  </Layout>
                } />
                <Route path="/future-prompts" element={
                  <Layout>
                    <FuturePrompts />
                  </Layout>
                } />
                <Route path="/book/:id" element={
                  <Layout>
                    <BookDetail />
                  </Layout>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Layout>
                      <Cart />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Layout>
                      <Checkout />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/checkout/payment" element={
                  <ProtectedRoute>
                    <Layout>
                      <Payment />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/payment" element={
                  <ProtectedRoute>
                    <Layout>
                      <Payment />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/my-orders" element={
                  <ProtectedRoute>
                    <Layout>
                      <MyOrders />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/my-addresses" element={
                  <ProtectedRoute>
                    <Layout>
                      <MyAddresses />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/payment-methods" element={
                  <ProtectedRoute>
                    <Layout>
                      <MyPaymentMethods />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/profile/edit" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfileEdit />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <Layout>
                      <ImageUpload />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Foundation Page */}
                <Route path="/foundation" element={
                  <ProtectedRoute>
                    <Layout>
                      <Foundation />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="books" element={<BooksManagement />} />
                  <Route path="audio" element={<AudioManagement />} />
                  <Route path="animated-series" element={<AnimatedSeriesManagement />} />
                  <Route path="orders" element={<OrdersManagement />} />
                  <Route path="customers" element={<CustomersManagement />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;