import { createContext, useState, useEffect } from 'react';
import { events as defaultEvents } from '../data/events';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('biletbul_events');
    if (saved) {
      return JSON.parse(saved);
    }
    // Veriye saat ve açıklama alanı ekleyerek başlat
    return defaultEvents.map(e => ({
      ...e,
      time: "21:00",
      description: `${e.name}, ${e.date} tarihinde ${e.venue} sahnesinde sizlerle buluşuyor. ${e.artist} performansıyla gerçekleşecek bu unutulmaz geceyi kaçırmayın.`
    }));
  });

  useEffect(() => {
    localStorage.setItem('biletbul_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};
