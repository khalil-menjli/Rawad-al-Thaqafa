import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  XCircle,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Users,
} from 'lucide-react';
import type { Offer } from '../../types/types';

interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  isOpen,
  onClose,
  offer,
  onEdit,
  onDelete,
}) => {
  const totalEarnings = (offer.reservation ?? 0) * offer.price;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-row gap-10 max-w-7xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Left: Image & Core Info */}
        <div className="w-1/3 bg-gray-50 p-8">
          <div className="rounded-xl overflow-hidden shadow-md mb-8">
            {offer.imageUrl ? (
              <img
                src={offer.imageUrl}
                alt={offer.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                <Calendar className="w-12 h-12" />
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-[#ff6b6b]" />
              <span className="text-xl font-semibold text-[#2e4057]">{offer.location || 'No location'}</span>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-[#ff6b6b]" />
              <span className="text-xl font-semibold text-[#2e4057]">
                {new Date(offer.dateStart).toLocaleDateString()}
                {offer.dateEnd && (
                  <>&nbsp;–&nbsp;{new Date(offer.dateEnd).toLocaleDateString()}</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Tag className="w-6 h-6 text-[#ff6b6b]" />
              <span className="text-xl font-semibold text-[#2e4057]">
                {Array.isArray(offer.categories) ? offer.categories.join(', ') : offer.categories}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <DollarSign className="w-6 h-6 text-[#ff6b6b]" />
              <span className="text-xl font-semibold text-[#2e4057]">{offer.price} €</span>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-[#ff6b6b]" />
              <span className="text-xl font-semibold text-[#2e4057]">Reservations: {offer.reservation ?? 0}</span>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold text-green-600">Total Earn: {totalEarnings} €</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Actions */}
        <div className="w-2/3 p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-[#2e4057] leading-snug">{offer.title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-[#2e4057] mb-4">About this Offer</h3>
              <p className="text-lg text-[#82a0b6] leading-relaxed">
                {offer.description || 'No description provided.'}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-6">
            {onEdit && (
              <Button variant="outline" className="px-10 py-5 text-xl" onClick={() => onEdit(offer)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="primary" className="px-10 py-5 text-xl" onClick={() => onDelete(offer)}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
