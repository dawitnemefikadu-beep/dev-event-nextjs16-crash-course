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
 * Fetches a single events by its slug
 * @param request - Next.js request object
 * @param context - Route context containing dynamic params
 * @returns JSON response with events data or error message
 */
export async function GET(
    request: NextRequest,
    {params} : RouteParams
): Promise<NextResponse> {
    try {
        await connectDB();
        // Extract slug from route parameters
        const { slug } = await params;

        // Validate slug parameter exists
        if (!slug || slug.trim() === '') {
            return NextResponse.json(
                { message: 'Invalid or missing slug parameter' },
                { status: 400 }
            );
        }

        // Validate slug format (lowercase alphanumeric with hyphens)
        const sanitizedSlug=slug.trim().toLowerCase();
        const event = await Event.findOne({slug: sanitizedSlug}).lean();
        if (!event) {
            return NextResponse.json(
                { message: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Query events by slug

        // Handle events not found
        if (!event) {
            return NextResponse.json(
                { message: `Event with slug '${slug}' not found` },
                { status: 404 }
            );
        }

        // Return successful response with events data
        return NextResponse.json(
            { message: 'Event fetched successfully', event },
            { status: 200 }
        );
    } catch (error) {
        if(process.env.NODE_ENV == 'development') {
            console.error('Error fetching events by slug:', error);

        }
        // Log error for debugging (server-side only)


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
            { message: 'An unexpected error occurred while fetching the events' },
            { status: 500 }
        );
    }
}
