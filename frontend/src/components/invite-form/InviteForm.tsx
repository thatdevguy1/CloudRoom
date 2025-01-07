import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { claimInvite } from "@/utils/invite";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Message {
  text: string;
  error: boolean;
}

function InviteForm() {
  const [inviteKey, setInviteKey] = useState<string>("");
  const [message, setMessage] = useState<Message>({
    text: "",
    error: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await claimInvite(inviteKey);
      if (res && res.status === 200) {
        setMessage({
          text: "Invite claimed successfully. Enjoy 10GB of storage",
          error: false,
        });
      } else {
        setMessage({ text: "Error claiming invite", error: true });
      }
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Error claiming invite", error: true });
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInviteKey(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit} className="w-2/3 space-y-6">
      <Input
        placeholder="Invite Key"
        onChange={handleChange}
        value={inviteKey}
      />
      <p className={message.error ? "text-red-500" : "text-green-500"}>
        {message.text}
      </p>
      {loading ? (
        <Skeleton className="h-[36px] w-[78px]" />
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </form>
  );
}

export default InviteForm;
