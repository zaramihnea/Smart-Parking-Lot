

export default function Navbar() {
  return (
    <nav className="bg-navbarBg w-full h-16 rounded-lg flex justify-around items-center shadow-xl">
      <a href="/" className="flex flex-col items-center justify-center">
        <img src="/navbar/HomeIcon.svg" alt="home" />
        Home
      </a>
      <a href="/profile" className="flex flex-col items-center justify-center">
        <img src="/navbar/ProfileIcon.svg" alt="profile" />
        Profile
      </a>
      <a href="/wallet" className="flex flex-col items-center justify-center">
        <img src="/navbar/WalletIcon.svg" alt="wallet" />
        Wallet
      </a>
      <a href="/settings" className="flex flex-col items-center justify-center">
        <img src="/navbar/SettingIcon.svg" alt="settings" />
        Settings
      </a>
      <a href="/help" className="flex flex-col items-center justify-center">
        <img src="/navbar/HelpIcon.svg" alt="help" />
        Help
      </a>
    </nav>
  );
}
