/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "./utils";

const frameHandler = frames(async () => {
  return {
    title: "Find Petitions",
    image: (
      <div tw="flex flex-col w-full h-full">
        <img src={`${appURL()}/background/paper-texture.jpg`} tw="h-full w-full absolute" alt="vox" />
        <div tw="flex flex-col justify-center text-center items-center p-8">
          <h1 className="text-6xl font-bold text-center">Welcome to Vox!</h1>
          <div className="text-center text-wrap">
            Find meaningful petitions and contribute by signing them in a totally reliable and anonymous way.
          </div>
          <img src={`${appURL()}/avatars/feather.png`} tw="w-44 h-44 mt-12" alt="feather" />
        </div>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button action="link" target={`${appURL()}/petitions`}>
        Find Petitions!
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
