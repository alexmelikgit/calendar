import type { Localized, MonthTheme } from "./types";

/**
 * Month themes. Each month features one feast; the Armenian texts come
 * from the team's document "Տոներ կարճ".
 *
 * ILLUSTRATIONS: put one image per month in /public/illustrations with the
 * name given in `file` below (month-01.jpg … month-12.jpg). Until a file is
 * there, the page shows a placeholder with the expected file name.
 * Recommended: JPG, portrait, about 1414×2000. `focus` picks which part
 * stays visible in the shorter banner on phones.
 */

type Raw = {
  title: Localized;
  text: Localized;
  featuredFeast: string;
  accent: string;
  focus?: string;
};

const raw: Raw[] = [
  // 1 — January
  {
    title: { hy: "Սուրբ Ծնունդ և Աստվածահայտնություն", en: "Holy Nativity and Theophany" },
    text: {
      hy: "Սուրբ Ծնունդը միավորում է Հիսուս Քրիստոսի ծննդյան և Աստվածահայտնության խորհուրդները։ Տոնի կարևոր ծեսերից է Սուրբ Պատարագից հետո կատարվող Ջրօրհնեքը, որը հիշատակում է Հիսուսի մկրտությունը Հորդանան գետում։ Ավանդական տոնական սեղանին մատուցվում են ձուկ, չամիչով փլավ և անուշեղեն։ Ճրագալույցի երեկոյան երեխաները Գոտեկախուկի ծեսն են անում՝ վառվող ճրագներով տնետուն էին շրջում և երգում ավետիսներ։",
      en: "The Holy Nativity unites the mysteries of the Nativity and the Theophany of Jesus Christ. A key rite of the feast is the Blessing of Water after the Divine Liturgy, recalling Jesus' baptism in the Jordan. The festive table traditionally has fish, rice pilaf with raisins and sweets. On the evening of Chragaluyts, children perform the Gotekakhuk rite, going from house to house with lit lanterns and singing glad tidings.",
    },
    featuredFeast: "christmas",
    accent: "#9E2333",
  },
  // 2 — February
  {
    title: { hy: "Բուն Բարեկենդան", en: "Great Barekendan" },
    text: {
      hy: "Բուն Բարեկենդանը Մեծ պահքին նախորդող տոն է, որը ժողովրդական ավանդույթում նշանավորվել է ուրախությամբ, առատությամբ և դիմակավորված խաղերով։ Տոնի ամենաբնորոշ առանձնահատկություններից էին դիմակավորված կերպարները, թատերախաղերն ու խնջույքները, իսկ տոնական սեղանին առանձնահատուկ տեղ ունեին մսային ու կաթնային ուտեստները, ձուն, հալվան ու գաթան` առատ յուղով։",
      en: "Great Barekendan is the feast before Great Lent, celebrated in folk tradition with joy, abundance and masked games. Masked characters, theatrical plays and feasting were its hallmarks, and the festive table gave pride of place to meat and dairy dishes, eggs, halva and gata made with plenty of fat.",
    },
    featuredFeast: "barekendan",
    accent: "#B0521C",
  },
  // 3 — March
  {
    title: { hy: "Սուրբ Հարություն՝ Զատիկ", en: "Holy Resurrection — Easter" },
    text: {
      hy: "Զատիկը Հայ Առաքելական եկեղեցու հինգ տաղավար տոներից է՝ նվիրված Հիսուս Քրիստոսի հարությանը, որը քրիստոնեական հավատքի հիմքն է և խորհրդանշում է կյանքի հաղթանակը մահվան նկատմամբ։ Զատկին նախորդող պահքային շրջանը հսկում էր Ակլատիզ օրացույց-տիկնիկը իր յոթ շաբաթները խորհրդանշող փետուրներով, որոնցից վերջինը Զատիկն էր։ Այդ օրը նոր նշանված աղջիկներին փեսացուները զատկական ուտեստներով ու քաղցրավենիքով լի սկուտեղ՝ փայ են տանում, իսկ ձվախաղերը տոնի ամենասիրված սովորույթներից են։",
      en: "Easter is one of the five Tabernacle feasts of the Armenian Apostolic Church, dedicated to the Resurrection of Jesus Christ — the foundation of the Christian faith and the victory of life over death. The Lenten period before Easter was watched over by Aklatiz, a calendar doll with feathers marking its seven weeks, the last of which was Easter. On that day, fiancés bring their newly engaged girls a tray full of Easter dishes and sweets as a share (pay), and egg-tapping games are among the best-loved customs.",
    },
    featuredFeast: "easter",
    accent: "#9E2333",
  },
  // 4 — April
  {
    title: { hy: "Կանաչ կիրակի", en: "Green Sunday" },
    text: {
      hy: "Կանաչ կիրակին նշվում է Զատկից երեք շաբաթ անց և խորհրդանշում Քրիստոսի հիմնադրած Եկեղեցու աճն ու տարածումը։ Կանաչ գույնը կապվում է գարնան զարթոնքի, բնության ծաղկման և կյանքի շարունակականության հետ՝ հիշեցնելով հարության ու հավիտենական կյանքի խորհուրդը։ Ժողովրդական ավանդույթում օրը նշանավորվում էր ուխտագնացություններով, երգ ու պարով և բացօթյա տոնախմբություններով։",
      en: "Green Sunday is held three weeks after Easter and symbolizes the growth and spread of the Church founded by Christ. The color green is tied to the awakening of spring, blooming nature and the continuity of life, recalling the mystery of resurrection and eternal life. In folk tradition the day was marked by pilgrimages, songs and dances, and outdoor celebrations.",
    },
    featuredFeast: "kanach-kiraki",
    accent: "#5C6A35",
  },
  // 5 — May
  {
    title: { hy: "Համբարձում", en: "Ascension" },
    text: {
      hy: "Համբարձումը նշվում է Սուրբ Հարությունից 40 օր անց՝ հիշատակելով Հիսուս Քրիստոսի համբարձումը։ Ժողովրդական ավանդույթում այն սիրո և երիտասարդության տոն էր․ աղջիկները ծաղիկներ ու յոթ աղբյուրից ջուր էին հավաքում, իսկ վիճակի փարչի վրա տեղադրում «Արուս» կոչվող ծիսական տիկնիկը՝ հարսնացուի կերպարով։ Փարչի մեջ գցված զարդերի միջոցով, մանիների՝ վիճակի երգերի ուղեկցությամբ, գուշակում էին աղջիկների բախտն ու ապագան։ Տոնական հյուրասիրությունը ավանդական կաթնովն է ։",
      en: "Ascension is held 40 days after Holy Resurrection, commemorating the ascension of Jesus Christ. In folk tradition it was a feast of love and youth: girls gathered flowers and water from seven springs, and placed a ritual doll called \"Arus\", in the image of a bride, on the vichak jug. Using the jewelry dropped into the jug, accompanied by vichak songs (manis), they foretold the girls' fortune and future. The traditional festive treat is katnov.",
    },
    featuredFeast: "ascension",
    accent: "#3B6680",
  },
  // 6 — June
  {
    title: { hy: "Սուրբ Կարապետի ուխտ", en: "Pilgrimage to Surb Karapet" },
    text: {
      hy: "Մշո Սուրբ Կարապետի վանքը հայ ժողովրդի ամենանվիրական ուխտավայրերից էր։ Որոշ ուխտավորներ յոթ տարի շարունակ՝ Համբարձումից մինչև Վարդավառ, յոթ շաբաթ պահք էին պահում՝ ուխտագնացությանը նախապատրաստվելով աղոթքով ու ծոմապահությամբ։ Ուխտի համար մարդիկ Սուրբ Կարապետի անունով ցորեն էին ցանում, իսկ բերքը վաճառելուց ստացված գումարով մեկնում Տարոնի Գլակա վանք։ Ուխտավորները սրբից հայցում էին առողջություն, զավակ, ուժ ու իրենց նվիրական երազանքների իրականացումը։",
      en: "The Monastery of Surb Karapet in Mush was one of the most sacred pilgrimage sites of the Armenian people. For seven years in a row, some pilgrims kept a seven-week fast from Ascension to Vardavar, preparing with prayer and fasting. People sowed wheat in Surb Karapet's name and used the money from the harvest to travel to the Glak monastery in Taron, where they asked the saint for health, children, strength and their dearest wishes.",
    },
    featuredFeast: "surb-karapet",
    accent: "#8A3A1E",
  },
  // 7 — July
  {
    title: { hy: "Վարդավառ", en: "Vardavar" },
    text: {
      hy: "Վարդավառը Հայ Առաքելական եկեղեցու հինգ տաղավար տոներից է՝ նվիրված Հիսուս Քրիստոսի Պայծառակերպությանը։ Ժողովրդական ավանդույթում այն ուղեկցվում էր միմյանց ջրելու, ծաղիկներ նվիրելու, հասկերն օրհնության տանելու և խնդումի ծեսով, որի ընթացքում խաչաձև ծառը զարդարում էին խնձորներով, վարունգներով ու վարդերով։ Որոշ բնակավայրերում մինչև տոնը խնձոր չէին ուտում՝ պահպանելով «խնձորի պասը», իսկ Վարդավառի գիշերը խարույկի վրա խորովում էին տարվա առաջին խնձորները։ Տոնի հատուկ կերպարն ՝ Նուրի ծիսական տիկնկիը՝ նվիրված ջրի և անձրևի պաշտամունքին։",
      en: "Vardavar is one of the five Tabernacle feasts of the Armenian Apostolic Church, dedicated to the Transfiguration of Jesus Christ. In folk tradition it involved splashing one another with water, giving flowers, taking ears of grain to be blessed, and a rite called khndum, during which a cross-shaped tree was decorated with apples, cucumbers and roses. In some places people did not eat apples until the feast, keeping the \"apple fast\", and on the night of Vardavar the first apples of the year were roasted over a bonfire. The feast's special figure is Nur, a ritual doll devoted to the cult of water and rain.",
    },
    featuredFeast: "vardavar",
    accent: "#2F6F7E",
  },
  // 8 — August
  {
    title: { hy: "Խաղողօրհնեք", en: "Blessing of the Grapes" },
    text: {
      hy: "Խաղողօրհնեքը Սուրբ Աստվածածնի Վերափոխման տաղավար տոնի ժողովրդական անվանումն է (նշվում է օգոստոսի 15-ի մերձակա կիրակի օրը)՝ նվիրված նոր բերքի խաղողի օրհնությանը։ Այն խորհրդանշում է երախտագիտություն Աստծուն, բերքառատություն և ընտանիքի միասնություն։  Ուխտագնացություններն ուղեկցվում էին մատաղի արարողություններով։ Սովորաբար զոհաբերում էին ուլ, ոչխար, և աքլոր։",
      en: "Khaghoghorhnek is the folk name of the Tabernacle feast of the Assumption of the Holy Mother of God (held on the Sunday closest to August 15), dedicated to blessing the new harvest of grapes. It stands for gratitude to God, a plentiful harvest and family unity. Pilgrimages were accompanied by matagh rites; a lamb, a sheep and a rooster were usually sacrificed.",
    },
    featuredFeast: "assumption",
    accent: "#6B3A6E",
  },
  // 9 — September
  {
    title: { hy: "Խաչվերաց", en: "Exaltation of the Holy Cross" },
    text: {
      hy: "Խաչվերացը Հայ Եկեղեցու վերջին տաղավար տոնն է (նշվում է սեպտեմբերի 11–17-ի կիրակի օրը)՝ նվիրված Սուրբ Խաչի բարձրացմանն ու Երուսաղեմ վերադարձին։ Եկեղեցական արարողություններից են թափորը, Անդաստանի կարգը և ռեհանի օրհնությունը։ Ժողովրդական ավանդույթում այն նշանավորվել է մատաղով, տոնական սեղաններով, երգ-պարով և հանգուցյալների հիշատակությամբ։",
      en: "The Exaltation of the Holy Cross is the last Tabernacle feast of the Armenian Church (held on the Sunday between September 11 and 17), dedicated to the raising of the Holy Cross and its return to Jerusalem. Its rites include a procession, the Andastan service and the blessing of basil. In folk tradition it was marked by matagh, festive tables, songs and dances, and remembrance of the departed.",
    },
    featuredFeast: "holy-cross",
    accent: "#8A3A1E",
  },
  // 10 — October
  {
    title: { hy: "Թարգմանչաց տոն", en: "Feast of the Holy Translators" },
    text: {
      hy: "Թարգմանչաց տոնը նվիրված է Մեսրոպ Մաշտոցին, Սահակ Պարթևին և հայ թարգմանիչներին՝ խորհրդանշելով 5-րդ դարի գրերի գյուտն ու թարգմանական շարժումը։ Շնորհիվ թարգմանությունների՝ հայերենը դարձավ գիտության, կրթության ու հոգևոր կյանքի լեզու։ Տոնը Հայ Առաքելական Եկեղեցում նշվում է Սուրբ Պատարագով և սրբերի հիշատակությամբ։",
      en: "The Feast of the Holy Translators is dedicated to Mesrop Mashtots, Sahak Partev and the Armenian translators, symbolizing the invention of the alphabet and the translation movement of the 5th century. Thanks to the translations, Armenian became a language of science, education and spiritual life. In the Armenian Apostolic Church the feast is marked with the Divine Liturgy and the commemoration of the saints.",
    },
    featuredFeast: "translators",
    accent: "#3B6680",
  },
  // 11 — November
  {
    title: { hy: "Նախրաթողի պահք", en: "Nakhratogh Fast" },
    text: {
      hy: "Նախրաթողի պահքը աշնանային պահք է՝ կապված ցրտերի պատճառով նախիրն արոտավայր չտանելու, ամառային գյուղատնտեսական աշխատանքների ավարտի և ձմռան նախապատրաստության հետ։ Այն խորհրդանշում է ավանդական կենցաղի և բնության եղանակային փոփոխությունների սերտ կապը։",
      en: "Nakhratogh is an autumn fast tied to the time when, because of the cold, the herds were no longer taken to pasture — the end of the summer farm work and the start of preparing for winter. It reflects the close bond between traditional rural life and the changing seasons.",
    },
    featuredFeast: "nakhratogh",
    accent: "#5C6A35",
  },
  // 12 — December
  {
    title: { hy: "Ամանոր", en: "Amanor — New Year" },
    text: {
      hy: "Հայոց ավանդական Ամանորը նախկինում նշվել է Նավասարդին (օգոստոսի 11-ին), իսկ հետագայում՝ հունվարի 1-ին։ Տոնի գլխավոր սովորույթներն էին գալիք տարվա բախտն ու ընթացքը գուշակող տարեհացի և ասիլ-վասիլների պատրաստումը։ Ամանորի սեղանին դրվում էին մրգեր, չրեր, ընկուզեղեն ու անուշապուր, իսկ տարին բարօրությամբ սկսելու նախապայման էին համարվում տան մաքրությունը, հաշտությունն ու պարտքերի վերադարձը։ Տարին սկսում էին մեղր ճաշակելով՝ նոր տարվա քաղցրությունն ու բարեհաջող ընթացքն ապահովելու համար։ Տոնին բնորոշ են նաև ավանդական ընկուզախաղերն ու գնդախաղերը։",
      en: "The traditional Armenian New Year was once celebrated on Navasard (August 11) and later on January 1. Its main customs were baking the tarehats bread and making asil-vasil dough figures, both used to foretell the luck and course of the coming year. The table held fruit, dried fruit, nuts and anushapur, and a clean house, reconciliation and repaid debts were thought essential to starting the year well. The year was begun by tasting honey, to ensure the sweetness and success of the new year. Traditional walnut games and ball games are also typical of the feast.",
    },
    featuredFeast: "amanor",
    accent: "#B0521C",
  },
];

export const monthThemes: MonthTheme[] = raw.map((m, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    month: i + 1,
    title: m.title,
    text: m.text,
    featuredFeast: m.featuredFeast,
    accent: m.accent,
    illustration: {
      file: `month-${n}.png`,
      focus: m.focus ?? "50% 35%",
      alt: {
        hy: `Ամսվա նկարազարդում՝ ${m.title.hy}`,
        en: `Month illustration: ${m.title.en}`,
      },
    },
  };
});
