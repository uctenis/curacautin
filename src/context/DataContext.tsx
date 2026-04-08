import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToBookings, createBooking, updateBookingStatusInDb, syncLocalToFirebase, subscribeToBlockedDates, updateBlockedDateInDb } from '../lib/bookingService';

export type ResourceType = 'sitePicnic' | 'siteCamping' | 'cabin4' | 'cabin6';
export type SalaryBracket = 'tramo1' | 'tramo2' | 'tramo3';

export interface Booking {
  id: string;
  type: ResourceType;
  startDate: Date;
  endDate: Date;
  name: string;
  contact: string;
  email: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  discountApplied: number;
  paymentMethod: 'planilla' | 'deposito';
  installments?: number;
  receiptAttached?: boolean;
  salaryBracket: SalaryBracket;
  cabinPreference?: string;
  createdAt?: Date;
}

export interface Settings {
  maxSitePicnicPerDay: number;
  maxSiteCampingPerDay: number;
  maxCabin4PerDay: number;
  maxCabin6PerDay: number;
}

export const SALARY_DISCOUNTS: Record<SalaryBracket, { range: string; percent: number }> = {
  tramo1: { range: 'Hasta $1.000.000', percent: 20 },
  tramo2: { range: '$1.000.001 - $2.000.000', percent: 10 },
  tramo3: { range: 'Más de $2.000.001', percent: 0 },
};

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  sitePicnic: 'Sitio Picnic',
  siteCamping: 'Sitio Camping',
  cabin4: 'Cabaña (3 personas)',
  cabin6: 'Cabaña Familiar (5 personas)',
};

export const RESOURCE_MAX_GUESTS: Record<ResourceType, number> = {
  sitePicnic: 8,
  siteCamping: 6,
  cabin4: 3,
  cabin6: 5,
};

// Temporada Alta 2026: Verano, Primera semana Julio, Feriados y Findes largos
export const isHighSeason = (date: Date): boolean => {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const year = date.getFullYear();
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // 1. Verano: 15 Dic al 15 Mar
  if ((month === 11 && day >= 15) || month === 0 || month === 1 || (month === 2 && day <= 15)) return true;

  // 2. Fines de semana largos y Feriados Chile 2026
  const highDates = new Set([
    '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', // Año Nuevo + Sándwich
    '2026-04-03', '2026-04-04', '2026-04-05', // Semana Santa
    '2026-05-01', '2026-05-02', '2026-05-03', // Día del Trabajo
    '2026-06-27', '2026-06-28', '2026-06-29', // San Pedro y San Pablo
    '2026-07-16', // Virgen del Carmen
    '2026-08-15', // Asunción
    '2026-09-18', '2026-09-19', '2026-09-20', // Fiestas Patrias
    '2026-10-10', '2026-10-11', '2026-10-12', // Finde largo Octubre
    '2026-10-31', '2026-11-01', // Iglesias / Todos los Santos
    '2026-12-08', // Inmaculada Concepción
    '2026-12-25', '2026-12-26', '2026-12-27', // Navidad
  ]);

  if (highDates.has(dateStr)) return true;

  // 3. Recesos UCT Administrativos
  // Mayo: Solo del 21 al 24 (Feriado + Sándwich)
  if (month === 4 && day >= 21 && day <= 24) return true;
  
  // Invierno: 18 al 26 de Julio (Receso administrativo según corresponda)
  if (month === 6 && day >= 18 && day <= 26) return true;

  return false;
};

// Precios base (Low Season)
const BASE_PRICES: Record<ResourceType, number> = {
  sitePicnic: 15000,
  siteCamping: 20000,
  cabin4: 30000,
  cabin6: 40000,
};

// Precios High Season
const HIGH_PRICES: Record<ResourceType, number> = {
  sitePicnic: 20000,
  siteCamping: 30000,
  cabin4: 45000,
  cabin6: 60000,
};

