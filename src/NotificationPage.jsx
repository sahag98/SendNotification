import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function NotificationPage() {
  const [tokens, setTokens] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    data: { screen: "", updateLink: "", anyLink: "" },
  });

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await axios.get(import.meta.env.VITE_API_TOKENS, {
        headers: {
          // Replace 'your_secret_api_key' with the actual key you're using
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

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title || !formData.message || !formData.data.screen) {
      return;
    }

    axios.post(import.meta.env.VITE_API_MESSAGE, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: formData,
    });
    setFormData({
      title: "",
      message: "",
      data: { screen: "", updateLink: "", anyLink: "" },
    });
  }

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
        <button type="submit">Send notification</button>
      </form>
      <div className="count">
        <h3>Subscriber count:</h3>
        <span> {tokens.length}</span>
      </div>
    </div>
  );
}

export default NotificationPage;
