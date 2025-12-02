import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { useNotificationStore } from "./store/notificationStore";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function NotificationPage() {
  const [tokens, setTokens] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    data: { screen: "", updateLink: "", anyLink: "" },
  });
  const [scheduleData, setScheduleData] = useState({
    dayOfWeek: 0,
    hour: 12,
    minute: 0,
  });

  const {
    scheduledNotifications,
    addScheduledNotification,
    removeScheduledNotification,
  } = useNotificationStore();

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await axios.get(import.meta.env.VITE_API_TOKENS, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_SECRET,
        },
      });
      setTokens(res.data);
    };
    fetchTokens();
  }, []);

  const handleTitleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMessageChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        [name]: value,
      },
    }));
  };

  const handleScheduleChange = (event) => {
    const { name, value } = event.target;
    setScheduleData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title || !formData.message || !formData.data.screen) {
      return;
    }

    const scheduledPayload = {
      ...formData,
      schedule: {
        dayOfWeek: scheduleData.dayOfWeek,
        hour: scheduleData.hour,
        minute: scheduleData.minute,
        tz: "America/Los_Angeles",
      },
    };

    // Add to local store for tracking
    addScheduledNotification({
      title: formData.title,
      message: formData.message,
      screen: formData.data.screen,
      dayOfWeek: scheduleData.dayOfWeek,
      hour: scheduleData.hour,
      minute: scheduleData.minute,
    });

    // Send to backend
    axios.post(import.meta.env.VITE_API_VERSE_SCHEDULE, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: scheduledPayload,
    });

    setFormData({
      title: "",
      message: "",
      data: { screen: "", updateLink: "", anyLink: "" },
    });
  }

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const getDayName = (dayValue) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayValue)?.label || "";
  };

  console.log(tokens);

  return (
    <div className="App">
      <form className="noti-form" onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          required
          onChange={handleTitleChange}
          type="text"
          placeholder="Enter title"
        />

        <input
          name="message"
          value={formData.message}
          required
          onChange={handleMessageChange}
          type="text"
          placeholder="Enter message"
        />
        <input
          name="screen"
          value={formData.data.screen}
          required
          onChange={handleInputChange}
          type="text"
          placeholder="Enter screen"
        />
        <input
          name="anyLink"
          value={formData.data.anyLink}
          onChange={handleInputChange}
          type="text"
          placeholder="Enter any link..."
        />
        <input
          name="updateLink"
          value={formData.data.updateLink}
          onChange={handleInputChange}
          type="text"
          placeholder="new update?"
        />

        <div className="schedule-section">
          <h4>Schedule Notification</h4>
          <div className="schedule-inputs">
            <div className="schedule-field">
              <label htmlFor="dayOfWeek">Day</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={scheduleData.dayOfWeek}
                onChange={handleScheduleChange}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="schedule-field">
              <label htmlFor="hour">Hour</label>
              <select
                id="hour"
                name="hour"
                value={scheduleData.hour}
                onChange={handleScheduleChange}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <div className="schedule-field">
              <label htmlFor="minute">Minute</label>
              <select
                id="minute"
                name="minute"
                value={scheduleData.minute}
                onChange={handleScheduleChange}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit">Schedule notification</button>
      </form>

      <div className="count">
        <h3>Subscriber count:</h3>
        <span>{tokens.length}</span>
      </div>

      <div className="scheduled-list">
        <h3>Scheduled Notifications ({scheduledNotifications.length})</h3>
        {scheduledNotifications.length === 0 ? (
          <p className="no-scheduled">No scheduled notifications yet.</p>
        ) : (
          <ul>
            {scheduledNotifications.map((notification) => (
              <li key={notification.id} className="scheduled-item">
                <div className="scheduled-info">
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <span className="scheduled-time">
                    {getDayName(notification.dayOfWeek)} at{" "}
                    {formatTime(notification.hour, notification.minute)}
                  </span>
                  <span className="scheduled-screen">
                    Screen: {notification.screen}
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeScheduledNotification(notification.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
