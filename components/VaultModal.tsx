
import React, { useState, useEffect, useRef } from 'react';

interface VaultModalProps {
  onClose: () => void;
  onUnlock: () => void;
}

const VaultModal: React.FC<VaultModalProps> = ({ onClose, onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'koontzanopp') {
      setError('');
      onUnlock();
    } else {
      setError('Incorrect password. Try again.');
      setPassword('');
      passwordInputRef.current?.focus();
    }
  };

  useEffect(() => {
    passwordInputRef.current?.focus();
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);


  return (
    <div 
      className="fixed inset-0 z-[60] bg-black bg-opacity-75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vault-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-white border border-neutral-700"
      >
        <h2 id="vault-modal-title" className="text-2xl sm:text-3xl font-bold text-red-400 mb-6 text-center [text-shadow:0_0_6px_rgba(248,113,113,0.6)]">
          Enter The Vault
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vault-password" className="block text-sm font-medium text-neutral-300 mb-1">
              Password
            </label>
            <input
              ref={passwordInputRef}
              type="password"
              id="vault-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
              placeholder="************"
              required
              aria-describedby={error ? "password-error" : undefined}
            />
          </div>
          {error && (
            <p id="password-error" className="text-red-400 text-sm mb-4 text-center animate-pulse" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-neutral-600 hover:bg-neutral-500 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-75"
              aria-label="Cancel and close modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
              aria-label="Unlock The Vault"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaultModal;
