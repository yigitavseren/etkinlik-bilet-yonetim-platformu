import { createContext, useState, useEffect } from 'react';

export const EventContext = createContext();

const API_URL = "http://localhost:5196/api";

const getToken = () => {
  const user = localStorage.getItem('biletbul_user');
  return user ? JSON.parse(user).token : null;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const etkinlikleriYukle = async () => {
      try {
        const res = await fetch(`${API_URL}/Etkinlik`);
        if (res.ok) {
          const data = await res.json();
          if (data.length === 0) {
            const { events: defaultEvents } = await import('../data/events');
            setEvents(defaultEvents.map(e => ({
              ...e,
              time: e.time || "21:00",
              description: e.description || `${e.name}, ${e.date} tarihinde ${e.venue} sahnesinde.`
            })));
          } else {
            setEvents(data.map(e => ({
              id: e.id,
              name: e.ad,
              venue: e.mekan,
              category: e.kategori || "konser",
              date: new Date(e.tarih).toLocaleDateString("tr-TR"),
              time: new Date(e.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
              price: e.fiyat,
              totalSeats: e.toplamKoltuk,
              soldSeats: e.satirlanKoltuk,
              status: e.durum,
              description: e.aciklama,
              image: e.resimUrl,
            })));
          }
        }
      } catch (err) {
        console.error("API'ye ulaşılamadı:", err);
        const { events: defaultEvents } = await import('../data/events');
        setEvents(defaultEvents.map(e => ({
          ...e,
          time: e.time || "21:00",
          description: e.description || `${e.name}, ${e.date} tarihinde ${e.venue} sahnesinde.`
        })));
      } finally {
        setYukleniyor(false);
      }
    };
    etkinlikleriYukle();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      const res = await fetch(`${API_URL}/Etkinlik`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ad: newEvent.name,
          mekan: newEvent.venue,
          tarih: newEvent.date,
          fiyat: newEvent.price,
          kategori: newEvent.category || "konser",
          toplamKoltuk: newEvent.totalSeats || 100,
          satirlanKoltuk: 0,
          durum: "aktif",
          aciklama: newEvent.description || "",
          resimUrl: newEvent.image || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(prev => [...prev, {
          id: data.id,
          name: data.ad,
          venue: data.mekan,
          category: data.kategori || "konser",
          date: new Date(data.tarih).toLocaleDateString("tr-TR"),
          time: new Date(data.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          price: data.fiyat,
          totalSeats: data.toplamKoltuk,
          soldSeats: data.satirlanKoltuk,
          status: data.durum,
          description: data.aciklama,
          image: data.resimUrl,
        }]);
      }
    } catch (err) {
      console.error("Etkinlik eklenemedi:", err);
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      const res = await fetch(`${API_URL}/Etkinlik/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ad: updatedEvent.name,
          mekan: updatedEvent.venue,
          tarih: updatedEvent.date,
          fiyat: updatedEvent.price,
          kategori: updatedEvent.category || "konser",
          durum: updatedEvent.status,
        }),
      });
      if (res.ok) {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      }
    } catch (err) {
      console.error("Etkinlik güncellenemedi:", err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/Etkinlik/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error("Etkinlik silinemedi:", err);
    }
  };

  return (
    <EventContext.Provider value={{ events, yukleniyor, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};