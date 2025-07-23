import React, { useState } from 'react';

const TicketSubmission = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setMessage('Ticket submitted successfully!');
        setTitle('');
        setDescription('');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to submit ticket');
      }
    } catch (err) {
      setMessage('Error submitting ticket');
    }
  };

  return (
    <div>
      <h2>Submit a Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TicketSubmission; 