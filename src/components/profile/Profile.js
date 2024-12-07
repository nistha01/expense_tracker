import React, { useReducer, useEffect } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";

// Initial state for the reducer
const initialState = {
  profileData: {
    name: "",
    email: "",
    phone: "",
    github: "",
    profilePic: "",
    about: "",
  },
  isEditing: false,
  tempProfileData: {
    name: "",
    email: "",
    phone: "",
    github: "",
    profilePic: "",
    about: "",
  },
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PROFILE_DATA":
      return {
        ...state,
        profileData: action.payload,
        tempProfileData: action.payload, // Initialize temp profile data
      };
    case "SET_TEMP_PROFILE_DATA":
      return {
        ...state,
        tempProfileData: { ...state.tempProfileData, [action.field]: action.value },
      };
    case "TOGGLE_EDIT":
      return {
        ...state,
        isEditing: !state.isEditing,
      };
    case "SAVE_PROFILE":
      return {
        ...state,
        profileData: { ...state.tempProfileData },
        isEditing: false,
      };
    default:
      return state;
  }
};

const Profile = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profileData, tempProfileData, isEditing } = state;
  const gmail = localStorage.getItem("gmail"); // Replace with proper email if context is still used

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
        dispatch({ type: "SET_PROFILE_DATA", payload: {
          name: user.displayName || "",
          email: user.email || "",
          profilePic: user.photoUrl || "",
          about: "",
        } });
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [gmail]);

  // Update user data only when "Save" is clicked
  const updateUserData = async () => {
    try {
      const idToken = "lTeA1vZzUkTEQpF3edTRHfnu1Jo2"; // Replace with actual token
      const response = await fetch(urlToUpdateUserData, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          displayName: tempProfileData.name,
          photoUrl: tempProfileData.profilePic,
          returnSecureToken: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const data = await response.json();
      console.log("User data updated:", data);
      dispatch({ type: "SAVE_PROFILE" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_TEMP_PROFILE_DATA", field: name, value: value });
  };

  const handleEditClick = () => {
    dispatch({ type: "TOGGLE_EDIT" });
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
