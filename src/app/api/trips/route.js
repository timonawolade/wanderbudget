import { NextResponse } from "next/server";
import { saveTrip } from "@/lib/db";

export async function POST(request) {
  try {
    const tripData = await request.json();

    if (!tripData.plan) {
      return NextResponse.json({ error: "No trip data provided" }, { status: 400 });
    }

    const tripId = await saveTrip(tripData);

    return NextResponse.json({ tripId });
  } catch (err) {
    console.error("Save trip error:", err);
    return NextResponse.json(
      { error: "Failed to save trip. Please try again." },
      { status: 500 }
    );
  }
}
