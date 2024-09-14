import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = auth(async (req) => {
  try {
    // Get session using the auth middleware
    if(!req.auth){
      return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
    }
    const userId = req.auth.user.id // Assuming `id` exists on session.user

    await dbConnect();

    const userData = await User.findById(new Types.ObjectId(userId)).exec();
    
    if (!userData) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Successfully fetched user data', userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Error getting user data", error }, { status: 500 });
  }
});