import { useEffect, useState } from "react";
import API from "../../services/api";

export default function TimeSlots({ date, selectedTime, setTime }) {
  const [unavailable, setUnavailable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  useEffect(() => {
    if (!date) {
      setUnavailable([]);
      setError("");
      return;
    }

    let ignore = false;

    const loadUnavailableSlots = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await API.get(`/bookings/unavailable?date=${date}`);

        if (!ignore) {
          setUnavailable(res.data);
        }
      } catch {
        if (!ignore) {
          setUnavailable([]);
          setError("Unable to load time slots right now.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadUnavailableSlots();

    return () => {
      ignore = true;
    };
  }, [date]);

  return (
    <div className="time-slots-wrap">
      {isLoading ? <p className="field__hint">Loading available slots...</p> : null}
      {error ? <p className="form-status form-status--error">{error}</p> : null}
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
            disabled={isLoading || unavailable.includes(time)}
            onClick={() => setTime(time)}
            type="button"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
