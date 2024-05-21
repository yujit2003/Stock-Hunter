import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { email, watchList } = await req.json();

    if (!Array.isArray(watchList) || !watchList.every(item => typeof item === 'string')) {
      return NextResponse.json({ error: "Invalid watchList format" }, { status: 400 });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found, return an error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(watchList)

    // Update the user's watchList
    user.watchList = watchList;

    // Save the updated user document
    await user.save();

    // Return the updated watchList
    return NextResponse.json({ watchList: user.watchList });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
