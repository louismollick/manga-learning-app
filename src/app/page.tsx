import Image from "next/image";
import { api } from "@/trpc/server";
import { type MokuroResponse } from "@/types/mokuro";
import SpeechBubble from "@/components/speechBubble/speechBubble";
import { type IchiranResponse } from "@/types/ichiran";

const MOKURO_JSON: MokuroResponse = {
  version: "0.1.8",
  img_width: 940,
  img_height: 1368,
  blocks: [
    {
      box: [801, 118, 851, 214],
      vertical: true,
      font_size: 23,
      lines_coords: [
        [
          [826.0, 118.0],
          [850.0, 118.0],
          [851.0, 208.0],
          [827.0, 208.0],
        ],
        [
          [801.0, 118.0],
          [823.0, 118.0],
          [823.0, 212.0],
          [801.0, 212.0],
        ],
      ],
      lines: ["ああ．．．．．", "この道は、"],
    },
    {
      box: [99, 120, 177, 271],
      vertical: true,
      font_size: 21,
      lines_coords: [
        [
          [153.0, 120.0],
          [176.0, 120.0],
          [176.0, 229.0],
          [153.0, 229.0],
        ],
        [
          [125.0, 120.0],
          [148.0, 120.0],
          [148.0, 271.0],
          [125.0, 271.0],
        ],
        [
          [100.0, 121.0],
          [117.0, 121.0],
          [117.0, 256.0],
          [100.0, 256.0],
        ],
      ],
      lines: ["俺が記憶を", "失う直前に見た", "風景だからな。"],
    },
    {
      box: [398, 889, 479, 1076],
      vertical: true,
      font_size: 23,
      lines_coords: [
        [
          [448.0, 889.0],
          [476.0, 889.0],
          [479.0, 1076.0],
          [451.0, 1076.0],
        ],
        [
          [425.0, 891.0],
          [448.0, 891.0],
          [448.0, 977.0],
          [425.0, 977.0],
        ],
        [
          [399.0, 892.0],
          [417.0, 892.0],
          [417.0, 999.0],
          [399.0, 999.0],
        ],
      ],
      lines: ["あの時、この路地に", "いた男は", "誰なんだ？"],
    },
  ],
};

