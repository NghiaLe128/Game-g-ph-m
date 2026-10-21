import React, { useState } from 'react';
import { User, Check, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NameEditModalProps {
  isOpen: boolean;
  currentName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

export const NameEditModal: React.FC<NameEditModalProps> = ({
  isOpen,
  currentName,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim().slice(0, 16);
    if (clean) {
      sounds.playClick();
      onSave(clean);
    }
  };

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-sky-200 text-center">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mx-auto mb-3">
          <User className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-sky-950 mb-2">
          Biệt danh của bé
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Nhập tên để lưu điểm vào Bảng vàng nhé!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Bé Bông, Bo, Minh..."
            maxLength={16}
            autoFocus
            className="w-full text-center text-lg font-bold px-4 py-3 rounded-2xl border-2 border-sky-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50 outline-hidden bg-sky-50/50 text-slate-800"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-5 h-5" />
              Lưu Tên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
