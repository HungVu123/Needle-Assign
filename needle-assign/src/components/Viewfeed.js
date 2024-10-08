import { useEffect, useState } from "react";
import Layout from "./Layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";

const Viewfeed = () => {
  const navigate = useNavigate();
  const goToMain = () => {
    navigate("/");
  };

  const [user, setUser] = useState(null);
  const [feedImages, setFeedImages] = useState({});
  const [likedImages, setLikedImages] = useState([]);

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

  // Load user data (selected breeds and liked images) from Firestore
  const loadUserData = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.selectedBreeds) {
        fetchRandomImagesForFeed(userData.selectedBreeds);
      }
      if (userData.likedImages) {
        setLikedImages(userData.likedImages);
      }
    } else {
      console.log("No such document!");
    }
  };

  // Handle liking an image
  const handleLikeImage = async (breed) => {
    let updatedLikes = [];
    if (likedImages.includes(breed)) {
      updatedLikes = likedImages.filter((url) => url !== breed);
    } else {
      updatedLikes = [...likedImages, breed];
    }
    setLikedImages(updatedLikes);

    // Save liked images to Firestore
    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { likedImages: updatedLikes });
    } catch (err) {
      console.error("Error updating liked images:", err);
    }
  };

  // Fetch random images for each selected breed for the feed
  const fetchRandomImagesForFeed = async (selectedBreeds) => {
    const breedImages = {};
    try {
      for (let breed of selectedBreeds) {
        const response = await fetch(
          `https://dog.ceo/api/breed/${breed}/images/random`
        );
        const data = await response.json();
        breedImages[breed] = data.message;
      }
      setFeedImages(breedImages);
      console.log(breedImages);
    } catch (err) {
      console.error("Error fetching random images:", err);
    }
  };

  return (
    <Layout
      sidebarContent={
        <>
          <Button variant="text" onClick={goToMain} disabled={!user}>
            <Typography variant="h5">Back to Breed Selection</Typography>
          </Button>
        </>
      }
      mainContent={
        <>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.keys(feedImages).map((breed) => (
              <div
                key={breed}
                className="bg-white shadow-lg rounded-lg p-4 w-72 h-[400px] flex flex-col items-center"
              >
                <h3 className="text-xl font-semibold mb-2 text-center capitalize">
                  {breed}
                </h3>
                <img
                  src={feedImages[breed]}
                  alt={`A ${breed}`}
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="mt-auto">
                  <button
                    onClick={() => handleLikeImage(breed)}
                    className={`mt-4 px-4 py-2 w-full rounded-md font-medium transition ${
                      likedImages.includes(breed)
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {likedImages.includes(breed) ? "Unlike" : "Like"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    />
  );
};

export default Viewfeed;
