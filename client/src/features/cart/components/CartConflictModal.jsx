import React from 'react';
import { Dialog, Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export default function CartConflictModal({
  isOpen,
  onClose,
  currentRestaurantName,
  newRestaurantName,
  onConfirmReplace,
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Replace Items in Basket?"
      size="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Your basket contains culinary items from <strong>"{currentRestaurantName || 'another restaurant'}"</strong>.
            A single order can only include items from one kitchen. Do you want to discard your current basket and start a fresh order from <strong>"{newRestaurantName || 'this restaurant'}"</strong>?
          </p>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Keep Existing Basket
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-culinary-nonveg hover:bg-culinary-nonveg/90 text-white"
            onClick={onConfirmReplace}
          >
            Discard & Start New
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

