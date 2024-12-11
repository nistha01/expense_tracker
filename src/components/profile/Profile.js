import React, { useState, useEffect } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { ref, set, get } from "firebase/database";
import { database } from "../auth/FireBaseConfig";
import { useSelector } from "react-redux";

const Profile = () => {
  const emaill = useSelector((state) => state.auth.gmail);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    profilePic: "",
    about: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({ ...profileData });
  const formattedEmail = emaill.replace(/\./g, "_");
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; 
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // Returns the Base64 string
      };
      reader.onerror = reject; 
      reader.readAsDataURL(file); 
    });
  };

  // Fetch profile data from Firebase
  useEffect(() => {
    const fetchProfileData = async () => {
      const profileRef = ref(database, `profileDetails/${formattedEmail}`);
      try {
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          setProfileData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [formattedEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempProfileData({ ...profileData });
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    
    if (file) {
      try {
        const base64Image = await convertToBase64(file);
        tempProfileData.profilePic = base64Image; // Store Base64 string
        saveProfileData();
      } catch (error) {
        alert("Error converting image to Base64:", error);
      }
    } else {
      
      saveProfileData();
    }
  };

 
  const saveProfileData = async () => {
    const profileRef = ref(database, `profileDetails/${formattedEmail}`);
    try {
      await set(profileRef, tempProfileData);
      setProfileData({ ...tempProfileData });
      setIsEditing(false);
    } catch (error) {
      alert("Error saving profile data:", error);
    }
  };

  const calculateCompletion = () => {
    const totalFields = Object.keys(profileData).length;
    const filledFields = Object.values(profileData).filter((value) => value).length;
    return Math.round((filledFields / 6) * 100);
  };
  
  const completionPercentage = calculateCompletion();

  return (
    <div className="profile-page">
      <Link to="/home">
        <button className="home-back">Back Home</button>
      </Link>
      <div className="profile-percentage">
        <svg>
          <circle cx="50" cy="50" r="45" />
          <circle
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 - (completionPercentage / 100) * 2 * Math.PI * 45}`,
            }}
          />
        </svg>
        <div className="percentage-text">{completionPercentage}%</div>
      </div>
      <div className="profile-content">
        <div className="profile-pic-container">
          {profileData.profilePic ? (
            <img src={profileData.profilePic} alt="Profile" />
          ) : (
            <div className="placeholder-pic">+</div>
          )}
        </div>
        <div className="profile-details">
          <h1>{profileData.name || "Name: Not Provided"}</h1>
          <p>Email: {emaill}</p>
          <p>Phone: {profileData.phone || "Not Provided"}</p>
          <p>
            GitHub:{" "}
            {profileData.github ? (
              <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                {profileData.github}
              </a>
            ) : (
              "Not Provided"
            )}
          </p>
          <p>About: {profileData.about || "Not Provided"}</p>
          <button onClick={handleEditClick}>Edit Profile</button>
        </div>
      </div>

      {isEditing && (
        <form className="profile-form" onSubmit={handleSaveClick}>
          <h2>Edit Profile</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={tempProfileData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            GitHub:
            <input
              type="url"
              name="github"
              value={tempProfileData.github}
              onChange={handleChange}
            />
          </label>
          <label>
            Profile Picture:
            <input
              type="file"
              name="profilePic"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </label>
          <label>
            About:
            <textarea
              name="about"
              value={tempProfileData.about}
              onChange={handleChange}
              rows="4"
            />
          </label>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
