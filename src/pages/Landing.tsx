function Landing() {
    return (
        <div className="h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Main content centered */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-0">
                <div className="text-center max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <div className="mb-6 sm:mb-8 md:mb-10">
                        <div className=" mx-auto flex items-center justify-center">
                            <img
                                className={"w-20 h-10 sm:w-24 sm:h-14 md:w-28 md:h-18 lg:w-32 lg:h-22"}
                                src={"/site_logo_2.png"}
                                alt={`logo`}/>
                        </div>
                    </div>

                    {/* Purpose message */}
                    <div className="mb-6 sm:mb-8 md:mb-10 px-2">
                        <p className="text-xs sm:text-sm md:text-base lg:text-xl text-black leading-tight font-light text-left pb-15">
                            Firstly, this is a selfish project as it's meant for me and less for you all.
                            Now lets make a unfair trade. You get a song from me and in exchange I
                            get recommendations from you. I will rate these recommendations so put me on game.
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lag text-gray-400 leading-relaxed font-light text-right">
                            ~ Terence, Mastermind
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

        </div>
    );
}

export default Landing;