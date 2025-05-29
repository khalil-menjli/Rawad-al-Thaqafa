// src/components/ui/Modal.tsx
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  export const Modal = ({ isOpen, onClose, children }: ModalProps) => (
    isOpen ? (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          {children}
          <button onClick={onClose} className="mt-4 text-gray-500 place-self-center hover:text-gray-700">
            Close
          </button>
        </div>
      </div>
    ) : null
  );