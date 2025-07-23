import React, { useEffect, useState } from 'react';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/tickets/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        } else {
          setError('Failed to fetch tickets');
        }
      } catch (err) {
        setError('Error fetching tickets');
      }
      setLoading(false);
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Ticket List</h2>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <ul>
          {tickets.length === 0 ? <li>No tickets found.</li> : tickets.map(ticket => (
            <li key={ticket._id}>
              <strong>{ticket.title}</strong>: {ticket.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList; 