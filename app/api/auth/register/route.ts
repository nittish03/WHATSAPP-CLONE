import { prismaDB } from "@/lib/prismaDB";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { OTPHandler } from "@/lib/sendEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing value name, email or password" },
        { status: 422 }
      );
    }

    // Check if user already exists
    const userExist = await prismaDB.user.findUnique({ where: { email } });
    if (userExist) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otpClient = new OTPHandler(email);
    const otp = String(otpClient.getOTP()).padStart(6, "0"); // ensure string, 6 digits
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    // Upsert non-verified user
    await prismaDB.nonVerifiedUser.upsert({
      where: { email },
      create: {
        name: username, // use .name if your db schema expects that
        email,
        hashedPassword,
        otp: parseInt(otp),
        otpExpiry,
      },
      update: {
        name: username,
        hashedPassword,
        otp: parseInt(otp),
        otpExpiry,
      },
    });

    // Send OTP
    // If sendOTP is async, await it
    await otpClient.sendOTP();

    return NextResponse.json({
      message: "OTP sent, check your email",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
