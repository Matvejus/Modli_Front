export async function getClientSession() {
    try {
      const response = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to get session")
      return await response.json()
    } catch (error) {
      console.error("Client session error:", error)
      return null
    }
  }
  
  export async function setClientAuth() {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to set auth")
      return await response.json()
    } catch (error) {
      console.error("Client auth error:", error)
      return false
    }
  }
  
  