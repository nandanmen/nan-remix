import { Link } from "remix";

export default function Home() {
  return (
    <div>
      <h1>Hello!</h1>
      <ul>
        <li>
          <Link to="letters">Newsletters</Link>
        </li>
      </ul>
    </div>
  );
}
