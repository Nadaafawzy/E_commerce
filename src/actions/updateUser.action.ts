"use server"

export async function updateUserAction(userData: { name: string, email: string, phone: string }, token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/updateMe`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        token: token,
        "Content-Type": "application/json"
      }
    });
    
    // Safely handle empty responses or non-JSON responses
    const data = await response.json().catch(() => ({}));
    
    // If we're getting an empty object but a successful status, we might need to handle it differently
    // However, if it's an error, we want to know the status code
    if (!response.ok && Object.keys(data).length === 0) {
      return { status: "error", message: `API returned ${response.status} with no details` };
    }
    
    return data;
  } catch (error) {
    console.error("updateUserAction error:", error);
    return { status: "error", message: "Failed to connect to the server" };
  }
}
