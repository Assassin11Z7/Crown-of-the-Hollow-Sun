import type { BookMeta } from "@/lib/types";

export const SERIES = {
  title: "Crown of the Hollow Sun",
  tagline: "He isn’t chosen. He is the sun.",
  premise:
    "In Ashveil the sun died a thousand years ago, and magic is the leftover heat of a god’s corpse. Cities clutch emberwells. Nobles hoard shards. Commoners freeze at the edges. Then a boy from the ash-slums wakes with the sun’s core beating in his chest — and every kingdom that learned to live in the dark wants him dead, bottled, or crowned.",
};

export const BOOKS: BookMeta[] = [
  {
    id: "ignition",
    volume: 1,
    roman: "I",
    title: "Ignition",
    series: "Crown of the Hollow Sun",
    subtitle: "The Boy Who Brought Noon",
    cover: "/covers/book1-ignition.jpg",
    docx: "/books/Crown-of-the-Hollow-Sun-1-Ignition.docx",
    filename: "Crown-of-the-Hollow-Sun-1-Ignition.docx",
    dedication: "For the cold ones who still shared their last coal.",
    epigraph: {
      text: "The sun did not die. It learned to hide inside a boy.",
      attribution: "Nightlands proverb, unrecorded",
    },
    synopsis:
      "A well-shard riot in Vireth ruptures the seal in Ren Kael’s blood. The sky lights gold for the first time in centuries. Hunted by the Church, claimed by the Courts, he flees into the Nightlands with a defected inquisitor and a furious prodigy — and learns the Hollow Sun is not dead. It is dreaming.",
  },
  {
    id: "ascension",
    volume: 2,
    roman: "II",
    title: "Ascension",
    series: "Crown of the Hollow Sun",
    subtitle: "The Dream Becoming Lucid",
    cover: "/covers/book2-ascension.jpg",
    docx: "/books/Crown-of-the-Hollow-Sun-2-Ascension.docx",
    filename: "Crown-of-the-Hollow-Sun-2-Ascension.docx",
    dedication: "For the ones who defected and then had to live with it.",
    epigraph: {
      text: "He is not the first fire. He is the first fire that asked permission.",
      attribution: "From the Nightlands memory-ice, unnamed",
    },
    synopsis:
      "Ren trains under impossible constraint: fight without drowning the world in heat. Outer settlements call him the Boy Who Brought Noon. The Ember Courts crown a puppet Solar Saint. At Glassbridge he holds a collapsing span with raw Dominion — and discovers he is the seventh. Six living batteries sleep under the capital.",
  },
  {
    id: "eclipse",
    volume: 3,
    roman: "III",
    title: "Eclipse",
    series: "Crown of the Hollow Sun",
    subtitle: "A Billion Small Flames",
    cover: "/covers/book3-eclipse.jpg",
    docx: "/books/Crown-of-the-Hollow-Sun-3-Eclipse.docx",
    filename: "Crown-of-the-Hollow-Sun-3-Eclipse.docx",
    dedication: "For anyone who was told there wasn’t enough light to go around.",
    epigraph: {
      text: "Salvation that requires a famine is not salvation. It is administration.",
      attribution: "Ren Kael, later, to no one in particular",
    },
    synopsis:
      "Solenne opens the Vault of Cinders. Mother Ash marches frost-legions on the capital. Atop the Hollow Spire Ren is offered two deaths for the world — and refuses both. He splits the Primordial Calor, seeding a fragment into every chest in Ashveil. The eye opens. Then, soothed, it closes.",
  },
];

export const TRILOGY_ZIP = "/books/Crown-of-the-Hollow-Sun-Trilogy.zip";

export function bookById(id: string): BookMeta | undefined {
  return BOOKS.find((b) => b.id === id);
}
