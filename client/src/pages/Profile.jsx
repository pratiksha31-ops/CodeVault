import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 p-5">
        <Link
          to="/dashboard"
          className="text-blue-400"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>

          <h1 className="text-3xl font-bold mt-5">
            {user?.name}
          </h1>

          <p className="text-gray-400">
            @{user?.username}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-800 p-5 rounded-xl">
              <p className="text-gray-400">
                Repositories
              </p>
              <p className="text-2xl font-bold">
                0
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl">
              <p className="text-gray-400">
                Followers
              </p>
              <p className="text-2xl font-bold">
                0
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl">
              <p className="text-gray-400">
                Following
              </p>
              <p className="text-2xl font-bold">
                0
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;