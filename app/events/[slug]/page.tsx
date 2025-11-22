import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function EventDetailsPage({ params }: PageProps) {
    const { slug } = params;

    return (
        <main>
            <Suspense fallback={"...loading"}>
                <EventDetails slug={slug} />
            </Suspense>
        </main>
    );
}
