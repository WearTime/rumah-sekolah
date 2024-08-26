import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import styles from "./DetailProfileUser.module.scss";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { User } from "@/types/user.types";
import { useSession } from "next-auth/react";
import {
  changePasswordSchema,
  profileUserSchema,
  userNameSchema,
} from "@/validation/userSchema.validation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import userServices from "@/services/user";

type PropType = {
  profile: User | any;
  setProfile: Dispatch<SetStateAction<User | any>>;
  setModalProfileUser: Dispatch<SetStateAction<boolean>>;
};

const truncateFileName = (fileName: string, maxLength: number): string => {
  const [name, extension] = fileName.split(/\.(?=[^.]+$)/);

  let shortenedName = name;
  if (name.length > maxLength) {
    shortenedName = name.substring(0, maxLength) + "...";
  }

  const nameParts = name.match(/.{1,1}/g) || [];

  let lastTwoParts = "";
  if (name.length > maxLength) {
    lastTwoParts = nameParts.slice(-2).join("");
  }

  const finalName = `${shortenedName}${lastTwoParts}`;

  return `${finalName}.${extension}`;
};

const DetailProfilUser = ({
  profile,
  setProfile,
  setModalProfileUser,
}: PropType) => {
  const [changeImage, setChangeImage] = useState<File | any>({});
  const [isLoading, setIsLoading] = useState("");
  const session = useSession();

  const handleChangeProfilePicture = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("picture");
    const form = e.target as HTMLFormElement;
    const formData = new FormData();

    const image = form.image.files[0];
    const check = profileUserSchema.safeParse(image);

    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading("");
      return;
    }
    formData.append("image", image);
    try {
      const result = await userServices.updateProfile(formData);

      if (result.status == 200) {
        const { data } = await userServices.getProfile();
        setProfile(data.user);
        setModalProfileUser(false);
        toast.success("Success update profile");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unknown error occurred!");
      }
    } finally {
      setIsLoading("");
    }
  };
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("password");
    const form = e.target as HTMLFormElement;
    const formData = new FormData();

    const data = {
      old_password: form.old_password.value,
      new_password: form.new_password.value,
    };

    const check = changePasswordSchema.safeParse(data);
    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading("");
      return;
    }

    formData.append("data", JSON.stringify(data));

    try {
      const result = await userServices.updateProfile(formData);

      if (result.status == 200) {
        const { data } = await userServices.getProfile();
        setProfile(data.user);
        toast.success("Success update Password profile");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unknown error occurred!");
      }
    } finally {
      setIsLoading("");
    }
  };
  const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("profile");
    const form = e.target as HTMLFormElement;
    const formData = new FormData();

    const data: User = {
      username: form.username.value,
    };

    const check = userNameSchema.safeParse(data);
    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading("");
      return;
    }

    formData.append("data", JSON.stringify(data));

    try {
      const result = await userServices.updateProfile(formData);

      if (result.status == 200) {
        const { data } = await userServices.getProfile();
        setProfile(data.user);
        toast.success("Success update profile");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unknown error occurred!");
      }
    } finally {
      setIsLoading("");
    }
  };
  return (
    <div>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__row}>
          <div className={styles.profile__main__row__avatar}>
            <h2 className={styles.profile__main__row__avatar__title}>Avatar</h2>
            {profile.profile ? (
              <Image
                className={styles.profile__main__row__avatar__image}
                src={profile.profile}
                alt="Profile"
                width={200}
                height={200}
              />
            ) : (
              <div className={styles.profile__main__row__avatar__image}>
                {profile?.username?.charAt(0)}
              </div>
            )}
            <form onSubmit={handleChangeProfilePicture}>
              <label
                className={styles.profile__main__row__avatar__label}
                htmlFor="upload-image"
              >
                {changeImage.name ? (
                  <p>{truncateFileName(changeImage.name, 20)}</p>
                ) : (
                  <>
                    <p>
                      Upload a new avatar, larger image will be reszed
                      automatically
                    </p>
                    <p>
                      Maximum upload size is <b>1MB</b>
                    </p>
                  </>
                )}
              </label>
              <input
                className={styles.profile__main__row__avatar__input}
                type="file"
                name="image"
                id="upload-image"
                onChange={(e: any) => {
                  e.preventDefault();
                  setChangeImage(e.currentTarget.files[0]);
                }}
              />
              <Button
                className={styles.profile__main__row__avatar__button}
                type="submit"
                variant="secondary"
              >
                {isLoading == "picture" ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </div>
          <div className={styles.profile__main__row__profile}>
            <h2 className={styles.profile__main__row__profile__title}>
              Profile
            </h2>
            <form
              onSubmit={handleChangeProfile}
              className={styles.profile__main__row__profile__form}
            >
              <Input
                label="Username"
                name="username"
                defaultValue={profile.username}
                type="text"
                className={styles.profile__main__row__profile__form__input}
              />
              <Input
                label="Role"
                name="role"
                type="text"
                defaultValue={profile.role}
                className={styles.profile__main__row__profile__form__input}
                disabled
              />
              <Button
                type="submit"
                variant="secondary"
                className={styles.profile__main__row__profile__form__button}
              >
                {isLoading == "profile" ? "Updating..." : "Update Profile"}
              </Button>
            </form>
            <div className={styles.profile__password__row__form}>
              <h2>Change Password</h2>
              <form
                onSubmit={handleChangePassword}
                className={styles.profile__password__row__form}
              >
                <Input
                  name="old_password"
                  label="Old Password"
                  type="password"
                  placeholder="Enter your current password"
                  disabled={profile.type == "google"}
                  className={styles.profile__password__row__form__input}
                />
                <Input
                  name="new_password"
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  disabled={profile.type == "google"}
                  className={styles.profile__password__row__form__input}
                />
                <Button
                  type="submit"
                  disabled={isLoading == "password" || profile.type == "google"}
                  variant="secondary"
                  className={styles.profile__password__row__form__button}
                >
                  {isLoading == "password" ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfilUser;