const ICHIRAN_JSON: IchiranResponse = [
  [
    [
      [
        [
          "ore",
          {
            reading: "\u4FFA \u3010\u304A\u308C\u3011",
            text: "\u4FFA",
            kana: "\u304A\u308C",
            score: 16,
            seq: 1576870,
            gloss: [{ pos: "[pn]", gloss: "I; me", info: "rough or arrogant" }],
            conj: [],
          },
          [],
        ],
        [
          "ga",
          {
            reading: "\u304C",
            text: "\u304C",
            kana: "\u304C",
            score: 11,
            seq: 2028930,
            gloss: [
              {
                pos: "[prt]",
                gloss: "indicates sentence subject (occasionally object)",
              },
              {
                pos: "[prt]",
                gloss: "indicates possessive (esp. in literary expressions)",
              },
              { pos: "[conj]", gloss: "but; however; still; and" },
              {
                pos: "[conj]",
                gloss: "regardless of; whether (or not)",
                info: "after the volitional form of a verb",
              },
            ],
            conj: [],
          },
          [],
        ],
        [
          "kioku",
          {
            reading: "\u8A18\u61B6 \u3010\u304D\u304A\u304F\u3011",
            text: "\u8A18\u61B6",
            kana: "\u304D\u304A\u304F",
            score: 286,
            seq: 1223150,
            gloss: [
              { pos: "[n,vs,vt]", gloss: "memory; recollection; remembrance" },
              { pos: "[vt,vs,n]", gloss: "memory; storage" },
            ],
            conj: [],
          },
          [],
        ],
        [
          "wo",
          {
            reading: "\u3092",
            text: "\u3092",
            kana: "\u3092",
            score: 11,
            seq: 2029010,
            gloss: [
              { pos: "[prt]", gloss: "indicates direct object of action" },
              {
                pos: "[prt]",
                gloss: "indicates subject of causative expression",
              },
              { pos: "[prt]", gloss: "indicates an area traversed" },
              {
                pos: "[prt]",
                gloss: "indicates time (period) over which action takes place",
              },
              {
                pos: "[prt]",
                gloss: "indicates point of departure or separation of action",
              },
              {
                pos: "[prt]",
                gloss: "indicates object of desire, like, hate, etc.",
              },
            ],
            conj: [],
          },
          [],
        ],
        [
          "ushinau",
          {
            reading: "\u5931\u3046 \u3010\u3046\u3057\u306A\u3046\u3011",
            text: "\u5931\u3046",
            kana: "\u3046\u3057\u306A\u3046",
            score: 160,
            seq: 1319750,
            gloss: [
              { pos: "[v5u,vt]", gloss: "to lose" },
              { pos: "[v5u,vt]", gloss: "to miss (a chance, opportunity)" },
              {
                pos: "[v5u,vt]",
                gloss: "to lose (a loved one); to be bereaved of",
              },
              { pos: "[vt,v5u]", gloss: "to concede (goals, points, etc.)" },
            ],
            conj: [],
          },
          [],
        ],
        [
          "chokuzen",
          {
            reading: "\u76F4\u524D \u3010\u3061\u3087\u304F\u305C\u3093\u3011",
            text: "\u76F4\u524D",
            kana: "\u3061\u3087\u304F\u305C\u3093",
            score: 312,
            seq: 1431330,
            gloss: [
              { pos: "[n,adv]", gloss: "just before; just prior to" },
              { pos: "[adv,n]", gloss: "right in front of; just in front of" },
            ],
            conj: [],
          },
          [],
        ],
        [
          "ni",
          {
            reading: "\u306B",
            text: "\u306B",
            kana: "\u306B",
            score: 11,
            seq: 2028990,
            gloss: [
              { pos: "[prt]", gloss: "at (place, time); in; on; during" },
              { pos: "[prt]", gloss: "to (direction, state); toward; into" },
              { pos: "[prt]", gloss: "for (purpose)" },
              { pos: "[prt]", gloss: "because of (reason); for; with" },
              { pos: "[prt]", gloss: "by; from" },
              { pos: "[prt]", gloss: "as (i.e. in the role of)" },
              { pos: "[prt]", gloss: 'per; in; for; a (e.g. "once a month")' },
              { pos: "[prt]", gloss: "and; in addition to" },
              { pos: "[prt]", gloss: "if; although" },
            ],
            conj: [],
          },
          [],
        ],
        [
          "mita",
          {
            reading: "\u898B\u305F \u3010\u307F\u305F\u3011",
            text: "\u898B\u305F",
            kana: "\u307F\u305F",
            score: 112,
            seq: 10308933,
            conj: [
              {
                prop: [{ pos: "v1", type: "Past (~ta)" }],
                reading: "\u898B\u308B \u3010\u307F\u308B\u3011",
                gloss: [
                  {
                    pos: "[v1,vt]",
                    gloss: "to see; to look; to watch; to view; to observe",
                  },
                  {
                    pos: "[v1,vt]",
                    gloss:
                      "to examine; to look over; to assess; to check; to judge",
                  },
                  {
                    pos: "[v1,vt]",
                    gloss:
                      "to look after; to attend to; to take care of; to keep an eye on",
                  },
                  {
                    pos: "[v1,vt]",
                    gloss:
                      "to experience; to meet with (misfortune, success, etc.)",
                  },
                  {
                    pos: "[aux-v,v1]",
                    gloss: "to try ...; to have a go at ...; to give ... a try",
                    info: "after the -te form of a verb",
                  },
                  {
                    pos: "[aux-v,v1]",
                    gloss: "to see (that) ...; to find (that) ...",
                    info: "as \u301C\u3066\u307F\u308B\u3068, \u301C\u3066\u307F\u305F\u3089, \u301C\u3066\u307F\u308C\u3070, etc.",
                  },
                ],
                readok: true,
              },
            ],
          },
          [],
        ],
        [
          "f\u016Bkei",
          {
            reading: "\u98A8\u666F \u3010\u3075\u3046\u3051\u3044\u3011",
            text: "\u98A8\u666F",
            kana: "\u3075\u3046\u3051\u3044",
            score: 286,
            seq: 1499830,
            gloss: [
              {
                pos: "[n,adj-no]",
                gloss: "scenery; scene; landscape; view; sight",
              },
              { pos: "[adj-no,n]", gloss: "scene (e.g. of a crime)" },
            ],
            conj: [],
          },
          [],
        ],
        [
          "da kara",
          {
            reading: "\u3060\u304B\u3089",
            text: "\u3060\u304B\u3089",
            kana: "\u3060 \u304B\u3089",
            score: 139,
            compound: ["\u3060", "\u304B\u3089"],
            components: [
              {
                reading: "\u3060",
                text: "\u3060",
                kana: "\u3060",
                score: 0,
                seq: 2089020,
                gloss: [
                  {
                    pos: "[cop,cop-da]",
                    gloss: "be; is",
                    info: "plain copula",
                  },
                  {
                    pos: "[aux-v]",
                    gloss: "did; (have) done",
                    info: "\u305F after certain verb forms; indicates past or completed action",
                  },
                  {
                    pos: "[aux-v]",
                    gloss: "please; do",
                    info: "indicates light imperative",
                  },
                ],
                conj: [],
              },
              {
                reading: "\u304B\u3089",
                text: "\u304B\u3089",
                kana: "\u304B\u3089",
                score: 0,
                seq: 1002980,
                suffix: "from / because",
                conj: [],
              },
            ],
          },
          [],
        ],
        [
          "na",
          {
            reading: "\u306A",
            text: "\u306A",
            kana: "\u306A",
            score: 16,
            seq: 2029110,
            gloss: [
              {
                pos: "[prt]",
                gloss: "don't",
                info: "prohibitive; used with dictionary form verb",
              },
              {
                pos: "[prt]",
                gloss: "do",
                info: "imperative (from \u306A\u3055\u3044); used with -masu stem of verb",
              },
              {
                pos: "[int]",
                gloss: "hey; listen; look; say",
                info: "used to get someone's attention or press one's point",
              },
              {
                pos: "[prt]",
                gloss: "now, ...; well, ...; I tell you!; you know",
                info: "when seeking confirmation, for emphasis, etc.; used at sentence end",
              },
              {
                pos: "[prt]",
                gloss: "wow; ooh",
                info: "used to express admiration, emotionality, etc.; used at sentence end",
              },
              {
                pos: "[prt]",
                gloss:
                  "right?; isn't it?; doesn't it?; don't you?; don't you think?",
                info: "used as a request for confirmation or agreement; used at sentence end",
              },
              { pos: "[prt]", gloss: "indicates \u306A-adjective" },
            ],
            conj: [],
          },
          [],
        ],
      ],
      1412,
    ],
  ],
  ". ",
];

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] text-white">
      <div className="relative">
        {MOKURO_JSON.blocks.map((block, idx) => (
          <SpeechBubble
            key={idx}
            rawText={block.lines.join("")}
            segmentation={ICHIRAN_JSON}
            style={{
              left: `${(block.box[0] * 100) / MOKURO_JSON.img_width}%`,
              top: `${(block.box[1] * 100) / MOKURO_JSON.img_height}%`,
              width: `${((block.box[2] - block.box[0]) * 100) / MOKURO_JSON.img_width}%`,
              height: `${((block.box[3] - block.box[1]) * 100) / MOKURO_JSON.img_height}%`,
            }}
          />
        ))}
        <Image
          src="https://www.mokuro.moe/manga/Dorohedoro/Dorohedoro v01/DH_01 016.JPG"
          alt="Dorohedoro v1 016"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          width={MOKURO_JSON.img_width}
          height={MOKURO_JSON.img_height}
        />
      </div>
    </main>
  );
}
