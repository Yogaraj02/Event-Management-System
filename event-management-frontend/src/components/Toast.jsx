import { useToast } from "../hooks/useToast";

const Toast = () => {
  const { toast, hideToast } = useToast();

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={hideToast}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
