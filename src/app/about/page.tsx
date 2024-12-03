import Link from "next/link";

export default function About(){
  return(
    <div>
      <p>This is the About Page</p>
      <Link href="/">
        Home
      </Link>
    </div>
  )
}