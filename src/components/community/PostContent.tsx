import { cld } from "@/src/lib/cloudinary";
import { useWindowDimensions } from "react-native";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { AdvancedImage } from "cloudinary-react-native";
import { Video, ResizeMode } from 'expo-av';
import { fit } from "@cloudinary/url-gen/actions/resize";
import React from "react";


type User = {
  id: string;
  username: string;
  avatar_url: string;
};

type Post = {
  id: number; // Ensure `id` is a number
  media_type: 'image' | 'video';
  image: string;
  caption: string;
  user: User,
  my_likes: { id: string }[];
  likesPost?: { count: number }[];
};

export default function PostContent({ post }: { post: Post }) {
  const { width } = useWindowDimensions();

  if (post.media_type === 'image') {
    const image = cld.image(post.image);
    image.resize(fit().height(width + 10).aspectRatio("1.0"));
    return <AdvancedImage cldImg={image} className="w-full aspect-[6/3]" />;
  }

  if (post.media_type === 'video') {
    const video = cld.video(post.image);
    video.resize(scale().width(400));
    return (
      <Video
        className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
        style={{ width: '100%', aspectRatio: 16 / 9 }}
        source={{
          uri: video.toURL(),
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
    );
  }

  return null;
}
