import { Outlet } from "react-router";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Outlet />
    </div>
  );
}
