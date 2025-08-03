interface StatusIndicatorProps {
  status: "online" | "away" | "offline";
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusConfig = {
    online: { color: "bg-green-500", text: "Online" },
    away: { color: "bg-yellow-500", text: "Away" },
    offline: { color: "bg-slate-500", text: "Offline" },
  };

  const { color, text } = statusConfig[status] || statusConfig.offline;

  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`}></span>
      <span className="text-sm font-medium text-slate-300">{text}</span>
    </div>
  );
};

export default StatusIndicator;
