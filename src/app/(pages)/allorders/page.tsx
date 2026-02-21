"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getUserOrdersAction } from '@/actions/getUserOrders.action'
import { Loader2, Package, Calendar, CreditCard, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AllOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (session?.user && (session.user as any).id) {
        setLoading(true)
        try {
          const res = await getUserOrdersAction((session.user as any).id)
          setOrders(res || [])
        } catch (error) {
          console.error("Failed to fetch orders:", error)
        } finally {
          setLoading(false)
        }
      } else if (session?.user) {
         // Some APIs use user.id or user._id, or it might be embedded differently
         // For now, let's assume if we can't find ID we might need to wait or it's an error
         setLoading(false)
      }
    }
    fetchOrders()
  }, [session])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="text-gray-500 font-medium tracking-wide">Loading your order history...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="bg-gray-50 rounded-3xl p-12 max-w-lg mx-auto border border-dashed border-gray-200">
            <Package className="size-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Please login to view orders</h1>
            <p className="text-gray-500 mb-8">You need to be authenticated to see your past purchases.</p>
            <Link href="/login">
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                    Login Now
                </button>
            </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Order History</h1>
        <p className="text-gray-500 text-lg">Check the status of recent orders, manage returns, and discover similar products.</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-gray-50/50 p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Placed</p>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="size-4" />
                      <span className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <CreditCard className="size-4" />
                      <span className="font-bold text-lg">{order.totalOrderPrice} EGP</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                        order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">#{order._id.slice(-8)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {order.cartItems.map((item: any) => (
                    <div key={item._id} className="flex items-center gap-6 group">
                      <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{item.product.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">Quantity: {item.count} • Unit Price: {item.price} EGP</p>
                        <div className="flex items-center gap-4 mt-3">
                            <button className="text-primary text-xs font-bold hover:underline">View Product</button>
                            <span className="text-gray-200">|</span>
                            <button className="text-gray-500 text-xs font-bold hover:underline">Buy it again</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50/30 p-4 border-t border-gray-50 flex justify-end">
                  <button className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                      Order Details
                      <ChevronRight className="size-4" />
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <Package className="size-20 text-gray-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">It looks like you haven&apos;t placed any orders yet. Start shopping to fill this space!</p>
          <Link href="/products">
            <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2 mx-auto">
                Explore Products
                <ChevronRight className="size-5" />
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
