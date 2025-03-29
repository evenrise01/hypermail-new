import { getAccountDetails, exchangeCodeForAccessToken } from "@/lib/aurinko";
import { waitUntil } from "@vercel/functions";
import { db } from "@/server/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  if (!clerkUser || !clerkUser.emailAddresses[0]?.emailAddress) {
    return NextResponse.json({ error: "UNAUTHORIZED - No user data" }, { status: 401 });
  }

  // Fetch or create user in Prisma based on Clerk email
  let prismaUser = await db.user.findFirst({
    where: { emailAddress: clerkUser.emailAddresses[0]?.emailAddress },
  });

  if (!prismaUser) {
    prismaUser = await db.user.create({
      data: {
        emailAddress: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName || "Unknown",
        lastName: clerkUser.lastName || "User",
        imageUrl: clerkUser.imageUrl || null,
      },
    });
  }

  const params = req.nextUrl.searchParams;
  if (params.get("status") !== "success") {
    return NextResponse.json({ error: "Account connection failed" }, { status: 400 });
  }

  const code = params.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const token = await exchangeCodeForAccessToken(code);
  if (!token || !token.accountId) {
    return NextResponse.json({ error: "Failed to fetch token or account ID" }, { status: 400 });
  }

  console.log("----Token.AccountId-----", token.accountId.toString());

  const accountDetails = await getAccountDetails(token.accessToken);

  // Check if an account already exists with a different userId
  const existingAccount = await db.account.findUnique({
    where: { id: token.accountId.toString() },
  });

  if (existingAccount && existingAccount.userId !== prismaUser.id) {
    return NextResponse.json({ error: "Account already linked to another user" }, { status: 400 });
  }

  // Upsert account
  await db.account.upsert({
    where: { id: token.accountId.toString() },
    create: {
      id: token.accountId.toString(),
      userId: prismaUser.id,
      accessToken: token.accessToken,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
    update: {
      accessToken: token.accessToken,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
  });

  // Trigger initial sync
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId: prismaUser.id,
      })
      .then((res) => console.log("Initial Sync triggered:", res.data))
      .catch((err) => console.log("Initial Sync failed:", err.response?.data))
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
