'use client'

import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import Image from 'next/image'
import { useState } from "react";

export default function MyPositions() {
  const protocols = ["Ekubo"];
  const [protocol, setProtocol] = useState("Ekubo");

  function handleProtocolChange(pProtocol: string) {
    setProtocol(pProtocol)
  }

  return (
    <div className="min-h-screen p-6">
      <Navbar></Navbar>

      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl mb-6">Select the protocol</h1>

          <div className="flex gap-4 mb-12">
            {protocols.map((p) => (
              <button 
                key={p}
                onClick={() => handleProtocolChange(p)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
                  ${protocol === p ? 'bg-zinc-800' : 'bg-zinc-900'} 
                  ${protocol === p ? 'border border-white' : ''} 
                  hover:bg-zinc-700`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={`/images/${p}Logo.png`}
                    width={30}
                    height={30}
                    alt={`${p} logo`}
                    className="pointer-events-none"
                  />
                </div>
                <span>{p}</span>
              </button>
            ))}
          </div>

          <div className="border border-gray-500 rounded-2xl p-12 flex items-center justify-center">
            <p className="text-xl text-gray-300">You do not have any active positions.</p>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}