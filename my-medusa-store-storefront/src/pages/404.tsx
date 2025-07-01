import Link from "next/link"

export default function Page404() {
  return (
    <main style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh"}}>
      <h1 style={{fontSize: "2rem", marginBottom: "1rem"}}>404 – Page not found</h1>
      <Link href="/">Return to homepage</Link>
    </main>
  )
} 