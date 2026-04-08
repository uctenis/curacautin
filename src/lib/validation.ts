import type { ResourceType } from '../context/DataContext';
import { RESOURCE_MAX_GUESTS } from '../context/DataContext';

export const REQUIRE_RECEIPT = false; // Cambiar a true para hacer obligatorio adjuntar el comprobante

export interface BookingFormData {
    resourceType: ResourceType | null;
    checkIn: Date | null;
    checkOut: Date | null;
    name: string;
    email: string;
    contact: string;
    guests: number;
    paymentMethod: 'planilla' | 'deposito';
    installments: number;
    receipt: File | null;
}

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export const validateBookingForm = (data: BookingFormData): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 3) {
        errors.name = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.name.trim())) {
        errors.name = 'El nombre solo puede contener letras y espacios.';
    }

    if (!data.email) {
        errors.email = 'El correo electrónico es obligatorio.';
    } else {
        const emailLower = data.email.toLowerCase().trim();
        if (!emailLower.endsWith('@uct.cl')) {
            errors.email = 'Debe usar su correo institucional (@uct.cl).';
        } else if (emailLower.includes('@alumnos.uct.cl')) {
            errors.email = 'Este beneficio es exclusivo para funcionarios. Los correos @alumnos.uct.cl no están permitidos.';
        }
    }

    if (!data.contact) {
        errors.contact = 'El número de celular/WhatsApp es obligatorio.';
    } else {
        // Formato ej. +569 o 9 seguido de 8 digitos
        const num = data.contact.replace(/[\s\+]/g, '');
        if (!/^(569\d{8}|9\d{8})$/.test(num)) {
            errors.contact = 'El número debe ser de celular chileno (ej: +56 9 1234 5678).';
        }
    }

    if (data.resourceType) {
        const maxGuests = RESOURCE_MAX_GUESTS[data.resourceType];
        if (!data.guests || data.guests < 1) {
            errors.guests = 'Indique la cantidad de acompañantes (incluyéndose).';
        } else if (data.guests > maxGuests) {
            errors.guests = `La capacidad máxima permitida es de ${maxGuests} personas.`;
        }
    } else {
        errors.resourceType = 'Debe seleccionar una instalación.';
    }

    if (!data.checkIn) {
        errors.dates = 'Debe seleccionar fechas en el calendario.';
    }

    if (data.paymentMethod === 'planilla') {
        if (!data.installments || data.installments < 1 || data.installments > 6) {
            errors.installments = 'Las cuotas por planilla deben ser entre 1 y 6.';
        }
    } else if (data.paymentMethod === 'deposito') {
        if (REQUIRE_RECEIPT && !data.receipt) {
            errors.receipt = 'Debe adjuntar el comprobante de transferencia o depósito.';
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
};
