import { createContext, ReactNode, useContext, useState } from "react";

type ToastContextType = {
  message: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const hideToast = () => {
    setMessage(null);
  };

  return (
    <ToastContext.Provider value={{ message, showToast, hideToast }}>
      {children}
      {message && (
        <div
          className="fixed right-6 top-16 z-40 mt-4 transition-all duration-300 ease-in-out"
          style={{
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <div className="bg-white shadow-lg px-6 py-3">
            <p className="text-zinc-900 text-base font-medium">{message}</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
