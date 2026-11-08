import React from 'react';
import Dialog from './Dialog';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm" hideClose={isLoading}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isDestructive
              ? 'bg-culinary-nonvegBg text-culinary-nonveg'
              : 'bg-terracotta-50 text-terracotta-500'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h4 className="font-display text-lg font-semibold text-charcoal">{title}</h4>
        <p className="text-sm text-charcoal-secondary mt-1.5 leading-relaxed">{description}</p>

        <div className="flex items-center gap-3 w-full mt-6">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

