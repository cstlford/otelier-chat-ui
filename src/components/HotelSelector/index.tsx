import styles from "./HotelSelector.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Hotel as HotelIcon, Search } from "lucide-react";
import Button from "../Button";
import { useHotels } from "../../context/HotelContext";

export default function HotelSelector() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [query, setQuery] = useState("");

  const {
    state: { hotels, selectedHotels },
    dispatch,
  } = useHotels();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hotels;
    return hotels.filter((h) => h.name.toLowerCase().includes(q));
  }, [hotels, query]);

  const allSelected = selectedHotels.length === hotels.length;
  const hasSelection = selectedHotels.length > 0;

  // click outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // open -> focus input
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const toggleHotels = (hotel: any) => {
    dispatch({ type: "TOGGLE_HOTEL", payload: hotel });
  };

  const handleSelectAll = () => {
    dispatch({ type: "SELECT_ALL_HOTELS" });
  };

  const handleToggle = () => {
    if (open) {
      setIsClosing(true);

      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 150);
    } else {
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={styles.selector}>
      <Button
        type="button"
        variant="neutral"
        onClick={handleToggle}
        size="sm"
        aria-label="Toggle hotel selector"
      >
        <HotelIcon size={16} />
      </Button>
      {open && (
        <div className={`${styles.popup} ${isClosing ? styles.closing : ""}`}>
          <div className={styles.top}>
            <div className={styles.header}>
              <HotelIcon size={20} />
              <h3>Select Hotels</h3>
            </div>
            <div className={styles.searchContainer}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hotels..."
              />
              <Search className={styles.searchIcon} />
            </div>
            {hotels.length > 0 && (
              <div className={styles.selectionCountContainer}>
                <div className={styles.selectAllCheckbox}>
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                  <label htmlFor="select-all" className={styles.checkboxLabel}>
                    {allSelected ? "Deselect All" : "Select All"}
                  </label>
                </div>
                {hasSelection && (
                  <span className={styles.selectionCount}>
                    {selectedHotels.length} selected
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={styles.hotelList}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>No hotels found.</div>
            ) : (
              <ul>
                {filtered.map((h) => (
                  <li
                    key={h.id}
                    className={`${styles.hotelItem} ${
                      selectedHotels.some((selected) => selected.id === h.id) &&
                      styles.selected
                    }`}
                    onClick={() => toggleHotels(h)}
                  >
                    {h.name}
                    {selectedHotels.some(
                      (selected) => selected.id === h.id
                    ) && <Check size={16} />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
