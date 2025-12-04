import React from "react";
import Lottie from "react-lottie-player";
import loadingAnim from "../assets/Welcome.json"; // เปลี่ยนตาม path ของคุณ

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-teal-300 via-cyan-300 to-blue-200">
      <Lottie
        loop
        animationData={loadingAnim}
        play
        style={{ width: 300, height: 300 }}
      />

      <p className="text-gray-600 mt-4 text-lg font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
}