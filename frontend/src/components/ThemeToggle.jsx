import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 duration-200 cursor-pointer
        hover:scale-110 active:scale-90 rounded-full
        bg-gray-200 dark:bg-gray-700 shadow-md"
    >
      {dark ? (
        <SunIcon className="h-6 w-6 text-yellow-400" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-900" />
      )}
    </button>
  );
}
