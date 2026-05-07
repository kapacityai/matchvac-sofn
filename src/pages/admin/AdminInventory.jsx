import React, { useState } from 'react'
import Header from '../../components/Header'
import { PRODUCTS } from '../../data/mockData'
import { Plus, Edit2, Trash2, Package, X } from 'lucide-react'

export default function AdminInventory() {
  const [products, setProducts] = useState(PRODUCTS.map(p => ({ ...p, stock: Math.floor(Math.random() * 50) + 5 })))
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Inventory" subtitle="Product catalog & stock management" />

      <div className="flex-1 p-6 max-w-5xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title">Products ({products.length})</h3>
            <p className="section-sub">Manage the merchant store catalog</p>
          </div>
          <button onClick={() => { setEditProduct(null); setShowModal(true) }} className="btn-primary text-sm">
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-surface-400 font-medium">Product</th>
                <th className="text-left px-5 py-3 text-surface-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Price</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Stock</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={`${i < products.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/3 transition-colors`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.image}</span>
                      <div>
                        <p className="text-white font-medium leading-tight">{p.name}</p>
                        {p.badge && <span className="badge badge-blue">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-surface-400 hidden md:table-cell">{p.category}</td>
                  <td className="px-5 py-3 text-right text-white font-semibold">${p.price}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-semibold ${p.stock < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditProduct(p); setShowModal(true) }} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Edit2 size={13} className="text-brand-400" />
                      </button>
                      <button onClick={() => setProducts(pr => pr.filter(x => x.id !== p.id))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-rose-500/20 transition-colors">
                        <Trash2 size={13} className="text-rose-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <div><label className="label">Product Name</label><input className="input" defaultValue={editProduct?.name} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Price ($)</label><input className="input" type="number" defaultValue={editProduct?.price} /></div>
                <div><label className="label">Stock</label><input className="input" type="number" defaultValue={editProduct?.stock} /></div>
              </div>
              <div><label className="label">Category</label>
                <select className="input">
                  {['Thermostats','Air Filters','Furnaces','Water Heaters'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => setShowModal(false)} className="btn-primary flex-1">Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
