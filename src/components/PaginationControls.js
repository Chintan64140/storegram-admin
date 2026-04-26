'use client';
import { useState, useEffect } from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-react';

export default function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 15, 20, 25, 50, 100],
}) {
  const [inputPage, setInputPage] = useState('');

  useEffect(() => {
    if (pagination) {
      setInputPage(pagination.page.toString());
    }
  }, [pagination]);

  if (!pagination) {
    return null;
  }

  const { page, limit, totalItems, totalPages, hasPrevPage, hasNextPage } = pagination;
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const handlePageSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      let p = parseInt(inputPage, 10);
      if (isNaN(p) || p < 1) p = 1;
      if (p > totalPages) p = totalPages;
      setInputPage(p.toString());
      if (p !== page) onPageChange?.(p);
    }
  };

  const btnStyle = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: 'transparent',
    border: 'none',
    color: active ? 'var(--accent-blue, #007bff)' : 'var(--muted, #6c757d)',
    opacity: active ? 1 : 0.5,
    cursor: active ? 'pointer' : 'not-allowed',
    padding: '0.25rem',
    fontSize: '0.9rem'
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', color: 'var(--muted)', fontSize: '0.9rem' }}>
      
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span>Items per page</span>
        <select 
          value={limit} 
          onChange={(event) => onLimitChange?.(Number(event.target.value))}
          style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--border, #ccc)', borderRadius: '4px', background: 'var(--surface, #fff)', color: 'var(--foreground)' }}
        >
          {limitOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>{startItem}–{endItem} of {totalItems} items</span>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={!hasPrevPage}
          style={btnStyle(hasPrevPage)}
          title="First page"
        >
          <ChevronFirst size={18} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={!hasPrevPage}
          style={btnStyle(hasPrevPage)}
        >
          <ChevronLeft size={18} /> Previous
        </button>

        <input
          type="text"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={handlePageSubmit}
          onBlur={handlePageSubmit}
          style={{ width: '40px', textAlign: 'center', padding: '0.25rem', border: '1px solid var(--border, #ccc)', borderRadius: '4px', background: 'var(--surface, #fff)', color: 'var(--foreground)' }}
        />
        <span style={{ margin: '0 0.5rem' }}>of {totalPages}</span>

        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={!hasNextPage}
          style={btnStyle(hasNextPage)}
        >
          Next <ChevronRight size={18} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange?.(totalPages)}
          disabled={!hasNextPage}
          style={btnStyle(hasNextPage)}
          title="Last page"
        >
          <ChevronLast size={18} />
        </button>
      </div>
    </div>
  );
}

