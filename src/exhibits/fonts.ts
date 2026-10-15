// Exhibit typefaces, loaded with next/font (self-hosted at build, OFL). preload: false so an exhibit page only
// downloads the faces it actually renders. "Big Shoulders Display" is now published as "Big Shoulders" (opsz axis).
import { Instrument_Serif, Instrument_Sans, Syne, Space_Mono, Gloock, Newsreader, Schibsted_Grotesk, Geist_Mono, Unbounded, Onest, Libre_Caslon_Display, Silkscreen, Martian_Mono, Tilt_Warp, Figtree, Sora, DM_Sans, DM_Mono, Big_Shoulders, JetBrains_Mono, Rubik_Mono_One, Work_Sans, Epilogue, IBM_Plex_Mono, Young_Serif, Crimson_Pro, Archivo, Azeret_Mono, Geist, Caveat, Literata, Fraunces, Spectral, Climate_Crisis, Familjen_Grotesk, Cormorant_Garamond, Hanken_Grotesk, Bodoni_Moda, EB_Garamond } from "next/font/google";

const f0 = Instrument_Serif({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, fallback: ["Georgia"] }); // Instrument Serif
const f1 = Instrument_Sans({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Instrument Sans
const f2 = Syne({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Syne
const f3 = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // Space Mono
const f4 = Gloock({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, fallback: ["Georgia"] }); // Gloock
const f5 = Newsreader({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // Newsreader
const f6 = Schibsted_Grotesk({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Schibsted Grotesk
const f7 = Geist_Mono({ subsets: ["latin"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // Geist Mono
const f8 = Unbounded({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Unbounded
const f9 = Onest({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Onest
const f10 = Libre_Caslon_Display({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, fallback: ["Georgia"] }); // Libre Caslon Display
const f11 = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, fallback: ["system-ui"] }); // Silkscreen
const f12 = Martian_Mono({ subsets: ["latin"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // Martian Mono
const f13 = Tilt_Warp({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Tilt Warp
const f14 = Figtree({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Figtree
const f15 = Sora({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Sora
const f16 = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // DM Sans
const f17 = DM_Mono({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // DM Mono
const f18 = Big_Shoulders({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Big Shoulders Display
const f19 = JetBrains_Mono({ subsets: ["latin"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // JetBrains Mono
const f20 = Rubik_Mono_One({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // Rubik Mono One
const f21 = Work_Sans({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Work Sans
const f22 = Epilogue({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Epilogue
const f23 = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // IBM Plex Mono
const f24 = Young_Serif({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, fallback: ["Georgia"] }); // Young Serif
const f25 = Crimson_Pro({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // Crimson Pro
const f26 = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", preload: false, fallback: ["system-ui"] }); // Archivo
const f27 = Azeret_Mono({ subsets: ["latin"], display: "swap", preload: false, fallback: ["ui-monospace"] }); // Azeret Mono
const f28 = Geist({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Geist
const f29 = Caveat({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Caveat
const f30 = Literata({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // Literata
const f31 = Fraunces({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // Fraunces
const f32 = Spectral({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, fallback: ["Georgia"] }); // Spectral
const f33 = Climate_Crisis({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Climate Crisis
const f34 = Familjen_Grotesk({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Familjen Grotesk
const f35 = Cormorant_Garamond({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // Cormorant Garamond
const f36 = Hanken_Grotesk({ subsets: ["latin"], display: "swap", preload: false, fallback: ["system-ui"] }); // Hanken Grotesk
const f37 = Bodoni_Moda({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // Bodoni Moda
const f38 = EB_Garamond({ subsets: ["latin"], display: "swap", preload: false, fallback: ["Georgia"] }); // EB Garamond

export const FAMILY: Record<string, string> = {
  "Instrument Serif": f0.style.fontFamily,
  "Instrument Sans": f1.style.fontFamily,
  "Syne": f2.style.fontFamily,
  "Space Mono": f3.style.fontFamily,
  "Gloock": f4.style.fontFamily,
  "Newsreader": f5.style.fontFamily,
  "Schibsted Grotesk": f6.style.fontFamily,
  "Geist Mono": f7.style.fontFamily,
  "Unbounded": f8.style.fontFamily,
  "Onest": f9.style.fontFamily,
  "Libre Caslon Display": f10.style.fontFamily,
  "Silkscreen": f11.style.fontFamily,
  "Martian Mono": f12.style.fontFamily,
  "Tilt Warp": f13.style.fontFamily,
  "Figtree": f14.style.fontFamily,
  "Sora": f15.style.fontFamily,
  "DM Sans": f16.style.fontFamily,
  "DM Mono": f17.style.fontFamily,
  "Big Shoulders Display": f18.style.fontFamily,
  "JetBrains Mono": f19.style.fontFamily,
  "Rubik Mono One": f20.style.fontFamily,
  "Work Sans": f21.style.fontFamily,
  "Epilogue": f22.style.fontFamily,
  "IBM Plex Mono": f23.style.fontFamily,
  "Young Serif": f24.style.fontFamily,
  "Crimson Pro": f25.style.fontFamily,
  "Archivo": f26.style.fontFamily,
  "Azeret Mono": f27.style.fontFamily,
  "Geist": f28.style.fontFamily,
  "Caveat": f29.style.fontFamily,
  "Literata": f30.style.fontFamily,
  "Fraunces": f31.style.fontFamily,
  "Spectral": f32.style.fontFamily,
  "Climate Crisis": f33.style.fontFamily,
  "Familjen Grotesk": f34.style.fontFamily,
  "Cormorant Garamond": f35.style.fontFamily,
  "Hanken Grotesk": f36.style.fontFamily,
  "Bodoni Moda": f37.style.fontFamily,
  "EB Garamond": f38.style.fontFamily,
};
