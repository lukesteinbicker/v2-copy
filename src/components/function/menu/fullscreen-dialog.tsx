//incomplete
import React from "react";

const FullscreenModal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
      <div className="relative w-full h-full bg-white p-4">
        <button className="absolute top-4 right-4 text-black" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default FullscreenModal;
