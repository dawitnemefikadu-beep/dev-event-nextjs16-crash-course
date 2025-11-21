import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';

// Type definition for route params
type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * @param request - Next.js request object
 * @param context - Route context containing dynamic params
 * @returns JSON response with event data or error message
 */
export async function GET(
    request: NextRequest,
    context: RouteParams
): Promise<NextResponse> {
    try {
        // Connect to database
        await connectDB();

        // Extract slug from route parameters
        const { slug } = await context.params;

        // Validate slug parameter exists
        if (!slug || slug.trim() === '') {
            return NextResponse.json(
                { message: 'Invalid or missing slug parameter' },
                { status: 400 }
            );
        }

        // Sanitize and query event by slug
        const sanitizedSlug = slug.trim().toLowerCase();
        const event = await Event.findOne({ slug: sanitizedSlug }).lean<IEvent>();

        // Handle event not found
        if (!event) {
            return NextResponse.json(
                { message: `Event with slug '${slug}' not found` },
                { status: 404 }
            );
        }

        // Return successful response with event data
        return NextResponse.json(
            { message: 'Event fetched successfully', event },
            { status: 200 }
        );
    } catch (error) {
        // Log error for debugging (server-side only)
        console.error('Error fetching event by slug:', error);

        // Handle database connection errors
        if (error instanceof Error && error.message.includes('MONGODB_URI')) {
            return NextResponse.json(
                { message: 'Database configuration error', error: 'Unable to connect to database' },
                { status: 500 }
            );
        }

        // Handle mongoose validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { message: 'Validation error', error: error.message },
                { status: 400 }
            );
        }

        // Handle unexpected errors
        return NextResponse.json(
            { message: 'An unexpected error occurred while fetching the event' },
            { status: 500 }
        );
    }
}
