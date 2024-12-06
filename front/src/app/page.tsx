
import React from "react";
import Button from "./components/Button";
import Link from "next/link";
import ConnexionGoogle from "./components/ConnexionGoogle";

export default function Home() {


  return (
    <div>
      <a
        href="/signupPraticien"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Inscription Praticien
      </a>
      <a
        href="/infosPraticien"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Infos Praticien
      </a>
      <Link
        href="/Praticien/dashboard"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Dashboard
      </Link>
      <Link
        href="/users/bookCalendar"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        RESERVE
      </Link>
      <Link
        href="/Praticien/calendar"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Calendrier
      </Link>
<ConnexionGoogle/>
</div>  
  );
}