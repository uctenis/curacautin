import { useState } from 'react';
import { validateBookingForm } from '../lib/validation';
import { useData, type ResourceType, type SalaryBracket, isHighSeason, SALARY_DISCOUNTS, RESOURCE_LABELS, RESOURCE_MAX_GUESTS } from '../context/DataContext';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, isAfter, startOfDay, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowRight, CheckCircle2, Sun, BadgePercent, ChevronLeft, ChevronRight, Info, Mail } from 'lucide-react';

const Booking = () => {
  const { checkAvailabilityRange, getAvailableCount, addBooking, getPrice, applyDiscount } = useData();
  const today = startOfDay(new Date());

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = useState<'checkin' | 'checkout'>('checkin');

  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'planilla' | 'deposito'>('deposito');
  const [installments, setInstallments] = useState(1);
  const [salaryBracket, setSalaryBracket] = useState<SalaryBracket>('tramo3');
  const [cabinPreference, setCabinPreference] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const totalNights = (checkIn && checkOut) ? differenceInDays(checkOut, checkIn) : 1;
  const isMultiDay = totalNights > 1;
  const discountPct = SALARY_DISCOUNTS[salaryBracket].percent;

  const getTotalPrice = (t: ResourceType) => {
    if (!checkIn) return 0;
    if (t === 'sitePicnic' || !checkOut || isSameDay(checkIn, checkOut)) {
      return getPrice(t, checkIn);
    }
    let total = 0;
    let current = startOfDay(checkIn);
    const end = startOfDay(checkOut);
    
    while (isBefore(current, end)) {
      total += getPrice(t, current);
      current = addDays(current, 1);
    }
    return total;
  };
  const getDiscounted = (t: ResourceType) => applyDiscount(getTotalPrice(t), salaryBracket);

  const handleDateClick = (day: Date) => {
    const d = startOfDay(day);
    if (isBefore(d, today)) return;

    if (selectionMode === 'checkin') {
      setCheckIn(d);
      setCheckOut(null);
      setSelectionMode('checkout');
    } else {
      if (isBefore(d, checkIn!) || isSameDay(d, checkIn!)) {
        setCheckIn(d);
        setCheckOut(null);
      } else {
        setCheckOut(d);
        setSelectionMode('checkin');
      }
    }
  };

  const isInRange = (day: Date) => {
    if (!checkIn || !checkOut) return false;
    return (isAfter(day, checkIn) && isBefore(day, checkOut)) || isSameDay(day, checkIn) || isSameDay(day, checkOut);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setErrors({});

    const formData = {
      resourceType: selectedResource,
      checkIn,
      checkOut,
      name,
      email,
      contact,
      guests,
      paymentMethod,
      installments: paymentMethod === 'planilla' ? installments : 0,
      receipt
    };

    const validation = validateBookingForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      setError('Por favor, corrija los errores en el formulario antes de continuar.');
      setIsLoading(false);
      return;
    }

    const finalPrice = getDiscounted(selectedResource!);

    try {
      await addBooking({
        type: selectedResource!,
        startDate: checkIn!,
        endDate: selectedResource === 'sitePicnic' ? checkIn! : (checkOut || addDays(checkIn!, 1)),
        name, contact, email, guests,
        totalPrice: finalPrice,
        discountApplied: discountPct,
        paymentMethod,
        installments: paymentMethod === 'planilla' ? installments : undefined,
        receiptAttached: paymentMethod === 'deposito' && !!receipt,
        salaryBracket,
        cabinPreference: selectedResource?.includes('cabin') && cabinPreference ? cabinPreference : undefined
      });

      // Disparar Webhook de Apps Script para correos Automáticos
      const emailPayload = {
        reserva: RESOURCE_LABELS[selectedResource!] + (selectedResource?.includes('cabin') && cabinPreference ? ` - Pref: ${cabinPreference}` : ''),
        arrivalDate: format(checkIn!, 'dd/MM/yyyy'),
        returnDate: format(checkOut || checkIn!, 'dd/MM/yyyy'),
        fullName: name,
        rut: 'Pendiente',
        formAccountEmail: email,
        personalEmail: email,
        phoneRaw: contact,
        phoneNormalized: contact.replace(/[^\d+]/g, ''),
        partySize: guests,
        termsAccepted: "Sí",
        timestamp: new Date().toLocaleString('es-CL'),
        totalPrice: finalPrice
      };

      try {
        await fetch(API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload),
        });
      } catch (emailErr) {
        console.warn('Network issue preventing email webhook:', emailErr);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error enviando reserva:', err);
      setError('Hubo un problema al enviar su solicitud. Por favor, reintente o contacte a reservascuracautin@uct.cl');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 animate-fade-in">
        <CheckCircle2 size={84} color="#10b981" style={{ marginBottom: '2rem' }} />
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--c-primary)' }}>¡Solicitud Enviada!</h2>
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2rem', borderRadius: '1.5rem', textAlign: 'center', maxWidth: '600px' }}>
          <p style={{ fontSize: '1.2rem', color: '#166534', fontWeight: 600, marginBottom: '1rem' }}>
            Su reserva fue enviada satisfactoriamente.
          </p>
          <p style={{ color: '#166534', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Le llegará una confirmación oficial a su correo institucional o vía <strong>WhatsApp</strong> en un plazo máximo de 48 horas tras validar los antecedentes.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#15803d', opacity: 0.8 }}>
            <Mail size={16} /> reservascuracautin@uct.cl
          </div>
        </div>
        <button className="btn btn-primary mt-12" onClick={() => { setIsSuccess(false); setSelectedResource(null); setCheckIn(null); setCheckOut(null); }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  const VisualCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    // Matriz completa del calendario (aprox 42 días, rellenando el mes)
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', maxWidth: '340px', margin: '0 auto 1.5rem' }}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--c-primary)' }}><CalendarIcon size={16} /> Selector de Fechas</h3>
          <div className="flex gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-icon"><ChevronLeft size={16} /></button>
            <span className="text-xs font-bold text-capitalize text-center w-24">{format(currentMonth, 'MMMM yyyy', { locale: es })}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-icon"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="calendar-grid" style={{ gap: '0.15rem' }}>
          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => <div key={d} className="calendar-day-header pb-1">{d}</div>)}
          {days.map(day => {
            const high = isHighSeason(day);
            const selected = (checkIn && isSameDay(day, checkIn)) || (checkOut && isSameDay(day, checkOut));
            const ranged = isInRange(day);
            
            // Requisito: Mínimo 2 noches de antelación
            const minAllowedDate = addDays(today, 2);
            const past = isBefore(day, minAllowedDate);
            
            const disabledForMode = selectionMode === 'checkout' && checkIn && isBefore(day, checkIn);
            const outOfMonth = !isSameMonth(day, currentMonth);

            const totalAvail = getAvailableCount(day, 'sitePicnic') + getAvailableCount(day, 'siteCamping') + getAvailableCount(day, 'cabin4') + getAvailableCount(day, 'cabin6');
            const completelyBooked = totalAvail === 0;

            return (
              <div
                key={day.toISOString()}
                onClick={() => !past && !completelyBooked && handleDateClick(day)}
                className={`calendar-day ${high && !outOfMonth ? 'season-high' : ''} ${selected ? 'selected' : ''} ${ranged ? 'ranged' : ''} ${past || disabledForMode || completelyBooked ? 'past' : ''} ${completelyBooked ? 'booked' : ''} ${outOfMonth ? 'out-of-month' : ''}`}
                title={completelyBooked ? 'Agotado' : ''}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <Info size={16} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed font-semibold">
              {selectionMode === 'checkin' ? 'Selecciona llegada.' : 'Registrado llegada. Selecciona salida.'}
            </p>
          </div>
          <div className="flex gap-4 px-2" style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.7 }}>
            <div className="flex items-center gap-1.5"><div style={{ width: 10, height: 10, backgroundColor: '#FEF3C7', border: '1px solid #F6E05E', borderRadius: '2px' }}></div> Alta</div>
            <div className="flex items-center gap-1.5"><div style={{ width: 10, height: 10, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '2px' }}></div> Baja</div>
          </div>
        </div>
      </div>
    );
  };

  const ResourceCard = ({ type, img, description, available, disabled, disabledMsg }: { type: ResourceType, img: string, description: string, available: number, disabled?: boolean, disabledMsg?: string }) => {
    const discounted = getDiscounted(type);
    const selected = selectedResource === type;
    const max = RESOURCE_MAX_GUESTS[type];
    const isAvail = available > 0;

    return (
      <div
        onClick={() => !disabled && isAvail && setSelectedResource(type)}
        className={`resource-card ${selected ? 'selected' : ''} ${disabled || !isAvail ? 'disabled' : ''}`}
        style={{
          borderRadius: '1rem',
          backgroundColor: selected ? '#f0fdf4' : 'white', cursor: (disabled || !isAvail) ? 'not-allowed' : 'pointer',
          border: selected ? '2px solid var(--c-primary)' : '1px solid var(--c-border)',
          marginBottom: '1rem', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="resource-card-content">
          <img src={img} alt={RESOURCE_LABELS[type]} className="resource-card-img" />
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
          <div className="flex justify-between items-start resource-card-header" style={{ width: '100%' }}>
            <div>
              <h3 className="font-bold text-lg mb-1">{RESOURCE_LABELS[type]}</h3>
              <p className="text-sm text-light mb-2">{description}</p>
              <div className="text-xs mt-1 text-red-500 font-bold">
                {disabledMsg ? disabledMsg : (isAvail ? `Capacidad: ${max} p. | ${available} unidades libres` : 'Totalmente Agotado')}
              </div>
            </div>
            <div className="resource-price-box" style={{ flexShrink: 0, minWidth: '130px', textAlign: 'right', backgroundColor: selected ? 'rgba(5, 150, 105, 0.08)' : 'var(--c-bg)', padding: '0.85rem', borderRadius: '0.75rem', border: selected ? '1px solid rgba(5, 150, 105, 0.2)' : '1px solid var(--c-border)', marginLeft: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--c-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Costo Final</span>
              <span className="text-2xl font-black text-primary resource-price-value" style={{ margin: '0.15rem 0' }}>${discounted.toLocaleString('es-CL')}</span>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: selected ? '#059669' : 'var(--c-text-light)' }}>{totalNights} {totalNights === 1 ? 'noche' : 'noches'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center mt-3">
            <span className={`badge ${isAvail ? 'badge-green' : 'badge-yellow'}`}>{isAvail ? `${available} disponibles` : 'Agotado'}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.6 }}>Máx {max} p.</span>
            {checkIn && isHighSeason(checkIn) && <span className="badge badge-high-season"><Sun size={12} /> T. Alta</span>}
            {discountPct > 0 && <span className="badge badge-discount">-{discountPct}% dcto</span>}
          </div>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--c-bg)', padding: '3.5rem 0' }}>
      <div className="container booking-layout">

        {/* SIDEBAR */}
        <div className="flex flex-col gap-6">
          <VisualCalendar />

          <div className="card" style={{ padding: '1.75rem', borderTop: '5px solid #10b981' }}>
            <h3 className="mb-2 font-bold flex items-center gap-2 text-primary" style={{ fontSize: '0.95rem' }}>
              <BadgePercent size={20} color="#059669" /> Descuento por Tramo de Sueldo Base
            </h3>
            <p className="text-[11px] text-light mb-4 leading-relaxed uppercase tracking-wider font-bold">Ajuste tarifario según tramo de sueldo base</p>
            <div className="flex flex-col gap-3">
              {(Object.entries(SALARY_DISCOUNTS) as [SalaryBracket, any][]).map(([k, v]) => (
                <label key={k}
                  className={`salary-option ${salaryBracket === k ? 'selected' : ''}`}
                  onClick={() => setSalaryBracket(k)}
                  style={{ padding: '0.85rem 1rem' }}
                >
                  <input type="radio" checked={salaryBracket === k} name="salary" readOnly />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="block font-bold text-sm">{v.range}</span>
                    </div>
                    <span className={`discount-badge discount-${v.percent}`} style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                      {v.percent > 0 ? `−${v.percent}%` : 'N/A'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ position: 'relative' }}>
          <h2 className="text-2xl font-black mb-10" style={{ color: 'var(--c-primary)' }}>
            {(!checkIn || !checkOut)
              ? 'Paso 1: Seleccione su estadía en el calendario'
              : `Instalaciones disponibles para su periodo`}
          </h2>

          <div className={(!checkIn || !checkOut) ? 'opacity-30 pointer-events-none' : 'animate-fade-in'}>
            <ResourceCard type="sitePicnic" img={import.meta.env.BASE_URL + "camping_graphic.jpg"} available={checkIn ? getAvailableCount(checkIn, 'sitePicnic') : 0}
              description="Habilitado solo para uso por el día (Sin pernoctar). Acceso a piscina y áreas verdes."
              disabled={isMultiDay} disabledMsg="No disponible para planes nocturnos" />
            <ResourceCard
              type="siteCamping"
              img={import.meta.env.BASE_URL + "camping_graphic.jpg"}
              description="Sitio ideal para armar tu carpa en medio de la naturaleza, con acceso a servicios básicos."
              available={totalNights > 0 && checkIn ? checkAvailabilityRange(checkIn, checkOut || checkIn, 'siteCamping') : 0}
              disabled={totalNights === 0}
              disabledMsg={totalNights === 0 ? "Mínimo 1 noche requerida" : undefined}
            />
            <ResourceCard
              type="cabin4"
              img={import.meta.env.BASE_URL + "cabana_graphic.jpg"}
              description="Cabaña perfecta con diseño integrado al paisaje, ideal para 2 personas con un máximo de 3."
              available={totalNights > 0 && checkIn ? checkAvailabilityRange(checkIn, checkOut || checkIn, 'cabin4') : 0}
              disabled={totalNights === 0}
              disabledMsg={totalNights === 0 ? "Mínimo 1 noche requerida" : undefined}
            />
            <ResourceCard
              type="cabin6"
              img={import.meta.env.BASE_URL + "cabana_graphic.jpg"}
              description="Cabaña amplia y cómoda para pasar en familia, ideal para 4 personas con un máximo de 5."
              available={totalNights > 0 && checkIn ? checkAvailabilityRange(checkIn, checkOut || checkIn, 'cabin6') : 0}
              disabled={totalNights === 0}
              disabledMsg={totalNights === 0 ? "Mínimo 1 noche requerida" : undefined}
            />
          </div>

          {selectedResource && checkIn && checkOut && (
            <div className="card mt-16 animate-fade-in" style={{ padding: '3rem', borderLeft: '8px solid var(--c-secondary)', backgroundColor: '#fcfcfc' }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black">Validación del Funcionario</h3>
                  <p className="text-sm font-bold" style={{ color: 'var(--c-secondary)', marginTop: '0.25rem' }}>
                    Reserva desde el {format(checkIn, "d 'de' MMMM", { locale: es })} hasta el {format(checkOut, "d 'de' MMMM yyyy", { locale: es })}
                  </p>
                  <p className="text-light text-sm mt-1">Complete sus datos para formalizar la solicitud.</p>
                </div>
                <div style={{ textAlign: 'right', background: 'var(--c-primary)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem' }}>
                  <span className="text-xs block opacity-75">Monto Final:</span>
                  <span className="text-3xl font-black">${getDiscounted(selectedResource).toLocaleString('es-CL')}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200" style={{ fontSize: '0.95rem' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>⚠️ Atención requerida:</strong>
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label">Titular UCT {errors.name && <span className="text-red-500 font-bold ml-1">*</span>}</label>
                    <input type="text" className={`input ${errors.name ? 'border-red-500 bg-red-50' : ''}`} placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Celular / WhatsApp {errors.contact && <span className="text-red-500 font-bold ml-1">*</span>}</label>
                    <input type="text" className={`input ${errors.contact ? 'border-red-500 bg-red-50' : ''}`} placeholder="+56 9 ..." value={contact} onChange={e => setContact(e.target.value)} />
                    {errors.contact && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.contact}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label">Email Institucional {errors.email && <span className="text-red-500 font-bold ml-1">*</span>}</label>
                    <input type="email" className={`input ${errors.email ? 'border-red-500 bg-red-50' : ''}`} placeholder="usuario@uct.cl" value={email} onChange={e => setEmail(e.target.value)} />
                    {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Medio de Pago</label>
                    <select className="select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)}>
                      <option value="deposito">Depósito / Transferencia Directa</option>
                      <option value="planilla">Descuento Mensual por Planilla</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                  <div>
                    <label className="label">Cantidad de Acompañantes {errors.guests && <span className="text-red-500 font-bold ml-1">*</span>}</label>
                    <select className={`select ${errors.guests ? 'border-red-500 bg-red-50' : ''}`} value={guests} onChange={e => setGuests(parseInt(e.target.value))}>
                      {Array.from({ length: RESOURCE_MAX_GUESTS[selectedResource] }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} persona{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    {errors.guests && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.guests}</p>}
                    <p style={{ fontSize: '0.75rem', color: 'var(--c-text-light)', marginTop: '0.5rem' }}>Capacidad máxima del recinto: {RESOURCE_MAX_GUESTS[selectedResource]} p.</p>
                  </div>
                  {paymentMethod === 'planilla' && (
                    <div>
                      <label className="label">Cuotas Deseables (1 a 6) {errors.installments && <span className="text-red-500 font-bold ml-1">*</span>}</label>
                      <select className={`select ${errors.installments ? 'border-red-500 bg-red-50' : ''}`} value={installments} onChange={e => setInstallments(parseInt(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n} cuota{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      {errors.installments && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.installments}</p>}
                    </div>
                  )}
                  {paymentMethod === 'deposito' && (
                    <div>
                      <label className="label">Comprobante (Archivo) {errors.receipt && <span className="text-red-500 font-bold ml-1">*</span>}</label>
                      <input type="file" className={`input py-1.5 ${errors.receipt ? 'border-red-500 bg-red-50' : ''}`} onChange={e => setReceipt(e.target.files?.[0] || null)} />
                      {errors.receipt && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.receipt}</p>}
                    </div>
                  )}
                </div>

                {selectedResource?.includes('cabin') && (
                  <div>
                    <label className="label">Preferencia de Cabaña Específica</label>
                    <select className="select" value={cabinPreference} onChange={e => setCabinPreference(e.target.value)}>
                      <option value="">Indiferente (Asignación Automática)</option>
                      {selectedResource === 'cabin4' && (
                        <>
                          <option value="Cabaña 1 (Vista Bosque)">Cabaña 1 (Vista Bosque)</option>
                          <option value="Cabaña 3 (Vista Bosque)">Cabaña 3 (Vista Bosque)</option>
                          <option value="Cabaña 5 (Borde Río)">Cabaña 5 (Borde Río)</option>
                          <option value="Cabaña 6 (Borde Río)">Cabaña 6 (Borde Río)</option>
                        </>
                      )}
                      {selectedResource === 'cabin6' && (
                        <>
                          <option value="Cabaña 2 (Vista Bosque - Familiar)">Cabaña 2 (Vista Bosque - Familiar)</option>
                          <option value="Cabaña 4 (Borde Río - Familiar)">Cabaña 4 (Borde Río - Familiar)</option>
                        </>
                      )}
                    </select>
                    <p style={{ fontSize: '0.75rem', color: 'var(--c-text-light)', marginTop: '0.5rem' }}>* Sujeto a disponibilidad para las fechas seleccionadas.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-secondary py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? 'Enviando Solicitud...' : 'Confirmar y Enviar Solicitud'}
                  {!isLoading && <ArrowRight size={22} />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
