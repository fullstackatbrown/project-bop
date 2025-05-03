export default function Footer() {
  return (
    <footer className="text-black py-6 mt-auto">
      <div className="mx-auto px-10 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright */}
        <div className="text-center md:text-left mt-4 md:mt-0">
          <p className="text-sm">© 2025 Brown Opinion Project </p>
        </div>

        {/* Links to Socials */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          {/* Twitter */}
          <a
            href="https://x.com/brownu_opinion"
            className="flex items-center justify-center text-center text-white bg-black rounded-full hover:text-blue-500 w-10 h-10"
          >
            <img
              src="/twitter-icon.png"
              alt="instagram icon"
              className="w-1/3 h-auto"
            />
          </a>
          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@brownopinionproject"
            className="flex items-center justify-center text-center text-white bg-black rounded-full hover:text-blue-500 w-10 h-10"
          >
            <img
              src="/tiktok-icon.png"
              alt="instagram icon"
              className="w-1/3 h-auto"
            />
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/brownopinionproject/?hl=en"
            className="flex items-center justify-center text-center bg-black rounded-full hover:text-blue-500 w-10 h-10"
          >
            <img
              src="/instagram-icon.png"
              alt="instagram icon"
              className="w-1/3 h-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
