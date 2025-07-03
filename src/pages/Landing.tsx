import Footer from "../components/Footer.tsx";

function Landing() {
    return (
        <div className="h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Main content centered */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-0">
                <div className="text-center max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <div className="mb-6 sm:mb-8 md:mb-10">
                        <div className=" mx-auto flex items-center justify-center">
                            <img
                                className={"w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"}
                                src={"/site_logo.svg"}
                                alt={`logo`}/>
                        </div>
                    </div>

                    {/* Purpose message */}
                    <div className="mb-6 sm:mb-8 md:mb-10 px-2">
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black leading-relaxed font-light">
                            Firstly, this is a selfish project. I want your music recommendations but
                            in exchange you get a song from me.
                        </p>
                        <p className="pt-5 text-xs sm:text-sm md:text-base lg:text-lag text-gray-400 leading-relaxed font-light">
                            Disclaimer: I will rate your suggestions
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div>
                        <a
                            href="/home"
                            className="inline-block bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base md:text-lg font-medium hover:shadow-lg transform hover:scale-105"
                        >
                            Proceed lil bro
                        </a>
                    </div>
                </div>
            </main>

           <Footer />

        </div>
    );
}

export default Landing;