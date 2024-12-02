import React, { useContext, useState, useEffect } from "react";
import "./Profile.css";
import { AuthContext } from "../auth/AuthContext";

const Profile = () => {
  const { gmail } = useContext(AuthContext);

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

  const urlToUpdateUserData = "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA";
  const urlToGetUserData = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA";

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const idToken = localStorage.getItem(gmail);
        const response = await fetch(urlToGetUserData, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        const user = data.users[0]; // Firebase returns user data in an array
        setProfileData({
          name: user.displayName || "",
          email: user.email || "",
         // phone: "",
         // github: "",
          profilePic: user.photoUrl || "",
          about: "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [gmail]);

  // Update user data only when "Save" is clicked
  const updateUserData = async () => {
    try {
      const idToken = "lTeA1vZzUkTEQpF3edTRHfnu1Jo2";
      console.log(idToken);
      const response = await fetch(urlToUpdateUserData, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "idToken":idToken,
          "displayName": tempProfileData.name,
          "photoUrl": tempProfileData.profilePic,
          returnSecureToken: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const data = await response.json();
      console.log("User data updated:", data);
      setProfileData({ ...tempProfileData });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setTempProfileData({ ...profileData }); // Load current data into temporary state
    setIsEditing(true);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    updateUserData(); // Only update data when Save is clicked
  };

  const calculateCompletion = () => {
    const totalFields = Object.keys(profileData).length;
    const filledFields = Object.values(profileData).filter((value) => value).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="profile-page">
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
          <p>Email: {profileData.email || "Not Provided"}</p>
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
            Profile Picture URL:
            <input
              type="url"
              name="profilePic"
              value={tempProfileData.profilePic}
              onChange={handleChange}
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
