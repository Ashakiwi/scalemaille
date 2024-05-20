/* {
    "id": "",
    "name": "",
    "vendor": "",
    "hex": "",
    "material": "aluminum", (aluminum, steel, titanium, plastic)
    "finish": "", (brushed, semi-gloss, shiny, mirror, diamond, matte)
    "sizes": ["petite", "tiny", "small", "medium", "large", "x-large"]
  }
*/


let generalPalette = [
  {
    "id": "vod",
    "name": "Void",
    "vendor": "",
    "hex": "rgba(0,0,0,0)",
    "material": "all",
    "finish": "all",
    "sizes": ["petite", "tiny", "small", "medium", "large", "x-large"]
  },
  {
    "id": "non",
    "name": "Empty",
    "vendor": "",
    "hex": "rgba(0, 0, 0, 0.25)",
    "material": "all",
    "finish": "all",
    "sizes": ["petite", "tiny", "small", "medium", "large", "x-large"]
  },
  {
    "id": "def",
    "name": "Default",
    "vendor": "",
    "hex": "rgba(195, 195, 197, 1)",
    "material": "all",
    "finish": "all",
    "sizes": ["petite", "tiny", "small", "medium", "large", "x-large"]
  }
];

let colourList = [
  {
    "id": "spg_sts",
    "name": "SPG-Steel Silver Tone",
    "vendor": "Steampunk Garage",
    "hex": "rgba(195, 195, 197, 1)",
    "material": "Steel",
    "finish": "shiny",
    "sizes": ["petite", "small", "large"]
  },
  {
    "id": "spg_stg",
    "name": "SPG- Steel Gold Tone",
    "hex": "",
    "material": "Steel",
    "finish": "Mirror",
    "sizes": ["petite", "small"]
  },
  {
    "id": "spg_drp",
    "name": "SPG-Dark Rose Pink",
    "vendor": "Steampunk Garage",
    "hex": "rgba(190, 69, 79, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "spg_br",
    "name": "SPG-Blood Red",
    "vendor": "Steampunk Garage",
    "hex": "rgba(193, 0, 22, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["petite", "large"]
  },
  {
    "id": "spg_pog",
    "name": "SPG-Pumpkin Orange",
    "vendor": "Steampunk Garage",
    "hex": "rgba(255, 116, 32, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "spg_ygd",
    "name": "SPG-Yellow Gold",
    "vendor": "Steampunk Garage",
    "hex": "rgba(255, 208, 51, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "spg_gdm",
    "name": "SPG-Gold Mirror",
    "vendor": "Steampunk Garage",
    "hex": "rgba(255, 208, 51, 1)",
    "material": "aluminum",
    "finish": "Mirror",
    "sizes": ["large"]
  },
  {
    "id": "spg_alm",
    "name": "SPG-Acid Lime Green",
    "vendor": "Steampunk Garage",
    "hex": "rgba(187, 223, 50, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "spg_kgn",
    "name": "SPG-Kelly Green",
    "vendor": "Steampunk Garage",
    "hex": "rgba(57, 168, 69, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "spg_vtg",
    "name": "SPG-Vivid Teal/Green",
    "vendor": "Steampunk Garage",
    "hex": "rgba(0, 133, 125, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["petite", "large"]
  },
  {
    "id": "spg_ryb",
    "name": "SPG-Royal Blue",
    "vendor": "Steampunk Garage",
    "hex": "rgba(0, 83, 156, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["petite", "large"]
  },
  {
    "id": "spg_prp",
    "name": "SPG-Purple",
    "vendor": "Steampunk Garage",
    "hex": "rgba(78, 0, 142, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["petite", "large"]
  },
  {
    "id": "spg_mdg",
    "name": "SPG-Med Grey",
    "vendor": "Steampunk Garage",
    "hex": "rgba(147, 149, 151, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["petite", "large"]
  },
  {
    "id": "spg_cgy",
    "name": "SPG-Charcoal Grey",
    "vendor": "Steampunk Garage",
    "hex": "rgba(66, 85, 99, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "spg_blk",
    "name": "SPG-Black",
    "vendor": "Steampunk Garage",
    "hex": "rgba(45, 44, 47, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["petite", "large"]
  },
  {
    "id": "spg_dcb",
    "name": "SPG-Dark Coffee Brown",
    "vendor": "Steampunk Garage",
    "hex": "rgba(99, 63, 51, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_mas",
    "name": "MEL-Arctic Silver-Matte",
    "vendor": "Meloria",
    "hex": "rgba(192, 192, 192, 255)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mmb",
    "name": "MEL-Midnight Black-Matte",
    "hex": "rgba(36, 36, 36, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mvv",
    "name": "MEL-Vivid Violet-Matte",
    "hex": "rgba(152, 29, 151, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_msg",
    "name": "MEL-Sunflower Gold-Matte",
    "hex": "rgba(218, 165, 32, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mcr",
    "name": "MEL-Cardinal Red-Matte",
    "hex": "rgba(190, 0, 0, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mag",
    "name": "MEL-Antique Gold-Matte",
    "hex": "rgba(132, 118, 77, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mip",
    "name": "MEL-Iris Purple-Matte",
    "vendor": "Meloria",
    "hex": "rgba(96, 63, 131, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mab",
    "name": "MEL-Azure Blue-Matte",
    "hex": "rgba(0, 70, 128, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_msl",
    "name": "MEL-Slate Grey-Matte",
    "hex": "rgba(84, 88, 90, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mtt",
    "name": "MEL-Tropical Teal-Matte",
    "hex": "rgba(13, 136, 144, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_mrg",
    "name": "MEL-Rose Gold-Matte",
    "hex": "rgba(202, 147, 150, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "mel_sas",
    "name": "MEL-Arctic Silver-Glossy",
    "vendor": "Meloria",
    "hex": "rgba(192, 192, 192, 255)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_smb",
    "name": "MEL-Midnight Black-Glossy",
    "hex": "rgba(36, 36, 36, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_svv",
    "name": "MEL-Vivid Violet-Glossy",
    "hex": "rgba(152, 29, 151, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_ssg",
    "name": "MEL-Sunflower Gold-Glossy",
    "hex": "rgba(218, 165, 32, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_scr",
    "name": "MEL-Cardinal Red-Glossy",
    "hex": "rgba(190, 0, 0, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_sag",
    "name": "MEL-Antique Gold-Glossy",
    "hex": "rgba(132, 118, 77, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_sip",
    "name": "MEL-Iris Purple-Glossy",
    "vendor": "Meloria",
    "hex": "rgba(96, 63, 131, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_sab",
    "name": "MEL-Azure Blue-Glossy",
    "hex": "rgba(0, 70, 128, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_ssg",
    "name": "MEL-Slate Grey-Glossy",
    "hex": "rgba(84, 88, 90, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_stt",
    "name": "MEL-Tropical Teal-Glossy",
    "hex": "rgba(13, 136, 144, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_srg",
    "name": "MEL-Rose Gold-Glossy",
    "hex": "rgba(202, 147, 150, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["large"]
  },
  {
    "id": "mel_das",
    "name": "MEL-Arctic Silver-Diamond",
    "vendor": "Meloria",
    "hex": "rgba(192, 192, 192, 255)",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dmb",
    "name": "MEL-Midnight Black-Diamond",
    "hex": "rgba(36, 36, 36, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dvv",
    "name": "MEL-Vivid Violet-Diamond",
    "hex": "rgba(152, 29, 151, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dsg",
    "name": "MEL-Sunflower Gold-Diamond",
    "hex": "rgba(218, 165, 32, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dcr",
    "name": "MEL-Cardinal Red-Diamond",
    "hex": "rgba(190, 0, 0, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dag",
    "name": "MEL-Antique Gold-Diamond",
    "hex": "rgba(132, 118, 77, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dip",
    "name": "MEL-Iris Purple-Diamond",
    "vendor": "Meloria",
    "hex": "rgba(96, 63, 131, 1)",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dab",
    "name": "MEL-Azure Blue-Diamond",
    "hex": "rgba(0, 70, 128, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dst",
    "name": "MEL-Slate Grey-Diamond",
    "hex": "rgba(84, 88, 90, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_dtt",
    "name": "MEL-Tropical Teal-Diamond",
    "hex": "rgba(13, 136, 144, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "mel_drg",
    "name": "MEL-Rose Gold-Diamond",
    "hex": "rgba(202, 147, 150, 1)",
    "vendor": "Meloria",
    "material": "aluminum",
    "finish": "diamond",
    "sizes": ["large"]
  },
  {
    "id": "trl_mal",
    "name": "TRL-Aluminum-Mirror",
    "vendor": "The Ring Lord",
    "hex": "rgba(228, 228, 224, 1)",
    "material": "aluminum",
    "finish": "mirror",
    "sizes": ["large"]
  },
  {
    "id": "trl_blk",
    "name": "TRL-Black",
    "vendor": "The Ring Lord",
    "hex": "rgba(32, 36, 39, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_blu",
    "name": "TRL-Blue",
    "vendor": "The Ring Lord",
    "hex": "rgba(17, 76, 173, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_brz",
    "name": "TRL-Bronze",
    "vendor": "The Ring Lord",
    "hex": "rgba(133, 108, 46, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_cpg",
    "name": "TRL-Champagne",
    "vendor": "The Ring Lord",
    "hex": "rgba(250, 214, 165, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  //////////////////////////////////////
  {
    "id": "trl_cpr",
    "name": "TRL-Copper-Shiny",
    "vendor": "The Ring Lord",
    "hex": "rgba(138, 99, 66, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  //////////////////////////////////////
  {
    "id": "trl_fst",
    "name": "TRL-Frost",
    "vendor": "The Ring Lord",
    "hex": "rgba(211, 212, 210, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_gld",
    "name": "TRL-Gold",
    "vendor": "The Ring Lord",
    "hex": "rgba(170, 166, 124, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_glm",
    "name": "TRL-Gold-Mirror",
    "vendor": "The Ring Lord",
    "hex": "rgba(207, 193, 146, 1)",
    "material": "aluminum",
    "finish": "mirror",
    "sizes": ["large"]
  },
  {
    "id": "trl_grn",
    "name": "TRL-Green",
    "vendor": "The Ring Lord",
    "hex": "rgba(24, 79, 47, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl-org",
    "name": "TRL-Orange",
    "vendor": "The Ring Lord",
    "hex": "rgba(210, 100, 32, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_pnk",
    "name": "TRL-Pink",
    "vendor": "The Ring Lord",
    "hex": "rgba(183, 51, 134, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_ppl",
    "name": "TRL-Purple",
    "vendor": "The Ring Lord",
    "hex": "rgba(105, 7, 181, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_red",
    "name": "TRL-Red",
    "vendor": "The Ring Lord",
    "hex": "rgba(146, 29, 19, 1)",
    "material": "aluminum",
    "finish": "matte",
    "sizes": ["large"]
  },
  {
    "id": "trl_clr",
    "name": "TRL-Clear-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(255, 255, 255, 0.25)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small", "large"]
  },
  {
    "id": "trl_blp",
    "name": "TRL-Black-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(43, 44, 39, 1)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small", "large"]
  },
  {
    "id": "trl_gtd",
    "name": "TRL-Glow in the Dark-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(216, 242, 179, .5)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small", "large"]
  },
  {
    "id": "trl_blp",
    "name": "TRL-Blue-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(17, 76, 173, .5)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small"]
  },
  {
    "id": "trl_gnp",
    "name": "TRL-Green-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(18, 153, 41, .5)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small"]
  },
  {
    "id": "trl_plp",
    "name": "TRL-Purple-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(108, 18, 153, .5)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small"]
  },
  {
    "id": "trl_rdp",
    "name": "TRL-Red-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(207, 43, 43, .5)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small"]
  },
  {
    "id": "trl_ywp",
    "name": "TRL-Yellow-Plastic",
    "vendor": "The Ring Lord",
    "hex": "rgba(247, 255, 102, .5)",
    "material": "plastic",
    "finish": "matte",
    "sizes": ["small"]
  },
  {
    "id": "trl_bkp",
    "name": "TRL-Black-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(32, 36, 39, 1)",
    "material": "aluminum",

    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_bip",
    "name": "TRL- Black Ice-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(74, 74, 74, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_rbp",
    "name": "TRL-Royal Blue-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(5, 52, 128, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_bzp",
    "name": "TRL-Bronze-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(133, 108, 46, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_cgp",
    "name": "TRL-Champagne-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(250, 214, 165, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_drp",
    "name": "TRL-Dark Rose-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(173, 38, 90, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_lpp",
    "name": "TRL-Light Purple-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(187, 128, 196, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_lgp",
    "name": "TRL-Lime Green-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(2, 209, 19, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true,
  },
  {
    "id": "trl_sfp",
    "name": "TRL-Seafoam-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(101, 201, 141, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_sbp",
    "name": "TRL-Sky Blue-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(102, 240, 250, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_ywp",
    "name": "TRL-Yellow-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(247, 255, 102, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_sgp",
    "name": "TRL-Sea Green-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(98, 222, 168, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_evp",
    "name": "TRL-Electric Violet-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(209, 59, 255, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_glp",
    "name": "TRL-Gold-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(170, 166, 124, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_gnp",
    "name": "TRL-Green-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(24, 79, 47, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_orp",
    "name": "TRL-Orange-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(210, 100, 32, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_pkp",
    "name": "TRL-Pink-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(252, 116, 214, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_ppp",
    "name": "TRL-Purple-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(105, 7, 181, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_rep",
    "name": "TRL-Red-Premium",
    "vendor": "The Ring Lord",
    "hex": "rgba(146, 29, 19, 1)",
    "brushed": false,
    "plastic": false,
    "shiny": true
  },
  {
    "id": "trl_tit",
    "name": "TRL-Titanium",
    "vendor": "The Ring Lord",
    "hex": "rgba(195, 195, 197, 1)",
    "material": "titanium",
    "finish": "matte",
    "sizes": ["medium", "large"]
  },
  {
    "id": "wgm_lime",
    "name": "WGM-Lime",
    "vendor": "Weave Got Maille",
    "hex": "rgba(164,231,142, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_lapis",
    "name": "WGM-Lapis",
    "vendor": "Weave Got Maille",
    "hex": "rgba(0, 159, 197, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_bubblegum",
    "name": "WGM-Bubblegum",
    "vendor": "Weave Got Maille",
    "hex": "rgba(240, 69, 166, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_violet",
    "name": "WGM-Violet",
    "vendor": "Weave Got Maille",
    "hex": "rgba(161, 55, 144, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_maui",
    "name": "WGM-Maui Blue",
    "vendor": "Weave Got Maille",
    "hex": "rgba(0, 198, 215, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_gunmetal",
    "name": "WGM-Gunmetal",
    "vendor": "Weave Got Maille",
    "hex": "rgba(156, 164, 176, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_paprika",
    "name": "WGM-Paprika",
    "vendor": "Weave Got Maille",
    "hex": "rgba(242, 131, 55, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_canary",
    "name": "WGM-Canary",
    "vendor": "Weave Got Maille",
    "hex": "rgba(241, 201, 68, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_mauve",
    "name": "WGM-Mauve",
    "vendor": "Weave Got Maille",
    "hex": "rgba(196, 109, 137, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_golden",
    "name": "WGM-Golden",
    "vendor": "Weave Got Maille",
    "hex": "rgba(234, 197, 146, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_myrtle",
    "name": "WGM-Myrtle Green",
    "vendor": "Weave Got Maille",
    "hex": "rgba(53, 153, 132, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },

  {
    "id": "gm_marsala",
    "name": "WGM-Marsala",
    "vendor": "Weave Got Maille",
    "hex": "rgba(185, 59, 64, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_henna",
    "name": "WGM-Henna",
    "vendor": "Weave Got Maille",
    "hex": "rgba(124, 71, 66, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_marmalade",
    "name": "WGM-Marmalade",
    "vendor": "Weave Got Maille",
    "hex": "rgba(230, 161, 108, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_platinum",
    "name": "WGM-Platinum",
    "vendor": "Weave Got Maille",
    "hex": "rgba(218, 214, 211, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_candyapple",
    "name": "WGM-Candy Apple",
    "vendor": "Weave Got Maille",
    "hex": "rgba(225, 66, 64, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_luckypenny",
    "name": "WGM-Lucky Penny",
    "vendor": "Weave Got Maille",
    "hex": "rgba(200, 118, 85, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_pumpkin",
    "name": "WGM-Pumpkin",
    "vendor": "Weave Got Maille",
    "hex": "rgba(248, 136, 7, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_shamrock",
    "name": "WGM-Shamrock",
    "vendor": "Weave Got Maille",
    "hex": "rgba(56, 141, 84, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_sourapple",
    "name": "WGM-Sour Apple",
    "vendor": "Weave Got Maille",
    "hex": "rgba(176, 186, 78, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_cobalt",
    "name": "WGM-Cobalt",
    "vendor": "Weave Got Maille",
    "hex": "rgba(15, 91, 163, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_lilac",
    "name": "WGM-Lilac",
    "vendor": "Weave Got Maille",
    "hex": "rgba(112, 93, 191, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_turq",
    "name": "WGM-Turquoise",
    "vendor": "Weave Got Maille",
    "hex": "rgba(0, 180, 218, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wgm_onyx",
    "name": "WGM-Onyx",
    "vendor": "Weave Got Maille",
    "hex": "rgba(62, 61, 64, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large"],
  },
  {
    "id": "wcc_teal",
    "name": "WCC-Teal",
    "vendor": "West Coast Chainmail",
    "hex": "rgba(0,128,128, 1)",
    "material": "aluminum",
    "finish": "",
    "sizes": ["small", "large"],
  },
  {
    "id": "dw_shadblk",
    "name": "DW-Shadowy Black",
    "vendor": "DraconicWares",
    "hex": "rgba(16, 24, 32, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_snowwhite",
    "name": "DW-Snowy White",
    "vendor": "DraconicWares",
    "hex": "rgba(244, 245, 240, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_firered",
    "name": "DW-Fiery Red",
    "vendor": "DraconicWares",
    "hex": "rgba(208, 28, 31, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_bldorng",
    "name": "DW-Blood Orange",
    "vendor": "DraconicWares",
    "hex": "rgba(251, 139, 35, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_turq",
    "name": "DW-Turquoise Blue",
    "vendor": "DraconicWares",
    "hex": "rgba(0, 163, 224, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_ameviolet",
    "name": "DW-Amethyst Violet",
    "vendor": "DraconicWares",
    "hex": "rgba(117, 59, 189, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_creamsicle",
    "name": "DW-Creamsicle Orange",
    "vendor": "DraconicWares",
    "hex": "rgba(252, 76, 2, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_gldyel",
    "name": "DW-Golden Yellow",
    "vendor": "DraconicWares",
    "hex": "rgba(255, 215, 0, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_emerald",
    "name": "DW-Emerald Green",
    "vendor": "DraconicWares",
    "hex": "rgba(0, 115, 54, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_sapphire",
    "name": "DW-Sapphire Blue",
    "vendor": "DraconicWares",
    "hex": "rgba(0, 35, 156, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_mint",
    "name": "DW-Mint Green",
    "vendor": "DraconicWares",
    "hex": "rgba(13, 176, 43, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_royalpur",
    "name": "DW-Royal Purple",
    "vendor": "DraconicWares",
    "hex": "rgba(78, 0, 142, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_cottoncandy",
    "name": "DW-Cotton Candy Pink",
    "vendor": "DraconicWares",
    "hex": "rgba(255, 169, 214, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  },
  {
    "id": "dw_chocobrn",
    "name": "DW-Chocolate Brown",
    "vendor": "DraconicWares",
    "hex": "rgba(98, 59, 42, 1)",
    "material": "aluminum",
    "finish": "shiny",
    "sizes": ["small", "large", "x-large"],
  }
];