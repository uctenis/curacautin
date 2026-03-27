import React, { createContext, useContext, useState, useEffect } from 'react';

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
  status: 'pending' | 'confirmed';
  discountApplied: number;
  paymentMethod: 'planilla' | 'deposito';
  installments?: number;
  receiptAttached?: boolean;
  salaryBracket: SalaryBracket;
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

  // Verano: 15 Dic al 15 Mar
  if (month === 11 && day >= 15) return true;
  if (month === 0 || month === 1) return true;
  if (month === 2 && day <= 15) return true;

  // Primera semana de Julio (específico pedido usuario)
  if (month === 6 && day <= 7) return true;

  // Feriados y fines de semana largos Chile 2026
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const highDates = new Set([
    '2026-04-03', '2026-04-04', '2026-04-05', // Semana Santa
    '2026-05-01', '2026-05-02', '2026-05-03', // Día del Trabajo + Finde largo
    '2026-05-21', // Glorias Navales
    '2026-06-29', // San Pedro y San Pablo
    '2026-07-16', // Virgen del Carmen
    '2026-08-15', // Asunción
    '2026-09-18', '2026-09-19', '2026-09-20', // Fiestas Patrias
    '2026-10-12', // Encuentro Dos Mundos
    '2026-10-31', '2026-11-01', // Iglesias / Todos los Santos
    '2026-12-08', // Inmaculada Concepción
    '2026-12-25', '2026-12-26', '2026-12-27', // Navidad + Finde largo
  ]);

  if (highDates.has(dateStr)) return true;

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
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  confirmBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
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
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('uct_bookings');
    return saved ? JSON.parse(saved).map((b: any) => ({
      ...b,
      startDate: new Date(b.startDate),
      endDate: new Date(b.endDate)
    })) : [];
  });

  const [blockedDates, setBlockedDates] = useState<Date[]>(() => {
    const saved = localStorage.getItem('uct_blocked');
    return saved ? JSON.parse(saved).map((d: string) => new Date(d)) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('uct_settings');
    return saved ? JSON.parse(saved) : {
      maxSitePicnicPerDay: 12,
      maxSiteCampingPerDay: 10,
      maxCabin4PerDay: 4,
      maxCabin6PerDay: 2,
    };
  });

  useEffect(() => localStorage.setItem('uct_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('uct_blocked', JSON.stringify(blockedDates)), [blockedDates]);
  useEffect(() => localStorage.setItem('uct_settings', JSON.stringify(settings)), [settings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const confirmBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const toggleBlockDate = (date: Date) => {
    const dateStr = date.toDateString();
    setBlockedDates(prev => {
      const exists = prev.find(d => d.toDateString() === dateStr);
      if (exists) return prev.filter(d => d.toDateString() !== dateStr);
      return [...prev, date];
    });
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
    if (blockedDates.find(d => d.toDateString() === date.toDateString())) return 0;
    
    const count = bookings.filter(b => {
      if (b.type !== type) return false;
      const start = b.startDate.getTime();
      const end = b.endDate.getTime();
      const target = date.getTime();
      return target >= start && target < end;
    }).length;

    const picnicCount = bookings.filter(b => {
      return b.type === type && type === 'sitePicnic' && b.startDate.toDateString() === date.toDateString();
    }).length;

    const max = type === 'sitePicnic' ? settings.maxSitePicnicPerDay :
                type === 'siteCamping' ? settings.maxSiteCampingPerDay :
                type === 'cabin4' ? settings.maxCabin4PerDay : settings.maxCabin6PerDay;

    return type === 'sitePicnic' ? Math.max(0, max - picnicCount) : Math.max(0, max - count);
  };

  const checkAvailabilityRange = (start: Date, end: Date, type: ResourceType) => {
    let minAvail = Infinity;
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      minAvail = Math.min(minAvail, getAvailableCount(new Date(d), type));
    }
    return minAvail === Infinity ? 0 : minAvail;
  };

  return (
    <DataContext.Provider value={{
      bookings, settings, addBooking, confirmBooking, cancelBooking,
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
