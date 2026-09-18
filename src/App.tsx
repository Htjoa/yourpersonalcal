import { Button, Input, Textarea, Icon } from './ui';
import { createCalendarEventFn, deleteCalendarEventFn, listCalendarEventsFn, parseCalendarRequestFn } from './storage';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Sparkles, Trash2 } from 'lucide-react';
type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
    category: string;
    createdAt: string;
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const CATEGORY_CLASS: Record<string, string> = { normal: 'event-normal', fire: 'event-fire', water: 'event-water', electric: 'event-electric', grass: 'event-grass' };
function dateKey(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function monthCells(y: number, m: number) { const first = new Date(y, m, 1), start = new Date(y, m, 1 - first.getDay()); return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; }); }
export function StudioTemplate() {
    const scope = "local";
    const initial = new Date();
    const [cursor, setCursor] = useState(initial), [selected, setSelected] = useState(initial), [events, setEvents] = useState<CalendarEvent[]>([]), [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(''), [time, setTime] = useState('09:00'), [category, setCategory] = useState('normal'), [assistant, setAssistant] = useState(''), [assistantStatus, setAssistantStatus] = useState(''), [busy, setBusy] = useState(false);
    const cells = useMemo(() => monthCells(cursor.getFullYear(), cursor.getMonth()), [cursor]);
    const signedIn = scope != null && scope !== "guest";
    const refresh = async () => { if (!signedIn) {
        setEvents([]);
        setLoading(false);
        return;
    } setLoading(true); try {
        setEvents(await listCalendarEventsFn() as CalendarEvent[]);
    }
    finally {
        setLoading(false);
    } };
    useEffect(() => { void refresh(); }, [signedIn]);
    const addEvent = async () => { if (!signedIn) {
        setAssistantStatus('Sign in to save events to your personal calendar.');
        return;
    } if (!title.trim())
        return; setBusy(true); try {
        await createCalendarEventFn({ data: { title: title.trim(), date: dateKey(selected), time, category: category as 'normal' | 'fire' | 'water' | 'electric' | 'grass' } });
        setTitle('');
        await refresh();
    }
    finally {
        setBusy(false);
    } };
    const removeEvent = async (id: string) => { if (!signedIn)
        return; setBusy(true); try {
        await deleteCalendarEventFn({ data: { id } });
        await refresh();
    }
    finally {
        setBusy(false);
    } };
    const askAssistant = async () => { if (!signedIn) {
        setAssistantStatus('Sign in to use CalBuddy with your private calendar.');
        return;
    } if (!assistant.trim())
        return; setBusy(true); setAssistantStatus('CalBuddy is planning your event…'); try {
        const today = dateKey(new Date());
        const parsed = await parseCalendarRequestFn({ data: { request: assistant.trim(), currentDate: today } });
        await createCalendarEventFn({ data: { title: parsed.title, date: parsed.date, time: parsed.time, category: parsed.category as 'normal' | 'fire' | 'water' | 'electric' | 'grass' } });
        const d = new Date(`${parsed.date}T12:00:00`);
        setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
        setSelected(d);
        setAssistant('');
        setAssistantStatus(`Added “${parsed.title}” on ${parsed.date} at ${parsed.time}.`);
        await refresh();
    }
    catch (e) {
        setAssistantStatus(e instanceof Error ? e.message : 'CalBuddy could not create that event.');
    }
    finally {
        setBusy(false);
    } };
    const selectedEvents = events.filter(e => e.date === dateKey(selected)).sort((a, b) => a.time.localeCompare(b.time));
    return <div className="trainer-shell">
    <aside className="trainer-sidebar">
      <div className="trainer-brand"><div className="pokeball-mini"><span /></div><div><strong>YourPersonalCal</strong><small>{signedIn ? 'Local Editable Copy' : 'Public Calendar Preview'}</small></div></div>{!signedIn && <a className="guest-signin" href="/__auth/login?return=/">Sign in for your private calendar</a>}
      <div className="trainer-card"><span>SELECTED DAY</span><b>{selected.getDate()}</b><strong>{MONTHS[selected.getMonth()]}</strong><small>{selected.toLocaleDateString('en-US', { weekday: 'long' })}</small></div>
      <div className="trainer-upcoming"><h3>Today’s party</h3>{selectedEvents.length ? selectedEvents.map(e => <div className="side-event" key={e.id}><i className={CATEGORY_CLASS[e.category]}/><div><b>{e.title}</b><span>{e.time}</span></div>{signedIn && <button aria-label={`Remove ${e.title}`} onClick={() => void removeEvent(e.id)}><Icon as={Trash2} size="sm"/></button>}</div>) : <p>No events for this date yet.</p>}</div>
    </aside>

    <main className="calendar-workspace">
      <section className="calendar-toolbar"><div><span className="eyebrow">YOUR ADVENTURE MAP</span><h1>{MONTHS[cursor.getMonth()]} <em>{cursor.getFullYear()}</em></h1></div><div className="month-controls"><Button variant="tertiary" iconOnly aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><Icon as={ChevronLeft}/></Button><Button variant="tertiary" onClick={() => { setCursor(initial); setSelected(initial); }}>Today</Button><Button variant="tertiary" iconOnly aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><Icon as={ChevronRight}/></Button></div></section>
      <section className="pokemon-calendar"><div className="weekday-row">{DAYS.map(d => <span key={d}>{d}</span>)}</div><div className="month-grid">{cells.map((d, i) => { const key = dateKey(d), list = events.filter(e => e.date === key), active = key === dateKey(selected), current = d.getMonth() === cursor.getMonth(); return <button key={i} className={`calendar-day ${active ? 'active' : ''} ${current ? '' : 'outside'}`} onClick={() => setSelected(d)}><span className="day-number">{d.getDate()}</span><div>{list.slice(0, 3).map(e => <span className={`event-chip ${CATEGORY_CLASS[e.category]}`} key={e.id}>{e.time} {e.title}</span>)}</div>{list.length > 3 && <small>+{list.length - 3} more</small>}</button>; })}</div></section>
    </main>

    <aside className="assistant-panel">
      <div className="assistant-head"><div className="buddy-orb"><span /></div><div><span>PERSONAL AI AGENT</span><h2>CalBuddy</h2></div></div>
      <p className="assistant-copy">AI scheduling requires the hosted Higgsfield backend. You can add events manually in this local copy.</p>
      <Textarea label="What should I add?" rows={4} value={assistant} onChange={e => setAssistant(e.target.value)} placeholder="Dinner with Alex Friday at 7:30 PM" disabled={true} description={!signedIn ? 'Sign in to let CalBuddy create private events for you.' : undefined}/>
      {signedIn ? <Button variant="marketingPrimary" size="lg" onClick={() => void askAssistant()} disabled={true} start={<Icon as={Sparkles} size="sm"/>}>Ask CalBuddy</Button> : <a className="assistant-signin" href="/__auth/login?return=/">Sign in to use CalBuddy</a>}
      {assistantStatus && <p className="assistant-status" role="status">{assistantStatus}</p>}
      <div className="manual-divider"><span>or add manually</span></div>
      <Input label="Event name" value={title} onChange={e => setTitle(e.target.value)} placeholder="Training session" disabled={!signedIn}/>
      <div className="manual-row"><Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} disabled={!signedIn}/><label className="category-field"><span>Type</span><select value={category} onChange={e => setCategory(e.target.value)} disabled={!signedIn}><option value="normal">Normal</option><option value="fire">Fire</option><option value="water">Water</option><option value="electric">Electric</option><option value="grass">Grass</option></select></label></div>
      <Button variant="secondary" size="lg" onClick={() => void addEvent()} disabled={!signedIn || busy || !title.trim()} start={<Icon as={Plus} size="sm"/>}>Create event</Button>
      <div className="privacy-note"><Icon as={CalendarDays} size="sm"/><span>{!signedIn ? 'Anyone can view the site. Sign in to get your own private calendar.' : loading ? 'Loading your private events…' : 'Events are saved in this browser only.'}</span></div>
    </aside>
  </div>;
}
