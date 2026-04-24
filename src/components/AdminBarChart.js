'use client';

export default function AdminBarChart({ data }) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.completed || 0, item.pending || 0, item.rejected || 0])
  );

  const barGroups = [
    { key: 'completed', label: 'Completed', color: 'var(--success)' },
    { key: 'pending', label: 'Pending', color: '#ffa500' },
    { key: 'rejected', label: 'Rejected', color: 'var(--danger)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {barGroups.map((group) => (
          <div key={group.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '999px', backgroundColor: group.color, display: 'inline-block' }} />
            {group.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length || 1}, minmax(80px, 1fr))`, gap: '1rem', alignItems: 'end', minHeight: '260px' }}>
        {data.map((item) => (
          <div key={item.month} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.35rem', height: '200px' }}>
              {barGroups.map((group) => {
                const value = item[group.key] || 0;
                const height = `${Math.max(8, (value / maxValue) * 100)}%`;

                return (
                  <div key={group.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{value}</span>
                    <div
                      title={`${group.label}: ${value}`}
                      style={{
                        width: '100%',
                        height,
                        minHeight: value > 0 ? '8px' : '0px',
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: group.color,
                        opacity: value > 0 ? 1 : 0.2,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600 }}>{item.month}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                ${Number(item.payoutAmount || 0).toFixed(2)} paid
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

