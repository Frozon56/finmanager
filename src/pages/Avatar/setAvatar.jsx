import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import spinner from "../../assets/gg.gif";
import "./avatar.css";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { uniqueNamesGenerator, animals, colors, countries, names, languages } from "unique-names-generator";

const sprites = [
  "adventurer",
  "micah",
  "avataaars",
  "bottts",
  "initials",
  "adventurer-neutral",
  "big-ears",
  "big-ears-neutral",
  "big-smile",
  "croodles",
  "identicon",
  "miniavs",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
];

const SetAvatar = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);
  const [imgURL, setImgURL] = useState([]);

  // Toast options
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  // Function to generate a random avatar name
  const randomName = () => {
    return uniqueNamesGenerator({
      dictionaries: [animals, colors, countries, names, languages],
      length: 2,
    });
  };

  // Load avatars when sprite changes
  useEffect(() => {
    setLoading(true);
    const imgData = Array.from({ length: 4 }, () =>
      `https://api.dicebear.com/7.x/${selectedSprite}/svg?seed=${randomName()}`
    );
    setImgURL(imgData);
    setLoading(false);
  }, [selectedSprite]);

  // Redirect user to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  // Set profile picture
  const setProfilePicture = async () => {
    if (selectedAvatar === null) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("User not found. Please log in again.", toastOptions);
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, {
        image: imgURL[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Avatar set successfully!", toastOptions);
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast.error("Something went wrong. Please try again.", toastOptions);
    }
  };

  // Particle background effect
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#000" } },
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            move: { enable: true, speed: 2 },
            life: { duration: { sync: false, value: 3 }, count: 0 },
          },
          detectRetina: true,
        }}
        style={{ position: "absolute", zIndex: -1, top: 0, left: 0 }}
      />

      {/* Loading Spinner */}
      {loading ? (
        <div className="container containerBox">
          <div className="avatarBox">
            <img src={spinner} alt="Loading..." />
          </div>
        </div>
      ) : (
        <div className="container containerBox">
          <div className="avatarBox">
            <h1 className="text-center text-white mt-5">Choose Your Avatar</h1>

            {/* Avatar Selection Grid */}
            <div className="container">
              <div className="row">
                {imgURL.map((image, index) => (
                  <div key={index} className="col-lg-3 col-md-6 col-6">
                    <img
                      src={image}
                      alt="Avatar"
                      className={`avatar ${selectedAvatar === index ? "selected" : ""} img-circle imgAvatar mt-5`}
                      onClick={() => setSelectedAvatar(index)}
                      width="100%"
                      height="auto"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Avatar Style Selection Dropdown */}
            <select onChange={(e) => setSelectedSprite(e.target.value)} className="form-select mt-5">
              {sprites.map((sprite, index) => (
                <option value={sprite} key={index}>
                  {sprite}
                </option>
              ))}
            </select>

            {/* Set Profile Picture Button */}
            <Button onClick={setProfilePicture} type="submit" className="mt-5">
              Set as Profile Picture
            </Button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SetAvatar;
