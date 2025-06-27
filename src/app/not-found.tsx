import { Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div
        className={`container mx-auto min-h-svh flex-col items-center justify-center space-y-6 p-6 md:p-15`}
      >
        <h2 className={`text-center text-7xl font-extrabold`}>Oops!</h2>
        <h3 className="text-center text-xl font-medium">Page Not Found</h3>
        <div className="flex items-center justify-center p-7">
          <Image
            src="/not-found.svg"
            alt="logo"
            width={500}
            height={213}
            style={{ objectFit: "contain" }}
            priority={false}
            className="dark:opacity-80 dark:mix-blend-screen"
            loading="lazy"
          />
        </div>
        <Link
          className="pointer-events-auto text-xl font-light hover:underline"
          href="/"
        >
          <div className="flex items-center justify-center gap-1">
            <Undo2 size={26} />
            Back
          </div>
        </Link>
      </div>
    </main>
  );
}
