export default function Navbar() {
  return (
    <nav className="navbar" style={{ padding: "1rem" }}>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/auth/login">Login</a>
        </li>
        <li>
          <a href="/auth/register">Register</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
      </ul>
    </nav>
  );
}