interface DataContextType {
  bookings: Booking[];
  settings: Settings;
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  confirmBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
  deleteBooking: (id: string) => void;
  blockedDates: Date[];
  toggleBlockDate: (date: Date) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  checkAvailabilityRange: (start: Date, end: Date, type: ResourceType) => number;
  getAvailableCount: (date: Date, type: ResourceType) => number;
  getPrice: (type: ResourceType, date: Date) => number;
  applyDiscount: (price: number, bracket: SalaryBracket) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    syncLocalToFirebase();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, []);

  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToBlockedDates((data) => {
      setBlockedDates(data);
    });
    return () => unsubscribe();
  }, []);

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('uct_settings');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      maxSitePicnicPerDay: parsed?.maxSitePicnicPerDay === 10 ? 12 : (parsed?.maxSitePicnicPerDay || 12),
      maxSiteCampingPerDay: parsed?.maxSiteCampingPerDay === 10 ? 12 : (parsed?.maxSiteCampingPerDay || 12),
      maxCabin4PerDay: parsed.maxCabin4PerDay || 4,
      maxCabin6PerDay: parsed.maxCabin6PerDay || 2,
    };
  });

  useEffect(() => localStorage.setItem('uct_settings', JSON.stringify(settings)), [settings]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    await createBooking(bookingData);
  };

  const confirmBooking = async (id: string) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
    try {
      await updateBookingStatusInDb(id, 'confirmed');
    } catch (err) {
      console.error(err);
      // Revert if error (Optional: could fetch again)
    }
  };

  const cancelBooking = async (id: string) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    try {
      await updateBookingStatusInDb(id, 'cancelled');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBooking = async (id: string) => {
    // Optimistic update
    setBookings(prev => prev.filter(b => b.id !== id));
    try {
      const service = await import('../lib/bookingService');
      await service.deleteBookingFromDb(id);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBlockDate = async (date: Date) => {
    const dateStr = date.toDateString();
    const exists = blockedDates.find(d => d.toDateString() === dateStr);
    
    // Optimistic update
    if (exists) {
      setBlockedDates(prev => prev.filter(d => d.toDateString() !== dateStr));
    } else {
      setBlockedDates(prev => [...prev, date]);
    }

    try {
      console.log(`[Admin] Toggling block for: ${dateStr}. Action: ${exists ? 'Remove' : 'Add'}`);
      if (exists) {
        await updateBlockedDateInDb(date, 'remove');
      } else {
        await updateBlockedDateInDb(date, 'add');
      }
    } catch (err) {
      console.error("Error toggling blocked date:", err);
      // Revert if error
      if (exists) {
        setBlockedDates(prev => [...prev, date]);
      } else {
        setBlockedDates(prev => prev.filter(d => d.toDateString() !== dateStr));
      }
    }
  };

  const updateSettings = (newSet: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSet }));
  };

  const getPrice = (type: ResourceType, date: Date) => {
    return isHighSeason(date) ? HIGH_PRICES[type] : BASE_PRICES[type];
  };

  const applyDiscount = (price: number, bracket: SalaryBracket) => {
    const discount = SALARY_DISCOUNTS[bracket].percent;
    return price * (1 - discount / 100);
  };

  const getAvailableCount = (date: Date, type: ResourceType) => {
    if (blockedDates.some(d => d.toDateString() === date.toDateString())) return 0;

    const count = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (b.type !== type) return false;
      const start = b.startDate.getTime();
      const end = b.endDate.getTime();
      const target = date.getTime();
      return target >= start && target < end;
    }).length;

    const picnicCount = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      return b.type === type && type === 'sitePicnic' && b.startDate.toDateString() === date.toDateString();
    }).length;

    const max = type === 'sitePicnic' ? settings.maxSitePicnicPerDay :
      type === 'siteCamping' ? settings.maxSiteCampingPerDay :
        type === 'cabin4' ? settings.maxCabin4PerDay : settings.maxCabin6PerDay;

    return type === 'sitePicnic' ? Math.max(0, max - picnicCount) : Math.max(0, max - count);
  };

  const checkAvailabilityRange = (start: Date, end: Date, type: ResourceType) => {
    const isDateBlocked = (date: Date) => blockedDates.some(bd => bd.toDateString() === date.toDateString());
    
    // Regla: No se puede hacer Check-in ni Check-out en un día bloqueado
    if (isDateBlocked(start) || isDateBlocked(end)) return 0;
    
    let minAvail = Infinity;
    // El loop llega hasta el día anterior al checkout (noches de estadía)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const current = new Date(d);
      // getAvailableCount ya comprueba internamente si 'current' está bloqueado
      minAvail = Math.min(minAvail, getAvailableCount(current, type));
    }
    return minAvail === Infinity ? 0 : minAvail;
  };

  return (
    <DataContext.Provider value={{
      bookings, settings, addBooking, confirmBooking, cancelBooking, deleteBooking,
      blockedDates, toggleBlockDate, updateSettings,
      checkAvailabilityRange, getAvailableCount, getPrice, applyDiscount
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
