import { getTrip } from "@/lib/db";
import TripView from "./TripView";

export async function generateMetadata({ params }) {
  return {
    title: "Shared Trip · Orbit Vacations",
    description: "A travel itinerary planned with Orbit Vacations",
  };
}

export default async function SharedTripPage({ params }) {
  const { id } = params;
  let trip = null;
  let error = null;

  try {
    trip = await getTrip(id);
  } catch (err) {
    error = "Could not load this trip.";
  }

  return <TripView trip={trip} error={error} tripId={id} />;
}
