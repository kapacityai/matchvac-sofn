import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { PRODUCTS } from '../../data/mockData'
import { ShoppingCart, Star, Plus, Check, Wrench, X, CheckCircle, Shield, ArrowRight } from 'lucide-react'

const CATEGORIES = ['All', 'Thermostats', 'Air Filters', 'Furnaces', 'Water Heaters']

export default function Store() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [addedId, setAddedId] = useState(null)

  const filtered = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory)

  const addToCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id)
      if (existing) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { ...product, qty: 1, installation: false }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="HVAC Store" subtitle="Products delivered to your door" />

      <div className="flex-1 p-6 space-y-5">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === c ? 'bg-brand-500 text-surface-900' : 'bg-surface-150 text-surface-400 hover:text-white border border-surface-200'}`}
            >
              {c}
            </button>
          ))}
          {cartCount > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              className="ml-auto flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-brand-500 text-surface-900"
            >
              <ShoppingCart size={16} />
              {cartCount} · ${total.toFixed(2)}
            </button>
          )}
        </div>

        {/* ── Comfort Connect — ALWAYS #1 Featured Financing Partner ── */}
        <div
          onClick={() => navigate('/comfort-connect')}
          className="cursor-pointer rounded-2xl border-2 border-[#003478] bg-gradient-to-r from-[#003478]/40 to-[#001a3d]/60 overflow-hidden hover:border-[#4da6ff] transition-all group"
        >
          {/* Header bar */}
          <div className="bg-[#003478] px-5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* CC Logo inline */}
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L4 16v20h10V24h12v12h10V16L20 4z" fill="white" opacity="0.9"/>
                </svg>
                <span className="text-white font-bold text-sm tracking-wide">Comfort Connect</span>
              </div>
              <span className="badge bg-[#4da6ff]/30 text-[#4da6ff] border-0 text-xs font-bold px-2 py-0.5 rounded-full">Premier Program®</span>
            </div>
            <span className="text-[#4da6ff] text-xs font-semibold uppercase tracking-wider">#1 Recommended Financing Partner</span>
          </div>

          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-white font-extrabold text-lg mb-1">
                Don't Buy — Get It All Included for One Low Monthly Payment
              </h3>
              <p className="text-surface-300 text-sm mb-3">
                Equipment + installation + all repairs + maintenance + consumable parts. No up-front cost. No hidden fees.
              </p>
              <div className="flex flex-wrap gap-2">
                {['No Up-Front Cost', 'Repairs Included', '24/7 Priority Service', 'Transferable'].map(b => (
                  <div key={b} className="flex items-center gap-1 text-xs text-[#4da6ff] font-medium">
                    <CheckCircle size={11} /> {b}
                  </div>
                ))}
              </div>
            </div>
            <button className="flex-shrink-0 bg-[#003478] group-hover:bg-[#00449e] border border-[#4da6ff]/40 text-surface-900 font-bold py-3 px-5 rounded-xl transition-all flex items-center gap-2 text-sm whitespace-nowrap">
              See If I Qualify <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Air Filter Subscription — secondary banner */}
        <div className="card bg-gradient-to-r from-brand-900/30 to-accent-900/30 border-brand-500/20 flex items-center gap-4 py-4">
          <div className="text-4xl">🌬️</div>
          <div>
            <p className="text-white font-bold">Air Filter Subscription</p>
            <p className="text-surface-400 text-sm">Auto-delivery every 3 months. Save 20%.</p>
          </div>
          <button className="btn-primary ml-auto text-sm py-2 flex-shrink-0">Subscribe</button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="card-hover flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{product.image}</div>
                <div className="flex-1 min-w-0">
                  {product.badge && <span className="badge badge-blue mb-1">{product.badge}</span>}
                  <p className="text-white font-semibold text-sm leading-tight">{product.name}</p>
                  <p className="text-surface-400 text-xs mt-0.5 leading-relaxed">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({length: 5}).map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                ))}
                <span className="text-surface-500 text-xs ml-1">({product.reviews.toLocaleString()})</span>
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold text-lg">${product.price}</span>
                  <span className="text-surface-500 text-xs">+ shipping</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${addedId === product.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500 hover:bg-brand-600 text-surface-900'}`}
                  >
                    {addedId === product.id ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add to Cart</>}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-surface-400 hover:text-white border border-surface-200 hover:border-brand-500/30 transition-all">
                    <Wrench size={13} /> + Add Installation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white border-l border-surface-200 flex flex-col h-full overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-surface-200">
              <h3 className="text-white font-bold text-lg">Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/[15%] transition-colors">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="flex-1 p-5 space-y-3 overflow-auto">
              {cart.map(item => (
                <div key={item.id} className="card flex items-center gap-3">
                  <div className="text-2xl">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-brand-400 text-sm font-bold">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCart(c => c.map(i => i.id === item.id && i.qty > 1 ? {...i, qty: i.qty - 1} : i).filter(i => i.qty > 0))} className="w-6 h-6 rounded-lg bg-white/10 text-surface-900 text-sm flex items-center justify-center">-</button>
                    <span className="text-white text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-lg bg-white/10 text-surface-900 text-sm flex items-center justify-center">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-surface-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-surface-400">Subtotal</span>
                <span className="text-white font-bold">${total.toFixed(2)}</span>
              </div>
              <button className="btn-primary w-full">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
