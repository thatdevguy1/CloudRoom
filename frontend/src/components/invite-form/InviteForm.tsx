import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { claimInvite } from "@/utils/invite";
import { useState } from "react";

function InviteForm() {
  const [inviteKey, setInviteKey] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      claimInvite(inviteKey);
    } catch (error) {
      setError("Error claiming invite: " + error);
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
      <span className="font-red">{error}</span>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default InviteForm;
