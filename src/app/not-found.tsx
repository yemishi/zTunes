import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-screen flex items-center justify-center text-center bg-gradient-to-br from-black via-black-550 to-[#5a3825] text-white md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
            <div className="px-6 py-8 rounded-lg shadow-lg bg-[#5a3825] bg-opacity-90">
                <h1 className="text-4xl lg:text-5xl font-bold font-lato text-[#ff8c42]">
                    🎵 Offbeat and Out of Tune: 404 Error 🎶
                </h1>

                <p className="text-[#ffdbc1] px-4 my-6 max-w-3xl mx-auto md:text-lg lg:text-xl">
                    Looks like you’ve wandered off the track. Don’t worry, let’s get you back to the groove.
                    Head over to our homepage and keep the rhythm alive!
                </p>

                <Link
                    href="/"
                    className="bg-[#ff8c42] text-black font-bold hover:bg-[#e67a3b] active:bg-[#ff9c50] transition duration-200 py-3 px-6 rounded-lg shadow-md text-lg"
                >
                    Back to the Music
                </Link>

                <div className="mt-8">
                    <p className="text-sm text-[#ffdbc1] italic">
                        "Where words fail, music speaks." — Hans Christian Andersen
                    </p>
                </div>
            </div>
        </div>
    );
}
