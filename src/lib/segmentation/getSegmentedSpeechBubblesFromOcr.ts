import { type MokuroResponse } from "@/types/mokuro";
import { segmentText } from "./segmentText";

const getSegmentedSpeechBubblesFromOcr = (
  ocrResult: MokuroResponse,
  mangaId: number,
  volumeNumber: number,
  pageNumber: number,
) =>
  Promise.all(
    ocrResult.blocks.map(async (ocrBlock, index) => {
      const rawText = ocrBlock.lines.join("");
      return {
        mangaId,
        volumeNumber,
        pageNumber,
        id: index + 1, // Speech bubbles are ordered by reading order on page.
        left: `${(ocrBlock.box[0] * 100) / ocrResult.img_width}%`,
        top: `${(ocrBlock.box[1] * 100) / ocrResult.img_height}%`,
        width: `${((ocrBlock.box[2] - ocrBlock.box[0]) * 100) / ocrResult.img_width}%`,
        height: `${((ocrBlock.box[3] - ocrBlock.box[1]) * 100) / ocrResult.img_height}%`,
        rawText,
        segmentations: await segmentText(rawText),
        ocrBlock,
      };
    }),
  );

export default getSegmentedSpeechBubblesFromOcr;
