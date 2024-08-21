import Image from "next/image";
import React from "react";

const LandingFeatures = () => {
  return (
    <div
      id="features"
      className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 text-black -mt-72 z-10 relative bg-white rounded-tl-3xl rounded-tr-3xl min-h-screen"
    >
      <div className="flex flex-col gap-y-4 text-center mt-12">
        <h5 className="text-gray-500 font-semibold text-lg md:text-xl">
          Features
        </h5>
        <h2 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
          Dictate, Document, Deliver! <br />
          Simplify Police Reporting with AI.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row w-full bg-[#EFF2FB] rounded-3xl p-4 mt-12 drop-shadow-lg">
        <div className="w-full md:w-1/2 p-4">
          <Image
            src={"/pic1.jpg"}
            width={230}
            height={230}
            alt="pic1"
            className="rounded-tl-3xl rounded-tr-3xl mx-auto md:mx-0"
          />
        </div>
        <div className="w-full md:w-1/2 px-4 md:px-12 flex items-center">
          <div className="w-full flex flex-col items-center justify-center gap-y-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
              Accurate reporting as per your department guidelines.
            </h1>
            <p className="text-gray-500 font-light text-center">
              Our platform ensures precise documentation aligned with your
              department's protocols and guidelines.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full bg-[#EFF2FB] rounded-3xl p-4 mt-12 drop-shadow-lg">
        <div className="w-full md:w-1/2 px-4 md:px-12 flex items-center">
          <div className="w-full flex flex-col items-center justify-center gap-y-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
              Voice-Powered Efficiency Streamline Your Narrations
            </h1>
            <p className="text-gray-500 font-light text-center">
              Experience the future of documentation with our advanced
              voice-powered platform.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4 flex justify-center md:justify-end">
          <Image
            src={"/pic2.jpg"}
            width={260}
            height={260}
            alt="pic2"
            className="rounded-bl-3xl rounded-br-3xl"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full bg-[#EFF2FB] rounded-3xl p-4 mt-12 drop-shadow-lg">
        <div className="w-full md:w-1/2 p-4">
          <Image
            src={"/pic3.png"}
            width={260}
            height={260}
            alt="pic3"
            className="rounded-tl-3xl rounded-tr-3xl mx-auto md:mx-0"
          />
        </div>
        <div className="w-full md:w-1/2 px-4 md:px-12 flex items-center">
          <div className="w-full flex flex-col justify-center gap-y-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
              Copy, Regenerate, and Export with Ease
            </h1>
            <p className="text-gray-500 font-light text-center">
              Effortlessly manage reports with our comprehensive tools:
              duplicate for editing or reference, update content with AI
              precision, and export seamlessly in DOCX and PDF formats for easy
              sharing and archival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingFeatures;
