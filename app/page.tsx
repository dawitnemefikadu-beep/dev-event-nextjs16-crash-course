import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function Page() {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });

    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev <br />Event You Can not Miss
            </h1>
            <p className="text-center mt-5">
                Hackathons, Meetups, and Conferences, All in one place
            </p>
            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>
                <ul className="events">
                    {events.map((event) => (
                        <li key={event._id.toString()} className="list-none">
                            <EventCard {...event.toObject()} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
