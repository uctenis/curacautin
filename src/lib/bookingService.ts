import { collection, addDoc, updateDoc, doc, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Booking } from '../context/DataContext';

// Comprueba si están las credenciales por defecto o si falta apiKey
export const isFirebaseConfigured = () => {
    return db.app.options.apiKey && db.app.options.apiKey !== "TU_API_KEY";
};

// --- Manejo local en caso de que Firebase no esté configurado ---

export const getLocalBookings = (): Booking[] => {
    const saved = localStorage.getItem('uct_bookings');
    if (!saved) return [];
    return JSON.parse(saved).map((b: any) => ({
        ...b,
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        createdAt: b.createdAt ? new Date(b.createdAt) : new Date(b.startDate),
    }));
};

export const saveLocalBooking = (booking: Booking) => {
    const current = getLocalBookings();
    localStorage.setItem('uct_bookings', JSON.stringify([...current, booking]));
};

export const updateLocalBookingStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    const current = getLocalBookings();
    localStorage.setItem('uct_bookings', JSON.stringify(
        current.map(b => b.id === id ? { ...b, status } : b)
    ));
};

// Función para migrar datos locales a Firebase una sola vez
export const syncLocalToFirebase = async () => {
    if (!isFirebaseConfigured()) return;
    
    const local = getLocalBookings();
    if (local.length === 0) return;

    console.info(`Migrando ${local.length} reservas locales a Firebase...`);
    
    for (const booking of local) {
        try {
            await addDoc(collection(db, 'bookings'), {
                ...booking,
                startDate: Timestamp.fromDate(booking.startDate),
                endDate: Timestamp.fromDate(booking.endDate),
                createdAt: Timestamp.fromDate(booking.createdAt || booking.startDate),
            });
        } catch (e) {
            console.error("Error migrando reserva:", booking.id, e);
        }
    }

    // Limpiar local storage una vez migrado (o marcar como migrado)
    localStorage.removeItem('uct_bookings');
    console.info("Migración completada.");
};

// --- Métodos de servicio ---

// Suscribe a los cambios de la base de datos (o devuelve mock local si no hay Firebase)
export const subscribeToBookings = (callback: (bookings: Booking[]) => void) => {
    if (isFirebaseConfigured()) {
        try {
            const q = query(collection(db, 'bookings'));
            return onSnapshot(q, (snapshot) => {
                const bookings = snapshot.docs.map(docData => {
                    const data = docData.data();
                    return {
                        ...data,
                        id: docData.id,
                        startDate: data.startDate?.toDate() || new Date(),
                        endDate: data.endDate?.toDate() || new Date(),
                        createdAt: data.createdAt?.toDate() || new Date(),
                    } as Booking;
                });
                callback(bookings);
            }, (err) => {
                console.warn("Error en suscripción de Firebase. Usando LocalStorage fallback.", err);
                callback(getLocalBookings());
            });
        } catch (e) {
            console.warn("Firebase no inicializado correctamente. Usando LocalStorage fallback.", e);
            callback(getLocalBookings());
            return () => { };
        }
    } else {
        // Si no está configurado Firebase, entregamos los datos locales.
        callback(getLocalBookings());
        return () => { }; // No-op unsubscribe
    }
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const newBookingBase = {
        ...bookingData,
        status: 'pending' as const,
        createdAt: new Date()
    };

    if (isFirebaseConfigured()) {
        try {
            const docRef = await addDoc(collection(db, 'bookings'), {
                ...newBookingBase,
                startDate: Timestamp.fromDate(newBookingBase.startDate),
                endDate: Timestamp.fromDate(newBookingBase.endDate),
                createdAt: Timestamp.fromDate(newBookingBase.createdAt),
            });
            return { ...newBookingBase, id: docRef.id };
        } catch (e) {
            console.error("Error al guardar en Firebase:", e);
        }
    }

    // Fallback
    const localBooking = { ...newBookingBase, id: Math.random().toString(36).substring(2, 9) };
    saveLocalBooking(localBooking);
    return localBooking;
};

export const updateBookingStatusInDb = async (id: string, status: 'confirmed' | 'cancelled'): Promise<void> => {
    if (isFirebaseConfigured()) {
        try {
            await updateDoc(doc(db, 'bookings', id), { status });
            return;
        } catch (e) {
            console.error("Error al actualizar estado en Firebase:", e);
        }
    }

    // Fallback
    updateLocalBookingStatus(id, status);
};
