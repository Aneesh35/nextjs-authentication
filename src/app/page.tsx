import Link from "next/link";
export default function Home() {
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="w-56 flex justify-around bg-white p-4 rounded-md text-black">
        <Link href={"/signup"} className="hover:text-blue-600">Signup</Link>
        <Link href={"/login"} className="hover:text-blue-600">LogIn</Link>
      </div>
    </div>
  );
}
