/*
 * FOREST MISSION 88 — embedded Greek / English language layer.
 * No translation API is required at runtime.
 */
const FM_LANG_KEY = 'dasologio-forest-mission-language';
let FM_LANG = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'el' || q === 'en') return q;
  try {
    const saved = localStorage.getItem(FM_LANG_KEY);
    if (saved === 'el' || saved === 'en') return saved;
  } catch (e) {}
  return 'el';
})();

function fmSetLanguage(lang, opts={}) {
  if (lang !== 'el' && lang !== 'en') return;
  FM_LANG = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem(FM_LANG_KEY, lang); } catch(e) {}
  if (opts.reload) {
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    location.href = u.toString();
  }
}
function fmIsEnglish(){ return FM_LANG === 'en'; }

const FM_UI = {
  el: {
    mapAria:'Διαδραστικός χάρτης δασικών οικοσυστημάτων',
    greekMap:'Ελληνικός δασικός χάρτης',
    collapse:'Σύμπτυξη / ανάπτυξη αποστολής',
    loading:'Φόρτωση αποστολής…', preparing:'Ο χάρτης προετοιμάζεται.',
    missionForest:'Βρες το δασικό οικοσύστημα', missionSpecies:'Species lock: βρες το σωστό δάσος',
    lockedRegion:'Ζούμαρε για να ξεκλειδώσεις γεωγραφικό ίχνος',
    lockedBiome:'Το οικοσύστημα αποκαλύπτεται στο επόμενο zoom',
    lockedSpecies:'Κοντινό zoom = βοτανική ταυτότητα',
    smartHint:'💡 ΕΞΥΠΝΗ ΒΟΗΘΕΙΑ', greece:'ΕΛΛΑΔΑ', scanSub:'σάρωση θέας', hotSub:'απόσταση στόχου', biomeSub:'χρωματικός κώδικας', cameraSub:'χωρίς reveal', atlasSub:'88 δάση + είδη',
    tabForests:'🗺️ 88 ΔΑΣΗ', tabSpecies:'🌿 SPECIES', tabResearch:'🔬 RESEARCH',
    revealEco:'ΟΙΚΟΣΥΣΤΗΜΑ / ΔΑΣΙΚΗ ΖΩΝΗ', revealThreat:'ΚΥΡΙΑ ΑΠΕΙΛΗ', revealSpecies:'ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΕΙΔΗ', revealUnique:'ΓΙΑΤΙ ΕΙΝΑΙ ΜΟΝΑΔΙΚΟ',
    openSource:'🔬 ΑΝΟΙΓΜΑ ΠΗΓΗΣ', nextMission:'ΕΠΟΜΕΝΗ ΑΠΟΣΤΟΛΗ →', newMission:'↻ ΝΕΑ ΑΠΟΣΤΟΛΗ', openAtlas:'📚 ΑΝΟΙΓΜΑ ATLAS', home:'⌂ ΑΡΧΙΚΗ',
    searchPlaceholder:'Αναζήτηση δάσους / περιοχής…', allBiomes:'Όλα τα biomes',
    localMosaic:'Τοπικό μωσαϊκό ειδών', ecosystemsTap:'οικοσυστήματα · πάτησε για χάρτη',
    accuracyRule:'Accuracy rule:', researchAccuracy:'τα σημεία του χάρτη είναι representative gameplay anchors — όχι νομικά όρια ή survey-grade centroids. Η οικολογική ταυτότητα είναι ξεχωριστό πεδίο από τη γεωμετρία.',
    datasetTitle:'Τι έχει μέσα το dataset', sourcesTitle:'Πηγές', progressTitle:'Progress', dataVersion:'Data version',
    datasetCopy:(n)=>`88 δασικά οικοσυστήματα από τον κατάλογο ForestLife, ${n} signature woody taxa, δασική ζώνη, τύπο οικοσυστήματος, threat cue και πηγή ανά εγγραφή.`,
    bookCopy:'Για ταξινομικό και βλαστητικό πλαίσιο χρησιμοποιείται η «Δασική Βοτανική — Αυτοφυή δέντρα και θάμνοι της Ελλάδας» του Γ. Κοράκη (2015), όπως δόθηκε μαζί με το project.',
    progressCopy:(n)=>`Έχεις ξεκλειδώσει ${n}/88 οικοσυστήματα στο persistent atlas.`,
    finishAtlas:'Το persistent atlas κράτησε κάθε οικοσύστημα που ξεκλείδωσες. Συνέχισε μέχρι το 88/88.', finishOther:'Κάθε αποστολή χτίζει το δικό σου δασικό atlas της Ελλάδας.',
    team1:'Ομάδα 1', team2:'Ομάδα 2', turn:'σειρά',
    sourceCatalog:'GreekForests / ForestLife — Κατάλογος δασών'
  },
  en: {
    mapAria:'Interactive map of Greek forest ecosystems',
    greekMap:'Greek Forest Atlas',
    collapse:'Collapse / expand mission',
    loading:'Loading mission…', preparing:'Preparing the map.',
    missionForest:'Find the forest ecosystem', missionSpecies:'Species Lock: find the right forest',
    lockedRegion:'Zoom in to unlock the geographic trace',
    lockedBiome:'The ecosystem is revealed at the next zoom level',
    lockedSpecies:'Close zoom = botanical identity',
    smartHint:'💡 SMART HINT', greece:'GREECE', scanSub:'scan viewport', hotSub:'target distance', biomeSub:'ecosystem colors', cameraSub:'direction only', atlasSub:'88 forests + species',
    tabForests:'🗺️ 88 FORESTS', tabSpecies:'🌿 SPECIES', tabResearch:'🔬 RESEARCH',
    revealEco:'ECOSYSTEM / VEGETATION ZONE', revealThreat:'MAIN PRESSURES', revealSpecies:'SIGNATURE SPECIES', revealUnique:'WHY IT STANDS OUT',
    openSource:'🔬 OPEN SOURCE', nextMission:'NEXT MISSION →', newMission:'↻ NEW MISSION', openAtlas:'📚 OPEN ATLAS', home:'⌂ HOME',
    searchPlaceholder:'Search forest / region…', allBiomes:'All biomes',
    localMosaic:'Local mosaic of woody species', ecosystemsTap:'ecosystems · tap to map',
    accuracyRule:'Accuracy rule:', researchAccuracy:'map points are representative gameplay anchors, not legal forest boundaries or survey-grade centroids. Ecological identity is stored separately from map geometry.',
    datasetTitle:'What is in the dataset', sourcesTitle:'Sources', progressTitle:'Progress', dataVersion:'Data version',
    datasetCopy:(n)=>`88 forest ecosystems from the ForestLife catalogue, ${n} signature woody taxa, vegetation zone, ecosystem type, threat cue and source link for every record.`,
    bookCopy:'The taxonomic and vegetation framework uses G. Korakis, Forest Botany — Native Trees and Shrubs of Greece (2015), supplied with the project.',
    progressCopy:(n)=>`You have unlocked ${n}/88 ecosystems in the persistent atlas.`,
    finishAtlas:'Your persistent atlas saved every ecosystem you unlocked. Keep exploring until 88/88.', finishOther:'Every mission builds your own ecological atlas of Greece.',
    team1:'Team 1', team2:'Team 2', turn:'turn',
    sourceCatalog:'GreekForests / ForestLife — Forest Catalogue'
  }
};
function fmT(key, ...args){
  const v = (FM_UI[FM_LANG] && FM_UI[FM_LANG][key]) ?? FM_UI.el[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}

const FM_SPECIES_EN = {
  pinus_halepensis:{common:'Aleppo pine',guild:'Mediterranean conifer',fact:'A warm-adapted Mediterranean pine, especially characteristic of low-elevation and coastal zones.'},
  pinus_brutia:{common:'Calabrian pine',guild:'Eastern Mediterranean conifer',fact:'A dominant pine in many forests of eastern Greece, the Aegean islands and Crete.'},
  pinus_nigra:{common:'Black pine',guild:'Montane conifer',fact:'An important mountain forest tree with a wide distribution across mainland Greece.'},
  pinus_sylvestris:{common:'Scots pine',guild:'Cold-adapted conifer',fact:'A northern species that in Greece is mainly restricted to cool mountain sites.'},
  pinus_heldreichii:{common:'Bosnian pine',guild:'High-mountain conifer',fact:'A Balkan mountain pine characteristic of the high zones of Olympus and other ranges.'},
  pinus_pinea:{common:'Stone pine',guild:'Coastal Mediterranean conifer',fact:'Forms iconic coastal woodlands, often on or behind sand dunes.'},
  abies_cephalonica:{common:'Kefalonian fir',guild:'Greek mountain conifer',fact:'A Greek endemic fir forming extensive mountain forests in southern and central Greece.'},
  abies_borisii:{common:'Bulgarian fir',guild:'Montane conifer',fact:'An important fir of central and northern Greece, often mixed with beech.'},
  picea_abies:{common:'Norway spruce',guild:'Cold-adapted conifer',fact:'Extremely restricted in Greece, with emblematic natural stands in the Rhodope mountains.'},
  fagus_sylvatica:{common:'European beech',guild:'Mesic deciduous tree',fact:'A dominant tree of many mountain forests in central and northern Greece.'},
  quercus_frainetto:{common:'Hungarian oak',guild:'Warm deciduous oak',fact:'One of the commonest oaks of mainland Greece and a key tree of the sub-Mediterranean zone.'},
  quercus_pubescens:{common:'Downy oak',guild:'Warm deciduous oak',fact:'A broad-tolerance oak common in dry and submontane woodland.'},
  quercus_coccifera:{common:'Kermes oak',guild:'Evergreen oak',fact:'One of the most characteristic sclerophyllous species of Mediterranean woodland and shrubland.'},
  quercus_ilex:{common:'Holm oak',guild:'Evergreen oak',fact:'A sclerophyllous evergreen oak that can form impressive mature forests.'},
  quercus_macrolepis:{common:'Valonia oak',guild:'Mediterranean deciduous oak',fact:'A drought-tolerant low-elevation oak with important relict woodlands in Greece.'},
  quercus_robur:{common:'Pedunculate oak',guild:'Moisture-loving deciduous oak',fact:'A moisture-demanding oak, rare in Greece and characteristic of some lowland wet forests.'},
  castanea_sativa:{common:'Sweet chestnut',guild:'Mesic deciduous tree',fact:'A forest and cultivated tree of wetter mountain and submontane sites.'},
  carpinus_betulus:{common:'European hornbeam',guild:'Central-European deciduous tree',fact:'A mesic tree occurring in cool forests and shaded ravines.'},
  taxus_baccata:{common:'European yew',guild:'Shade-tolerant conifer',fact:'A long-lived conifer, usually scattered in old and moist mountain forests.'},
  juniperus_excelsa:{common:'Greek juniper',guild:'Montane juniper',fact:'Forms distinctive mountain juniper woodland, notably in the Prespa region.'},
  juniperus_foetidissima:{common:'Stinking juniper',guild:'High-mountain juniper',fact:'A tree of rocky mountain sites that can grow close to the natural treeline.'},
  juniperus_drupacea:{common:'Syrian juniper',guild:'Eastern Mediterranean juniper',fact:'A rare juniper with an especially important presence on Mount Parnon.'},
  cupressus_sempervirens:{common:'Mediterranean cypress',guild:'Mediterranean conifer',fact:'Important natural populations and mountain stands occur in Crete and the southeastern Aegean.'},
  platanus_orientalis:{common:'Oriental plane',guild:'Riparian broadleaf tree',fact:'A characteristic tree of streams, rivers and moist ravines.'},
  populus_alba:{common:'White poplar',guild:'Riparian broadleaf tree',fact:'A typical tree of riparian galleries, often growing with willows.'},
  salix_alba:{common:'White willow',guild:'Riparian broadleaf tree',fact:'A water-loving tree of large rivers and floodplains.'},
  alnus_glutinosa:{common:'Black alder',guild:'Wetland broadleaf tree',fact:'Grows along rivers and streams on wet or seasonally flooded soils.'},
  fraxinus_angustifolia:{common:'Narrow-leaved ash',guild:'Moisture-loving broadleaf tree',fact:'An important component of some lowland and riparian forests.'},
  phoenix_theophrasti:{common:'Cretan date palm',guild:'Aegean endemic palm',fact:'An iconic eastern Mediterranean palm with famous natural groves in Crete.'},
  nerium_oleander:{common:'Oleander',guild:'Mediterranean riparian shrub',fact:'A characteristic shrub of warm Mediterranean streams and ravines.'},
  liquidambar_orientalis:{common:'Oriental sweetgum',guild:'Rare wetland broadleaf tree',fact:'A range-restricted tree of the eastern Aegean and Asia Minor, linked with moist valleys.'},
  phillyrea_latifolia:{common:'Broad-leaved mock privet',guild:'Evergreen Mediterranean shrub',fact:'A sclerophyllous species of maquis and Mediterranean woodland.'}
};
function fmSpecies(id){
  const s = speciesCodex[id];
  if (!s) return null;
  if (!fmIsEnglish()) return {...s,id};
  const en = FM_SPECIES_EN[id] || {};
  return {...s,...en,id};
}

const FM_BIOME_EN = {
  mediterranean_pine:'Mediterranean pine forest', montane_mixed:'Montane mixed forest', beech_oak:'Beech & oak forest', cold_conifer:'Cold-adapted conifer forest', fir_mountain:'Mountain fir forest', oak:'Oak forest', riparian:'Riparian / wet forest', coastal_dune:'Coastal forest & dunes', juniper:'Juniper woodland', evergreen:'Evergreen broadleaf woodland', palm:'Palm forest', cypress_pine:'Cypress & Calabrian pine', high_mountain:'Montane–subalpine mosaic'
};
function fmBiome(f){
  const b = BIOMES[f.biome] || {label:f.forestType,icon:'🌲',color:'#6ee7a1'};
  return fmIsEnglish() ? {...b,label:FM_BIOME_EN[f.biome] || b.label} : b;
}

const FM_FOREST_NAMES_EN = {
  kassandra:'Kassandra Forests, Chalkidiki', dragounteli:'Dragounteli Forest, Sithonia', chortiatis:'Chortiatis Forest', cholomontas:'Cholomontas–Stratoniko Forests', kerdylia_vertiskos:'Kerdylia–Vertiskos Forests', kroussia:'Kroussia Forests', kerkini:'Kerkini (Belles) Forests', pangaio:'Pangaio Forests', agistro_orvilos:'Agistro–Orvilos Forests', lailias:'Lailias Forest', nestos_delta:'Nestos Delta Riparian Forest (Kotza Orman)', petrova:'Petrota Forest', petrota:'Petrota Forest', rhodope_west_central:'Western & Central Rhodope Forests', papikio_east_rhodope:'Papikio & Eastern Rhodope Forests', dadia:'Dadia–Lefkimi–Aisymi Forests', panachaiko_klokos:'Panachaiko–Klokos–Kaniska Forests', erymanthos:'Erymanthos Forests', pieria:'Pieria Forests', vermio:'Vermio Forests', paiko:'Paiko Forests', voras:'Voras (Kaimaktsalan) Forests', tzena_pinovo:'Tzena–Pinovo Forests', askio:'Askio (Siniatsiko) Forests', vitsi:'Vitsi Forests', varnounta_triklario:'Varnounta–Triklario Forests', devas_prespa:'Mount Devas Forests (Prespa)', grammos:'Grammos Forests', vourinos:'Vourinos Forest', xiromero:'Xiromero Forests', parnon:'Parnon Forests', taygetos:'Taygetos Forests', mainalo:'Mainalo Forests', megalopoli:'Megalopoli Forests', lapithas:'Lapithas Forest (Amaliada)', foloi:'Foloi Forest', strofylia:'Strofylia Forest', zireia:'Zireia Forests', mongostos:'Mongostos Forest', chelmos_vouraikos:'Chelmos–Vouraikos Forests', eastern_corinthia_sofiko:'Eastern Corinthia–Sofiko Forests', geraneia:'Geraneia Forests', kithairon:'Kithairon Forests', parnitha:'Parnitha Forest', helikon:'Helikon Forests', ochi_dimosari:'Ochi Forests & Dimosari Gorge', dirfi:'Dirfi Forests', north_evia:'Northern Evia Forests', kallidromo:'Kallidromo Forests', parnassos:'Parnassos Forests', mavrovouni_thessaly:'Mavrovouni Forests, Thessaly', pelion:'Pelion Forests', kissavos:'Kissavos Forests', lower_olympus:'Lower Olympus Forests', olympus:'Olympus Forests', arakynthos:'Arakynthos Forests', panaitoliko_kaliakouda:'Panaitoliko–Kaliakouda Forests', oiti:'Oiti Forests', tymfristos:'Tymfristos Forests', agrafa_plastira:'Argithea–Agrafa–Lake Plastira Forests', south_pindus_aspropotamos:'Southern Pindus–Aspropotamos Forests', north_pindus_mitsikeli:'Northern Pindus–Mitsikeli Forests', thasos:'Thasos Forests', tzoumerka:'Tzoumerka–Athamanika Forests', ori_valtou:'Ori Valtou Forests', vardousia:'Vardousia Forests', hasia_kamvounia:'Hasia–Kamvounia Forests', lesini:'Lesini Forest', lesvos:'Lesvos Forests', randi:'Randi Forest (Ikaria)', samos:'Samos Forests', symi:'Symi Forests', kos:'Kos Forests', rhodes:'Rhodes Forests', vai:'Vai Palm Forest', selakano_mino:'Selakano–Mino Forest', symi_viannos:'Symi–Viannos Forest', azilakodasos:'Azilakodasos Holm-Oak Forest (Malia)', lefka_ori:'White Mountains Forests', preveli:'Preveli Palm Forest', athos:'Mount Athos Forests', seich_sou:'Thessaloniki Urban Forest (Seich Sou)', rouvas:'Rouvas Forest', ainos:'Ainos Forest', schinias:'Schinias Forest', koukounaries:'Koukounaries Forest, Skiathos', axios:'Axios Riparian Forest', giona:'Giona Forests', mouries:'Mouries Wet Forest'
};

const FM_REGIONS_EN = {
'Χαλκιδική · Κεντρική Μακεδονία':'Chalkidiki · Central Macedonia','Θεσσαλονίκη · Κεντρική Μακεδονία':'Thessaloniki · Central Macedonia','Θεσσαλονίκη / Σέρρες':'Thessaloniki / Serres','Κιλκίς · Κεντρική Μακεδονία':'Kilkis · Central Macedonia','Σέρρες · Κεντρική Μακεδονία':'Serres · Central Macedonia','Καβάλα / Σέρρες':'Kavala / Serres','Ξάνθη / Καβάλα · ΑΜΘ':'Xanthi / Kavala · East Macedonia & Thrace','Ροδόπη / Έβρος · ΑΜΘ':'Rhodope / Evros · East Macedonia & Thrace','Δράμα / Ξάνθη · ΑΜΘ':'Drama / Xanthi · East Macedonia & Thrace','Ροδόπη · ΑΜΘ':'Rhodope · East Macedonia & Thrace','Έβρος · ΑΜΘ':'Evros · East Macedonia & Thrace','Αχαΐα · Δυτική Ελλάδα':'Achaia · Western Greece','Αχαΐα / Ηλεία':'Achaia / Elis','Πιερία / Ημαθία / Κοζάνη':'Pieria / Imathia / Kozani','Ημαθία / Κοζάνη':'Imathia / Kozani','Πέλλα / Κιλκίς':'Pella / Kilkis','Πέλλα / Φλώρινα':'Pella / Florina','Πέλλα · Κεντρική Μακεδονία':'Pella · Central Macedonia','Κοζάνη / Καστοριά':'Kozani / Kastoria','Φλώρινα / Καστοριά':'Florina / Kastoria','Φλώρινα / Πρέσπες':'Florina / Prespa','Καστοριά / Ιωάννινα':'Kastoria / Ioannina','Κοζάνη · Δυτική Μακεδονία':'Kozani · Western Macedonia','Αιτωλοακαρνανία · Δυτική Ελλάδα':'Aetolia-Acarnania · Western Greece','Αρκαδία / Λακωνία':'Arcadia / Laconia','Λακωνία / Μεσσηνία':'Laconia / Messenia','Αρκαδία · Πελοπόννησος':'Arcadia · Peloponnese','Ηλεία · Δυτική Ελλάδα':'Elis · Western Greece','Κορινθία · Πελοπόννησος':'Corinthia · Peloponnese','Αχαΐα · Πελοπόννησος':'Achaia · Peloponnese','Κορινθία / Δυτική Αττική':'Corinthia / West Attica','Δυτική Αττική / Βοιωτία':'West Attica / Boeotia','Αττική':'Attica','Βοιωτία · Στερεά Ελλάδα':'Boeotia · Central Greece','Νότια Εύβοια':'Southern Evia','Κεντρική Εύβοια':'Central Evia','Βόρεια Εύβοια':'Northern Evia','Φθιώτιδα / Φωκίδα':'Phthiotis / Phocis','Βοιωτία / Φωκίδα / Φθιώτιδα':'Boeotia / Phocis / Phthiotis','Λάρισα / Μαγνησία':'Larissa / Magnesia','Μαγνησία · Θεσσαλία':'Magnesia · Thessaly','Λάρισα · Θεσσαλία':'Larissa · Thessaly','Λάρισα / Πιερία':'Larissa / Pieria','Πιερία / Λάρισα':'Pieria / Larissa','Αιτωλοακαρνανία / Ευρυτανία':'Aetolia-Acarnania / Evrytania','Φθιώτιδα · Στερεά Ελλάδα':'Phthiotis · Central Greece','Ευρυτανία / Φθιώτιδα':'Evrytania / Phthiotis','Καρδίτσα / Ευρυτανία':'Karditsa / Evrytania','Τρίκαλα / Καρδίτσα':'Trikala / Karditsa','Ιωάννινα / Γρεβενά':'Ioannina / Grevena','Θάσος · ΑΜΘ':'Thasos · East Macedonia & Thrace','Άρτα / Ιωάννινα / Τρίκαλα':'Arta / Ioannina / Trikala','Αιτωλοακαρνανία / Άρτα':'Aetolia-Acarnania / Arta','Φωκίδα / Φθιώτιδα':'Phocis / Phthiotis','Τρίκαλα / Γρεβενά / Λάρισα':'Trikala / Grevena / Larissa','Λέσβος · Βόρειο Αιγαίο':'Lesvos · North Aegean','Ικαρία · Βόρειο Αιγαίο':'Ikaria · North Aegean','Σάμος · Βόρειο Αιγαίο':'Samos · North Aegean','Σύμη · Νότιο Αιγαίο':'Symi · South Aegean','Κως · Νότιο Αιγαίο':'Kos · South Aegean','Ρόδος · Νότιο Αιγαίο':'Rhodes · South Aegean','Λασίθι · Κρήτη':'Lasithi · Crete','Ηράκλειο / Λασίθι · Κρήτη':'Heraklion / Lasithi · Crete','Χανιά · Κρήτη':'Chania · Crete','Ρέθυμνο · Κρήτη':'Rethymno · Crete','Ηράκλειο · Κρήτη':'Heraklion · Crete','Κεφαλονιά · Ιόνια Νησιά':'Kefalonia · Ionian Islands','Σκιάθος · Θεσσαλία':'Skiathos · Thessaly','Θεσσαλονίκη / Κιλκίς':'Thessaloniki / Kilkis','Φωκίδα · Στερεά Ελλάδα':'Phocis · Central Greece'
};

function fmZoneEn(z){
  const exact={
    'Ευμεσογειακή':'Mediterranean evergreen zone','Παραμεσογειακή':'Sub-Mediterranean deciduous zone','Οξιάς-ελάτης':'Beech–fir zone','Ψυχρόβιων κωνοφόρων':'Cold-adapted conifer zone','Αζωνική υδροχαρής':'Azonal riparian / wetland vegetation','Ευμεσογειακή παράκτια':'Coastal Mediterranean zone','Ευμεσογειακή / παρόχια':'Mediterranean / riparian','Ευμεσογειακή / ορεινή':'Mediterranean → montane','Ευμεσογειακή / αζωνική':'Mediterranean / azonal','Ευμεσογειακή / περιαστική':'Mediterranean / peri-urban','Παραμεσογειακή / ορεινή':'Sub-Mediterranean / montane','Οξιάς-ελάτης / ψυχρόβιων κωνοφόρων':'Beech–fir / cold-conifer zone'
  };
  if(exact[z]) return exact[z];
  return z.replaceAll('Ευμεσογειακή','Mediterranean evergreen').replaceAll('Παραμεσογειακή','Sub-Mediterranean').replaceAll('παραμεσογειακή','sub-Mediterranean').replaceAll('οξιάς-ελάτης','beech–fir').replaceAll('Οξιάς-ελάτης','Beech–fir').replaceAll('ανωδασική','subalpine / above treeline').replaceAll('ορεινή','montane');
}
function fmThreatEn(text=''){
  const found=[];
  const add=(re,label)=>{if(re.test(text) && !found.includes(label))found.push(label)};
  add(/Πυρκαγ|πυρκαγ/i,'wildfire'); add(/τουρισ/i,'tourism pressure'); add(/κλιμα|ξηρασ|ξηρασία/i,'climate stress / drought'); add(/βόσκ/i,'grazing pressure'); add(/κατακερματ/i,'habitat fragmentation'); add(/υδρολογ|ροής|νερ/i,'hydrological change'); add(/εισβολ/i,'invasive species'); add(/ρύπαν/i,'pollution'); add(/γεωργ|αγροτικ/i,'agricultural pressure'); add(/αστικ|οικισ/i,'urban / development pressure'); add(/εξορ|μεταλλ/i,'mining / extraction'); add(/υλοτομ|ξύλευ/i,'logging / wood harvesting'); add(/κυνήγ/i,'illegal hunting / wildlife pressure'); add(/αναψυχ/i,'recreation pressure'); add(/διάβρω/i,'erosion'); add(/υποδομ|διάνοιξη/i,'infrastructure / access pressure'); add(/εχθρ|έντομα|παθογ/i,'forest pests / pathogens');
  return found.length ? found.join(', ') : 'local habitat and climate pressures';
}
function fmForest(f){
  if(!fmIsEnglish()) return f;
  const b=fmBiome(f); const species=(f.species||[]).map(id=>fmSpecies(id)).filter(Boolean);
  const speciesNames=species.slice(0,4).map(s=>s.common).join(', ');
  const region=FM_REGIONS_EN[f.region] || f.region;
  const name=FM_FOREST_NAMES_EN[f.id] || f.name;
  const zone=fmZoneEn(f.zone);
  const signature=`${b.label} in ${region}. Signature woody taxa in this game dataset: ${speciesNames || 'mixed native forest vegetation'}.`;
  const clue=`Search ${region}. Look for ${b.label.toLowerCase()} associated with ${species.slice(0,2).map(s=>s.common).join(' and ') || 'the local forest mosaic'}.`;
  return {...f,name,region,forestType:b.label,zone,signature,eco:signature,threat:fmThreatEn(f.threat),clue,hint:clue,title:name};
}

function fmStartCopy(){
  return fmIsEnglish() ? {
    hero:'All of Greece becomes a living game board: 88 forest ecosystems, signature species, vegetation zones, threats and a persistent Forest Atlas that grows as you explore.',
    start:'ACTIVATE FOREST RADAR →', choose:'CHOOSE YOUR MISSION', title:'How do you want to get lost in the forest?', intro:'The map is always the core: zoom, pan, scan, species clues and ecosystem hotspots.',
    modes:[
      ['GRAND ATLAS','Persistent expedition through the entire dataset. Every discovery is saved until you reach 88/88.','88 FORESTS · NO TIMER'],
      ['MAP BLITZ','12 ecosystems from different biomes. You have 8 minutes for score, streak and accuracy.','12 FORESTS · 8 MIN'],
      ['SPECIES HUNTER','The mission starts from a signature species. Track down the correct forest hotspot.','15 SPECIES MISSIONS'],
      ['FOREST DUEL','Two teams alternate on the same map. The highest field score wins.','16 MISSIONS · 2 TEAMS']
    ],
    team0:'🔵 Team 1 name', team1:'🟢 Team 2 name', random:'🎲 RANDOM NAMES', duel:'START DUEL →', note:'Research note: map points are representative gameplay anchors, not legal forest boundaries. Every record links to its ForestLife source.'
  } : {
    hero:'Ολόκληρη η Ελλάδα γίνεται game board: 88 δασικά οικοσυστήματα, signature είδη, δασικές ζώνες, threats και ένα persistent Forest Atlas που γεμίζει όσο παίζεις.',
    start:'ΕΝΕΡΓΟΠΟΙΗΣΗ FOREST RADAR →', choose:'ΔΙΑΛΕΞΕ ΑΠΟΣΤΟΛΗ', title:'Πώς θέλεις να χαθείς στο δάσος;', intro:'Το core gameplay είναι πάντα ο χάρτης: zoom, pan, scan, species clues και hotspot επιλογές.',
    modes:[
      ['GRAND ATLAS','Persistent expedition σε όλο το dataset. Κάθε unlock αποθηκεύεται μέχρι να φτάσεις 88/88.','88 FORESTS · NO TIMER'],
      ['MAP BLITZ','12 οικοσυστήματα από διαφορετικά biomes. Έχεις 8 λεπτά για score, streak και ακρίβεια.','12 FORESTS · 8 MIN'],
      ['SPECIES HUNTER','Η αποστολή ξεκινά από signature species και πρέπει να εντοπίσεις το σωστό δασικό hotspot.','15 SPECIES MISSIONS'],
      ['FOREST DUEL','Δύο ομάδες εναλλάσσονται στον ίδιο χάρτη. Κερδίζει η ομάδα με το καλύτερο field score.','16 MISSIONS · 2 TEAMS']
    ],
    team0:'🔵 Όνομα Ομάδας 1', team1:'🟢 Όνομα Ομάδας 2', random:'🎲 ΤΥΧΑΙΑ ΟΝΟΜΑΤΑ', duel:'START DUEL →', note:'Research note: οι χάρτες χρησιμοποιούν representative gameplay anchors, όχι νομικά όρια δασών. Κάθε record συνδέεται με την αντίστοιχη ForestLife πηγή.'
  };
}
