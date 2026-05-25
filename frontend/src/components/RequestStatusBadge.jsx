const STATUS_STYLES = {
  Pending: { backgroundColor: "#fef3c7", color: "#92400e" },
  Approved: { backgroundColor: "#dbeafe", color: "#1e40af" },
  Rejected: { backgroundColor: "#fee2e2", color: "#991b1b" },
  Completed: { backgroundColor: "#dcfce7", color: "#166534" },
};

function RequestStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  };

  return (
    <span
      style={{
        ...style,
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

export default RequestStatusBadge;
