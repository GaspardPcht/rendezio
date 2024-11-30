import React from "react";

export default function Home() {
  return (
    <div>
      <a
        href="/signin"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Connecter
      </a>
      <a
        href="/signup"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Inscription
      </a>
      <a
        href="/signupPraticien"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Inscription Praticien
      </a>
    </div>
  );
}