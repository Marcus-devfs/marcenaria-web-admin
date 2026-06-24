interface HorizontalBarChartProps {
    data: Record<string, number>;
    formatLabel?: (key: string) => string;
    colorClass?: string;
}

export function HorizontalBarChart({
    data,
    formatLabel = (key) => key.replace(/_/g, ' '),
    colorClass = 'bg-primary-500',
}: HorizontalBarChartProps) {
    const entries = Object.entries(data);
    const max = Math.max(...entries.map(([, value]) => value), 1);

    if (entries.length === 0) {
        return <p className="text-center text-gray-400 py-4 text-sm">Nenhum dado disponível</p>;
    }

    return (
        <div className="space-y-4">
            {entries.map(([key, value]) => (
                <div key={key}>
                    <div className="flex justify-between items-center text-sm mb-1.5">
                        <span className="text-gray-600 capitalize">{formatLabel(key)}</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${colorClass}`}
                            style={{ width: `${(value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
