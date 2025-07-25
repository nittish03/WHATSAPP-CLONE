import { prismaDB } from "@/lib/prismaDB";
import { OTPHandler } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { message: "Missing value email" },
      { status: 422 }
    );
  }

  const nonVerifiedUser = await prismaDB.nonVerifiedUser.findUnique({
    where: { email }
  });
  if (!nonVerifiedUser) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 404 }
    );
  }

  // Check if there is still valid time on the previous OTP
  // Defensive: check if otpExpiry is defined
  if (
    nonVerifiedUser.otpExpiry &&
    nonVerifiedUser.otpExpiry.getTime() > Date.now()
  ) {
    const timeDifference =
      (nonVerifiedUser.otpExpiry.getTime() - Date.now()) / 1000;
    return NextResponse.json(
      {
        message: `OTP already sent, please check your email or wait ${Math.ceil(
          timeDifference
        )} seconds before resending OTP`
      },
      { status: 429 }
    );
  }

  try {
    const otpClient = new OTPHandler(email);
    const otp = otpClient.getOTP();
    const otpExpiry = new Date(Date.now() + 60 * 1000); // 1 minute expiry

    await prismaDB.nonVerifiedUser.update({
      where: { id: nonVerifiedUser.id },
      data: {
        otp,
        otpExpiry
      }
    });

    await otpClient.sendOTP();

    return NextResponse.json(
      { message: "OTP sent, check your email", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
