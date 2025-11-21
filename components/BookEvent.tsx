'use client';
import React, {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({eventId, slug}:{eventId:string; slug:string;}) => {

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        
        const {success, error: bookingError}= await createBooking({eventId, email});
        if(success){
            setSubmitted(true);
            posthog.capture('event_booked', {eventId, slug, email})
        }else {
            console.error('Booking creation failed', bookingError);
            setError('Failed to create booking. You may have already booked this event.');
            posthog.captureException(bookingError);
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm text-green-600">Thank you for signing up! Check your email for confirmation.</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email" 
                            placeholder="Enter Your Email Address"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
