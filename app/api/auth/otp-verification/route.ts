import { prismaDB } from "@/lib/prismaDB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, otp } = body;

  if (!email || !otp) {
    return NextResponse.json("Missing value email or otp", { status: 422 });
  }

  const nonVerifiedUser = await prismaDB.nonVerifiedUser.findUnique({
    where: { email }
  });

  if (!nonVerifiedUser) {
    return NextResponse.json("User does not exist", { status: 400 });
  }

  // Check if otpExpiry exists and is valid
  if (!nonVerifiedUser.otpExpiry || nonVerifiedUser.otpExpiry.getTime() < Date.now()) {
    return NextResponse.json("OTP has expired, click on resend OTP", { status: 401 });
  }

  // Compare OTP after expiry check
  if (nonVerifiedUser.otp !== parseInt(otp, 10)) {
    return NextResponse.json("Invalid OTP", { status: 402 });
  }

  // Create verified user record
  await prismaDB.user.create({
    data: {
      name: nonVerifiedUser.name,
      email: nonVerifiedUser.email,
      hashedPassword: nonVerifiedUser.hashedPassword
    }
  });

  // Delete the non-verified user record
  await prismaDB.nonVerifiedUser.delete({
    where: { id: nonVerifiedUser.id }
  });

  return NextResponse.json("OTP verified", { status: 200 });
}
