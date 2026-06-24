interface HorizontalBarChartProps {
    data: Record<string, number>;
    formatLabel?: (key: string) => string;
}

const BAR_COLORS = [
    '#DC2626', // primary-600
    '#2563EB', // blue-600
    '#16A34A', // green-600
    '#D97706', // amber-600
    '#7C3AED', // violet-600
    '#DB2777', // pink-600
    '#0D9488', // teal-600
];

export function HorizontalBarChart({
    data,
    formatLabel = (key) => key.replace(/_/g, ' '),
}: HorizontalBarChartProps) {
    const entries = Object.entries(data).filter(([, value]) => value > 0);
    const max = Math.max(...entries.map(([, value]) => value), 1);

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Nenhum dado disponível</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {entries.map(([key, value], index) => {
                const pct = Math.round((value / max) * 100);
                const barColor = BAR_COLORS[index % BAR_COLORS.length];

                return (
                    <div key={key}>
                        <div className="flex justify-between items-center mb-1.5 gap-3" style={{ fontSize: '0.875rem' }}>
                            <span className="capitalize truncate" style={{ color: '#4B5563' }}>
                                {formatLabel(key)}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                                <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{pct}%</span>
                                <span style={{ color: '#111827', fontWeight: 600 }}>{value}</span>
                            </div>
                        </div>
                        <div
                            className="rounded-full overflow-hidden"
                            style={{ height: '8px', backgroundColor: '#F3F4F6' }}
                        >
                            <div
                                className="rounded-full"
                                style={{
                                    height: '100%',
                                    width: `${pct}%`,
                                    backgroundColor: barColor,
                                    minWidth: pct > 0 ? '4px' : '0',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
