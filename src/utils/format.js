const BYTES_PER_MB = 1024 * 1024;

const toNumber = (value) => Number(value || 0);

export function getStorageUsedMB(record) {
  if (!record) {
    return 0;
  }

  if (record.storage_used_mb !== undefined && record.storage_used_mb !== null) {
    return toNumber(record.storage_used_mb);
  }

  const used = toNumber(record.storage_used);
  const total = toNumber(record.storage_total_mb ?? record.storage_total);

  if ((total > 0 && used > total * 4) || used > BYTES_PER_MB * 2) {
    return used / BYTES_PER_MB;
  }

  return used;
}

export function getStorageTotalMB(record) {
  if (!record) {
    return 0;
  }

  return toNumber(record.storage_total_mb ?? record.storage_total);
}

export function formatMB(value, digits = 2) {
  return `${toNumber(value).toFixed(digits)} MB`;
}

export function formatCurrency(value) {
  return `$${toNumber(value).toFixed(2)}`;
}

export function formatDateTime(value) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleString();
}

export function formatDate(value) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleDateString();
}

export function formatTransactionAmount(value) {
  const amount = toNumber(value);
  const absoluteAmount = Math.abs(amount).toFixed(2);
  return amount < 0 ? `-$${absoluteAmount}` : `$${absoluteAmount}`;
}

