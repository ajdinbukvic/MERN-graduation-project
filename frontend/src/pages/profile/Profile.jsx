import React, { useLayoutEffect, useState } from "react";
import Card from "../../components/card/Card";
import "./Profile.scss";
import PageMenu from "../../components/pageMenu/PageMenu";
import Notification from "../../components/notification/Notification";
import { useDispatch, useSelector } from "react-redux";
//import { getUser } from "../../redux/features/auth/authSlice";
import { updateUser } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";

// export const shortenText = (text, n) => {
//   if (text.length > n) {
//     const shortenedText = text.substring(0, n).concat("...");
//     return shortenedText;
//   }
//   return text;
// };

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  const initialState = {
    name: user?.name,
    email: user?.email,
    photo: user?.photo,
    role: user?.role,
    isVerified: user?.isVerified,
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = async (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    let imageURL;
    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);

        // Save the image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/zinotrust/image/upload",
          { method: "post", body: image }
        );
        const imgData = await response.json();
        imageURL = imgData.url.toString();
      }

      // Save Profile To DB
      const userData = {
        name: profile.name,
        photo: profileImage ? imageURL : profile.photo,
      };

      dispatch(updateUser(userData));
      toast.success("Podaci su uspješno ažurirani.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // useLayoutEffect(() => {
  //   dispatch(getUser());
  // }, [dispatch]);

  useLayoutEffect(() => {
    if (user) {
      setProfile({
        ...profile,
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        isVerified: user.isVerified,
      });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!profile.isVerified && <Notification />}
      <section>
        <div className="container">
          <PageMenu />
          <h2 className="--flex-center">Informacije o korisniku</h2>
          <div className="--flex-center profile">
            <Card cardClass={"card"}>
              {isLoading && <Loader />}
              {!isLoading && user && (
                <div>
                  <div className="profile-photo">
                    <div>
                      <img
                        src={imagePreview === null ? user.photo : imagePreview}
                        alt="profilepic"
                      />
                      <h3>Uloga: {user?.role}</h3>
                    </div>
                  </div>
                  <form onSubmit={saveProfile}>
                    <p>
                      <label>Promjena slike:</label>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleImageChange}
                      />
                    </p>
                    <p>
                      <label>Ime i prezime:</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                      />
                    </p>
                    <p>
                      <label>Email:</label>
                      <input
                        type="text"
                        name="name"
                        value={profile?.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </p>
                    <button className="--btn --btn-block --btn-primary">
                      Ažuriraj podatke
                    </button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export const UserName = () => {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "...";
  return <p className="--color-white">Pozdrav, {username} |</p>;
};

export default Profile;
