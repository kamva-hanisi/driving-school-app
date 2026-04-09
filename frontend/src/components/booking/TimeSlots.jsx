import { useEffect, useState } from "react";
import API from "../../services/api";

export default function TimeSlots({ date, selectedTime, setTime }) {
  const [unavailable, setUnavailable] = useState([]);

  const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  useEffect(() => {
    if (!date) return;

    API.get(`/bookings/unavailable?date=${date}`).then((res) =>
      setUnavailable(res.data),
    );
  }, [date]);

  return (
    <div className="time-slots">
      {slots.map((time) => (
        <button
          key={time}
          className={[
            unavailable.includes(time) ? "disabled" : "",
            selectedTime === time ? "selected" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={unavailable.includes(time)}
          onClick={() => setTime(time)}
          type="button"
        >
          {time}
        </button>
      ))}
    </div>
  );
}
