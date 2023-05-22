import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function NotificationPage() {
  const [count, setCount] = useState(0)
  const [tokens, setTokens] = useState([])
  const [formData, setFormData] = useState({ title: '', message: '', data: { screen: '', updateLink: '' } });

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await axios.get('https://prayse.herokuapp.com/tokens')
      setTokens(res.data)
    }
    fetchTokens()

  }, [])

  const handleTitleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleMessageChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        [name]: value
      }
    }));
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(formData)
    axios.post('https://prayse.herokuapp.com/message', {
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: formData,
    })
    setFormData({ title: '', message: '', data: { screen: '', updateLink: '' } })
  }

  console.log(formData)

  return (
    <div className="App">
      <form className='noti-form' onSubmit={handleSubmit}>
        <input name='title' value={formData.title} onChange={handleTitleChange} type="text" placeholder='Enter title' />
        <input name='message' value={formData.message} onChange={handleMessageChange} type="text" placeholder='Enter message' />
        <input name='screen' value={formData.data.screen} onChange={handleInputChange} type="text" placeholder='Enter screen' />
        <input name='updateLink' value={formData.data.updateLink} onChange={handleInputChange} type="text" placeholder='new update?' />
        <button type='submit'>Send notification</button>
      </form>
      <div className='count'>
        <h3>Subscriber count:</h3>
        <span> {tokens.length}</span>
      </div>
    </div>
  )
}

export default NotificationPage
