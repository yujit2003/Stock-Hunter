import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();

    // Parse the query parameters to get the email
    const email = new URL(req.url).searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("_id name email watchList");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(user)
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
