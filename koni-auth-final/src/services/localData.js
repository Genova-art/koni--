import { beritaData } from "../data/constants";

const NEWS_KEY = "koniNewsItems";
const MESSAGES_KEY = "koniContactMessages";
const DOCUMENTS_KEY = "koniMemberDocuments";

export function getStoredNews() {
  try {
    const saved = JSON.parse(localStorage.getItem(NEWS_KEY) || "null");
    return Array.isArray(saved) && saved.length ? saved : beritaData;
  } catch {
    return beritaData;
  }
}

export function saveStoredNews(news) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(news));
  window.dispatchEvent(new Event("koni-news-updated"));
}

export function getStoredMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveStoredMessages(messages) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  window.dispatchEvent(new Event("koni-messages-updated"));
}

export function getStoredDocuments() {
  try {
    const saved = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveStoredDocuments(documents) {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
  window.dispatchEvent(new Event("koni-documents-updated"));
}

export function exportToCsv(filename, rows) {
  if (!rows.length) return false;

  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
