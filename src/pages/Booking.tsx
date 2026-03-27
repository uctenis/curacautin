import { useState } from 'react';
import { useData, type ResourceType, type SalaryBracket, isHighSeason, SALARY_DISCOUNTS, RESOURCE_LABELS, RESOURCE_MAX_GUESTS } from '../context/DataContext';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowRight, CheckCircle2, Sun, BadgePercent, ChevronLeft, ChevronRight, Info, Mail } from 'lucide-react';

const Booking = () => {
  const { checkAvailabilityRange, getAvailableCount, addBooking, getPrice, applyDiscount } = useData();
  const today = startOfDay(new Date());

  const [checkIn, setCheckIn]   = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = useState<'checkin' | 'checkout'>('checkin');

  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [name, setName]         = useState('');
  const [contact, setContact]   = useState('');
  const [email, setEmail]       = useState('');
  const [receipt, setReceipt]   = useState<File | null>(null);
  const [guests, setGuests]     = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'planilla' | 'deposito'>('deposito');
  const [installments, setInstallments]   = useState(1);
  const [salaryBracket, setSalaryBracket] = useState<SalaryBracket>('tramo3');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL del Google Apps Script (Debe reemplazarse tras el deploy)
  const API_URL = 'https://script.google.com/macros/s/SU_SCRIPT_ID/exec';

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const totalNights  = (checkIn && checkOut) ? differenceInDays(checkOut, checkIn) : 1;
  const isMultiDay   = totalNights > 1;
  const discountPct  = SALARY_DISCOUNTS[salaryBracket].percent;

  const getUnitPrice     = (t: ResourceType) => checkIn ? getPrice(t, checkIn) : 0;
  const getTotalPrice    = (t: ResourceType) => {
    const unit = getUnitPrice(t);
    return t === 'sitePicnic' ? unit : unit * totalNights;
  };
  const getDiscounted    = (t: ResourceType) => applyDiscount(getTotalPrice(t), salaryBracket);

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
    if (!selectedResource || !checkIn || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    const finalPrice = getDiscounted(selectedResource);
    const bookingData = {
      name,
      email,
      contact,
      resourceType: selectedResource,
      resourceLabel: RESOURCE_LABELS[selectedResource],
      checkIn: format(checkIn, 'dd/MM/yyyy'),
      checkOut: format(checkOut || checkIn, 'dd/MM/yyyy'),
      nights: totalNights,
      guests,
      salaryBracket,
      salaryBracketLabel: SALARY_DISCOUNTS[salaryBracket].range,
      totalPrice: finalPrice,
      paymentMethod,
      installments: paymentMethod === 'planilla' ? installments : undefined,
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requiere no-cors o redirección
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      // Nota: Con no-cors no podemos leer success=true directamente desde la respuesta HTTP parcial
      // pero el script de Google se ejecutará. Si se prefiere validación real, se debe usar 
      // un proxy o CORS configurado en el script (aunque Script App es limitado).
      // Por UX, asumimos éxito si no hay excepción de red.
      
      addBooking({
        type: selectedResource,
        startDate: checkIn,
        endDate: selectedResource === 'sitePicnic' ? checkIn : (checkOut || addDays(checkIn, 1)),
        name, contact, email, guests,
        totalPrice: finalPrice,
        discountApplied: discountPct,
        paymentMethod,
        installments: paymentMethod === 'planilla' ? installments : undefined,
        receiptAttached: paymentMethod === 'deposito' && !!receipt,
        salaryBracket,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Error enviando reserva:', err);
      setError('Hubo un problema al enviar su solicitud. Por favor, reintente o contacte a dsilva@uct.cl');
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
                <Mail size={16}/> dsilva@uct.cl
            </div>
        </div>
        <button className="btn btn-primary mt-12" onClick={() => { setIsSuccess(false); setSelectedResource(null); setCheckIn(null); setCheckOut(null); }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  const VisualCalendar = () => {
    const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
    return (
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--c-primary)' }}><CalendarIcon size={16}/> Selector de Fechas</h3>
          <div className="flex gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-icon"><ChevronLeft size={16}/></button>
            <span className="text-xs font-bold text-capitalize text-center w-24">{format(currentMonth, 'MMMM yyyy', { locale: es })}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-icon"><ChevronRight size={16}/></button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
          {Array(days[0].getDay()).fill(0).map((_, i) => <div key={`empty-${i}`}></div>)}
          {days.map(day => {
            const high = isHighSeason(day);
            const selected = (checkIn && isSameDay(day, checkIn)) || (checkOut && isSameDay(day, checkOut));
            const ranged = isInRange(day);
            const past = isBefore(day, today);
            const disabledForMode = selectionMode === 'checkout' && checkIn && isBefore(day, checkIn);

            return (
              <div
                key={day.toISOString()}
                onClick={() => !past && handleDateClick(day)}
                className={`calendar-day ${high ? 'season-high' : ''} ${selected ? 'selected' : ''} ${ranged ? 'ranged' : ''} ${past || disabledForMode ? 'past' : ''}`}
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
          display: 'flex', gap: '1.5rem', padding: '1.25rem', borderRadius: '1rem',
          backgroundColor: selected ? '#f0fdf4' : 'white', cursor: (disabled || !isAvail) ? 'not-allowed' : 'pointer',
          border: selected ? '2px solid var(--c-primary)' : '1px solid var(--c-border)',
          marginBottom: '1rem', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
        }}
      >
        <img src={img} alt={RESOURCE_LABELS[type]} style={{ width: '150px', height: '110px', objectFit: 'cover', borderRadius: '0.75rem' }} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold">{RESOURCE_LABELS[type]}</h4>
            <div className="text-right">
                <span className="text-2xl font-black text-primary">${discounted.toLocaleString('es-CL')}</span>
                <p className="text-xs text-light" style={{ margin: 0 }}>Total por {totalNights} {totalNights === 1 ? 'noche' : 'noches'}</p>
            </div>
          </div>
          <p className="text-sm text-light mb-3">{disabled ? disabledMsg : description}</p>
          <div className="flex gap-3 items-center">
            <span className={`badge ${isAvail ? 'badge-green' : 'badge-yellow'}`}>{isAvail ? `${available} disponibles` : 'Agotado'}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.6 }}>Máx {max} p.</span>
            {checkIn && isHighSeason(checkIn) && <span className="badge badge-high-season"><Sun size={12}/> T. Alta</span>}
            {discountPct > 0 && <span className="badge badge-discount">-{discountPct}% dcto</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--c-bg)', padding: '3.5rem 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 360px) 1fr', gap: '3rem', alignItems: 'start' }}>
        
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
                            {/* Deleted "sueldo base mensual" label */}
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
            <ResourceCard type="sitePicnic" img="/camping_graphic.jpg" available={checkIn ? getAvailableCount(checkIn, 'sitePicnic') : 0} 
                description="Habilitado solo para uso por el día (Sin pernoctar). Acceso a piscina y áreas verdes." 
                disabled={isMultiDay} disabledMsg="No disponible para planes nocturnos" />
            <ResourceCard type="siteCamping" img="/camping_graphic.jpg" available={(checkIn && checkOut) ? checkAvailabilityRange(checkIn, checkOut, 'siteCamping') : 0}
                description="Sitio nativo cómodo para pernoctar con carpa propia. Incluye estacionamiento privado." />
            <ResourceCard type="cabin4" img="/cabana_graphic.jpg" available={(checkIn && checkOut) ? checkAvailabilityRange(checkIn, checkOut, 'cabin4') : 0}
                description="Cabaña de diseño moderno diseñada para grupos de hasta 3 personas. Full equipada." />
            <ResourceCard type="cabin6" img="/cabana_graphic.jpg" available={(checkIn && checkOut) ? checkAvailabilityRange(checkIn, checkOut, 'cabin6') : 0}
                description="Cabaña familiar amplia para 5 personas. Máxima comodidad institucional." />
          </div>

          {selectedResource && checkIn && checkOut && (
            <div className="card mt-16 animate-fade-in" style={{ padding: '3rem', borderLeft: '8px solid var(--c-secondary)', backgroundColor: '#fcfcfc' }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black">Validación del Funcionario</h3>
                        <p className="text-light text-sm">Complete sus datos para formalizar la solicitud.</p>
                    </div>
                    <div style={{ textAlign: 'right', background: 'var(--c-primary)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem' }}>
                        <span className="text-xs block opacity-75">Monto Final:</span>
                        <span className="text-3xl font-black">${getDiscounted(selectedResource).toLocaleString('es-CL')}</span>
                    </div>
                </div>

                <form onSubmit={handleBooking} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="label">Titular UCT</label>
                            <input type="text" className="input" placeholder="Nombre completo" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="label">WhatsApp de Contacto</label>
                            <input type="text" className="input" placeholder="+56 9 ..." required value={contact} onChange={e => setContact(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="label">Email Institucional</label>
                            <input type="email" className="input" placeholder="usuario@uct.cl" required value={email} onChange={e => setEmail(e.target.value)} />
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
                            <label className="label">Cantidad de Acompañantes</label>
                            <input type="number" className="input" min="1" max={RESOURCE_MAX_GUESTS[selectedResource]} required value={guests} onChange={e => setGuests(parseInt(e.target.value))} />
                            <p style={{ fontSize: '0.75rem', color: 'var(--c-text-light)', marginTop: '0.5rem' }}>Capacidad máxima del recinto: {RESOURCE_MAX_GUESTS[selectedResource]} p.</p>
                        </div>
                        {paymentMethod === 'planilla' && (
                            <div>
                                <label className="label">Cuotas Deseables (1 a 6)</label>
                                <input type="number" className="input" min="1" max="6" required value={installments} onChange={e => setInstallments(parseInt(e.target.value))} />
                            </div>
                        )}
                        {paymentMethod === 'deposito' && (
                            <div>
                                <label className="label">Comprobante (Archivo)</label>
                                <input type="file" className="input py-1.5" required onChange={e => setReceipt(e.target.files?.[0] || null)} />
                            </div>
                        )}
                    </div>

                    {/* Deleted the yellow warning box as requested */}

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="btn btn-secondary py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Enviando Solicitud...' : 'Confirmar y Enviar Solicitud'}
                        {!isLoading && <ArrowRight size={22}/>}
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
