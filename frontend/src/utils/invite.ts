import { getSessionInfo } from "./auth";

export const claimInvite = async (inviteKey: string) => {
  try {
    const sessionInfo = getSessionInfo();
    if (sessionInfo === null) throw new Error("Session info not found");
    const sessionInfoObj = JSON.parse(sessionInfo);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/claim-invite?inviteKey=${inviteKey}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": sessionInfoObj.id_token,
        },
      }
    );
    if (response.ok) {
      return response;
    }
  } catch (error) {
    console.log("Error claiming invite", error);
  }
};
