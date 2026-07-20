import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import ChatBox from "../../components/ChatBox";

export default async function ChatPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <ChatBox />
    </>
  );
}
