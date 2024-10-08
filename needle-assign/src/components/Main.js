import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Layout from "./Layout";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://dog.ceo/api/breeds/list/all";

const Main = () => {
  const navigate = useNavigate();
  const goToViewFeed = () => {
    navigate("/viewfeed");
  };

  const [user, setUser] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [error, setError] = useState("");

  // Detect auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch breeds from the API when the component mounts
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const breedList = Object.keys(data.message);
        setBreeds(breedList);
      } catch (err) {
        console.error("Error fetching breeds:", err);
      }
    };
    fetchBreeds();
  }, []);

  // Handle breed selection
  const handleBreedSelection = (breed) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter((b) => b !== breed));
    } else {
      if (selectedBreeds.length < 3) {
        setSelectedBreeds([...selectedBreeds, breed]);
        setError("");
      } else {
        setError("You can select up to 3 breeds only.");
      }
    }
  };

  // Load user data (selected breeds and liked images) from Firestore
  const loadUserData = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.selectedBreeds) {
        setSelectedBreeds(userData.selectedBreeds);
      }
    } else {
      console.log("No such document!");
    }
  };

  // Save selected breeds (you can also send this data to a backend or local storage)
  const handleSaveSelection = async () => {
    if (selectedBreeds.length > 0) {
      try {
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, { selectedBreeds }, { merge: true });
        alert("Your favorite breeds have been saved.");
      } catch (err) {
        console.error("Error saving breeds:", err);
      }
    } else {
      setError("Please select at least one breed.");
    }
  };

  return (
    <Layout
      sidebarContent={
        <>
          <Button variant="text" onClick={goToViewFeed} disabled={!user}>
            <Typography variant="h5">View Feed</Typography>
          </Button>
        </>
      }
      mainContent={
        <div>
          <div className="flex flex-row justify-between">
            <div className="w-5/6">
              <Typography
                variant="h5"
                className="ml-5 mt-5 font-semibold text-gray-700"
              >
                Select up to 3 of your favorite dog breeds:
              </Typography>
              {error && (
                <Typography variant="lead" color="red" className="ml-5 mt-5">
                  {error}
                </Typography>
              )}
              <div className="flex flex-wrap">
                {breeds.map((breed) => (
                  <div key={breed} className="w-1/5 p-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value={breed}
                        checked={selectedBreeds.includes(breed)}
                        onChange={() => handleBreedSelection(breed)}
                        className="mr-3 h-5 w-5 text-blue-500"
                      />
                      {breed}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/6">
              <Typography
                variant="h5"
                className="ml-5 mt-5 font-semibold text-gray-700"
              >
                Your Selected Breeds:
              </Typography>
              <div className="mt-6">
                {selectedBreeds.length > 0 && (
                  <>
                    <ul className="mt-4 p-4 bg-gray-300 rounded-lg space-y-2">
                      {selectedBreeds.map((breed) => (
                        <li key={breed} className="text-lg text-gray-600">
                          {breed}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="flex items-center gap-3 mt-4"
                      onClick={handleSaveSelection}
                      disabled={!user}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                        />
                      </svg>
                      Save Favorites
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Main;
