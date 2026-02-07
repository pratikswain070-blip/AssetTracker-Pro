
import React, { useState, useEffect } from 'react';
import { AssetRecord, EntryType } from '../types';

interface AssetFormProps {
  onSubmit: (asset: Omit<AssetRecord, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: AssetRecord;
  isOwner?: boolean;
}

export const AssetForm: React.FC<AssetFormProps> = ({ onSubmit, onCancel, initialData, isOwner }) => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1,
    units: '',
    address: '',
    entryType: EntryType.INWARD,
    handledBy: '',
    remarks: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName,
        quantity: initialData.quantity,
        units: initialData.units,
        address: initialData.address,
        entryType: initialData.entryType,
        handledBy: initialData.handledBy,
        remarks: initialData.remarks
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
          <input
            required
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. MacBook Pro M3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Entry Type</label>
          <select
            name="entryType"
            value={formData.entryType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          >
            <option value={EntryType.INWARD}>Inward (Receiving)</option>
            <option value={EntryType.OUTWARD}>Outward (Releasing)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
            <input
              required
              type="number"
              name="quantity"
              min="0.01"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Units</label>
            <input
              required
              type="text"
              name="units"
              value={formData.units}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. kg, pcs"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Location / Address</label>
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Warehouse 2, Aisle 4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Handled By</label>
          <input
            required
            type="text"
            name="handledBy"
            value={formData.handledBy}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Staff Name"
          />
        </div>

        {isOwner && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              Remarks
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold">Owner Only</span>
            </label>
            <textarea
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-amber-200 bg-amber-50/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              placeholder="Any sensitive additional details..."
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
        >
          {initialData ? 'Update Record' : 'Save Record'}
        </button>
      </div>
    </form>
  );
};
