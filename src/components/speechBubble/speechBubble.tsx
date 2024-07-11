"use client";

import React, { type CSSProperties } from "react";
import { Button } from "../ui/button";
import { DrawerTrigger, DrawerContent, Drawer } from "../ui/drawer";
import { type IchiranResponse } from "@/types/ichiran";
import WordReadingPopover from "./wordReadingPopover";

export default function SpeechBubble({
  rawText,
  segmentation,
  style,
}: {
  rawText: string;
  segmentation: IchiranResponse;
  style: CSSProperties | undefined;
}) {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button style={style} variant="bubble" />
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto my-4 w-full select-text p-3 text-4xl lg:text-6xl">
            {segmentation.length
              ? segmentation.map((wordChain, chainIdx) => {
                  if (typeof wordChain === "string")
                    return <span key={`chain-${chainIdx}`}>{wordChain}</span>;

                  const [[words]] = wordChain;
                  return words.map((word, wordIdx) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_, wordAlternatives] = word;

                    const wordReading =
                      "alternative" in wordAlternatives
                        ? wordAlternatives.alternative[0]! // just take the first one
                        : wordAlternatives;

                    return (
                      <WordReadingPopover
                        key={`chain-${chainIdx}-word-${wordIdx}`}
                        wordReading={wordReading}
                      />
                    );
                  });
                })
              : rawText}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
