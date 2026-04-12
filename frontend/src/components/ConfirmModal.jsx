import "../styles/modal.css";
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>

          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;