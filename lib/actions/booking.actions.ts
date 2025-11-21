'use server';

import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";

export const createBooking = async ({eventId, email}:{eventId:string; email:string})=> {
    try {
        await connectDB();
        const booking = await Booking.create({eventId, email});
        
        // Convert Mongoose document to plain object for client components
        const plainBooking = {
            _id: booking._id.toString(),
            eventId: booking.eventId.toString(),
            email: booking.email,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
        };
        
        return {success: true, booking: plainBooking};
    }catch (e) {
        console.error('create booking failed', e);
        // Return serializable error message
        const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
        return {success: false, error: errorMessage};
    }
}
