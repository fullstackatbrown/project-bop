import { publicUrl } from "../publicUrl";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#F5F7FA] to-white text-black py-6 mt-auto">
            <div className=" mx-auto px-10 flex flex-col gap-2 md:flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-[5px]">
                    <div className="text-sm">
                        Developed by{" "}
                        <a
                            href="https://www.fullstackatbrown.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#327475] transition-colors duration-300 font-semibold"
                        >
                            Full Stack at Brown
                        </a>
                    </div>
                    <img src={publicUrl("/fsab-circle.png")} alt="fsab logo" className="w-5 h-auto" />
                </div>

                {/* Copyright */}
                <div className="text-center md:text-left ">
                    <p className="text-sm">© 2025 Brown Opinion Project </p>
                </div>

                {/* Links to Socials */}
                <div className="flex space-x-6 mt-2 md:mt-0">
                    {/* Twitter */}
                    <a
                        href="https://x.com/brownu_opinion"
                        className="flex items-center justify-center text-center text-white bg-black rounded-full hover:text-blue-500 w-10 h-10"
                    >
                        <img
                            src={publicUrl("/twitter-icon.png")}
                            alt="twitter icon"
                            className="w-1/3 h-auto"
                        />
                    </a>
                    {/* TikTok */}
                    <a
                        href="https://www.tiktok.com/@brownopinionproject"
                        className="flex items-center justify-center text-center text-white bg-black rounded-full hover:text-blue-500 w-10 h-10"
                    >
                        <img
                            src={publicUrl("/tiktok-icon.png")}
                            alt="tiktok icon"
                            className="w-1/3 h-auto"
                        />
                    </a>
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/brownopinionproject/?hl=en"
                        className="flex items-center justify-center text-center bg-black rounded-full hover:text-blue-500 w-10 h-10"
                    >
                        <img
                            src={publicUrl("/instagram-icon.png")}
                            alt="instagram icon"
                            className="w-1/3 h-auto"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
