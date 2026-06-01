import { useState, useEffect, useContext } from 'react';
import { appointmentAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [slotsRes, myBookingsRes] = await Promise.all([
                appointmentAPI.getAvailable(selectedDate),
                appointmentAPI.getMyBookings()
            ]);
            setAvailableSlots(slotsRes);
            setMyAppointments(myBookingsRes);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, selectedDate]);

    const handleBook = async (id) => {
        try {
            setActionLoading(true);
            setError('');
            await appointmentAPI.book(id);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            setActionLoading(true);
            setError('');
            await appointmentAPI.cancel(id);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Cancellation failed');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="container">
            <nav className="navbar card mb-4">
                <h2>Smart Schedule</h2>
                <div className="nav-links">
                    <span>Welcome, {user?.name}</span>
                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={logout}>Logout</button>
                </div>
            </nav>

            {error && <div className="card mb-4" style={{ borderColor: 'var(--error)' }}><div className="error-msg text-center">{error}</div></div>}

            <div className="flex gap-4">
                
                <div style={{ flex: 2 }}>
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3>Available Slots</h3>
                            <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                                min={todayStr}
                                style={{ width: 'auto' }}
                            />
                        </div>
                        
                        {loading ? (
                            <div>Loading slots...</div>
                        ) : availableSlots.length === 0 ? (
                            <p className="text-muted">No available slots for this date.</p>
                        ) : (
                            <div className="grid-cards">
                                {availableSlots.map(slot => (
                                    <div key={slot._id} className="card" style={{ padding: '1rem' }}>
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{format(new Date(slot.date), 'MMM dd, yyyy')}</div>
                                                <div className="text-muted">{slot.startTime} - {slot.endTime}</div>
                                            </div>
                                            <span className="badge badge-available">Available</span>
                                        </div>
                                        <button 
                                            className="btn btn-primary" 
                                            onClick={() => handleBook(slot._id)}
                                            disabled={actionLoading}
                                        >
                                            Book Slot
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                
                <div style={{ flex: 1 }}>
                    <div className="card">
                        <h3 className="mb-4">My Appointments</h3>
                        {loading ? (
                            <div>Loading...</div>
                        ) : myAppointments.length === 0 ? (
                            <p className="text-muted">You have no upcoming appointments.</p>
                        ) : (
                            <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                                {myAppointments.map(slot => {
                                    const slotDate = new Date(`${slot.date}T${slot.startTime}:00`);
                                    const isPast = slotDate < new Date();
                                    return (
                                        <div key={slot._id} className="card" style={{ padding: '1rem' }}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div style={{ fontWeight: '600' }}>{format(new Date(slot.date), 'MMM dd, yyyy')}</div>
                                                <span className="badge badge-booked">Booked</span>
                                            </div>
                                            <div className="text-muted mb-4">{slot.startTime} - {slot.endTime}</div>
                                            
                                            {!isPast && (
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleCancel(slot._id)}
                                                    disabled={actionLoading}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
