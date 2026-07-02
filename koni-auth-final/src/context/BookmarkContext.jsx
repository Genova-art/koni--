import { createContext, useContext, useState, useEffect } from "react";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-bookmarks") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("koni-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggle = (item) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id);
      if (exists) return prev.filter(b => b.id !== item.id);
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);
  const clear = () => setBookmarks([]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggle, isBookmarked, clear }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmark = () => useContext(BookmarkContext);
