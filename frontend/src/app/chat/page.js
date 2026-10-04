import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
import ChatBox from "../../components/ChatBox";

export default async function ChatPage() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const guestSession = cookieStore.get("guest_session")?.value;
  
  // Allow authenticated users OR verified guest sessions
  if (!session && !guestSession) {
    redirect("/");
  }

  return (
    <>
      <ChatBox initialGuestId={guestSession || null} />
    </>
  );
}
