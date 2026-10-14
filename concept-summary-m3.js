// Korte "svar til eksamen" — E-handelsteknologier (m3).
Object.assign(CONCEPT_SUMMARY, {

  'cms': h`<p>Et <strong>CMS</strong> adskiller indhold fra kode, så man kan redigere produkter, priser og tekster i et admin-panel uden at kunne programmere. Shopify samler CMS, hosting og betaling i én platform, mens et mere traditionelt CMS som WordPress typisk kun løser selve indholdsdelen.</p>`,

  'open-source-vs-closed-source': h`<p><strong>Open source</strong> betyder, at koden er frit tilgængelig og kan ændres af alle, som med WordPress/WooCommerce. Closed source betyder, at leverandøren ejer koden, og man kun kan tilpasse gennem det interface og de API'er, de stiller til rådighed, som med Shopify. Valget er en afvejning mellem fuld frihed og selv ansvar for drift versus mindre fleksibilitet men ingen driftsbyrde.</p>`,

  'tema': h`<p>Et <strong>tema</strong> er det visuelle lag i en Shopify-butik — layout, farver og typografi, bygget i Liquid og adskilt fra produktdata og ordrer. Derfor kan man skifte tema uden at miste indhold, og valget bør afspejle, hvad og hvordan man sælger.</p>`,

  'wireframe': h`<p>Et <strong>wireframe</strong> er en grå skitse af en sides struktur — bokse for header, menu og CTA uden farver eller rigtigt indhold — der låser layout og brugerflow fast, før man designer. Det er langt billigere at rette en boks i et wireframe end at bygge om i et færdigt tema.</p>`,

  'ux-vs-ui': h`<p><strong>UX</strong> er selve oplevelsen og den underliggende struktur — er det let at finde varen og gennemføre et køb — mens UI er det visuelle udtryk ovenpå: farver, knapper og layout. Man arbejder typisk med UX først (struktur, wireframes) og UI bagefter, og et flot UI kan ikke redde en dårlig UX.</p>`,

  'waterfall-metoden': h`<p><strong>Waterfall</strong> er en sekventiel udviklingsmodel, hvor faser som krav, design, udvikling, test og lancering gennemføres i fast rækkefølge uden at gå tilbage undervejs. Det giver forudsigelighed og en klar tidsplan, men gør det dyrt at rette fejl, der først opdages sent — et typisk Shopify-eksamensprojekt følger ofte denne struktur på grund af en fast deadline.</p>`,

  'kvalitetssikring': h`<p><strong>Kvalitetssikring</strong> (QA) er det sidste tjek før lancering og dækker to ting: teknisk test af siden på tværs af browsere og enheder, og korrekt opsætning af analytics som GA4, Hotjar, Cookiebot og Klaviyo, så man ikke mister data fra de første besøgende.</p>`,

  'b2c-b2b-c2c-c2b': h`<p>De fire modeller beskriver, hvem der sælger til hvem: B2C er virksomhed til forbruger, B2B er virksomhed til virksomhed med ofte login-gated priser, C2C er forbrugere, der sælger til hinanden via en platform som DBA, og C2B er en privatperson, der sælger til en virksomhed, fx en freelancer. Modellerne afgør konkret, hvilke funktioner en webshop reelt har brug for.</p>`,

  'multi-channel': h`<p><strong>Multi-channel</strong> betyder, at man sælger gennem flere kanaler, men hver kanal kører på sit eget isolerede system uden fælles backend. Det giver risiko for at oversælge varer og et fragmenteret kundebillede, fordi lager og kundedata ikke deles mellem kanalerne.</p>`,

  'cross-channel': h`<p><strong>Cross-channel</strong> ligger mellem multi-channel og omnichannel: nogle specifikke punkter er koblet sammen, fx lagertjek på tværs eller klik-og-hent, men der er ingen fuldt samlet backend, og fx kundeservice og e-mail kører stadig separat. Det er et realistisk mellemtrin for virksomheder uden ressourcer til fuld omnichannel.</p>`,

  'omnichannel': h`<p><strong>Omnichannel</strong> betyder ægte backend-integration, hvor alle kanaler deler samme data — ét lager, ét kundebillede og ét CRM — uanset om kunden handler online, i app eller i fysisk butik. Det gør funktioner som "køb online, returnér i butik" mulige og fjerner risikoen for at oversælge, fordi der kun findes ét lagertal.</p>`,

  'konvertering': h`<p><strong>Konvertering</strong> er, når en besøgende udfører den ønskede handling, typisk et køb, og er det endelige mål for al trafik fra annoncer, SEO og sociale medier. Konverteringsraten — gennemførte handlinger delt med besøg — er den centrale måling, for trafik uden konvertering er reelt spildte marketingkroner.</p>`,

  'varenummer-rabatkode-tags': h`<p>Varenummer (SKU) er en unik kode pr. produkt eller variant brugt til lager og rapportering, rabatkode er en kode kunden indtaster ved kassen for at få rabat, og tags er fritekst-mærkater, der bruges til automatiske kollektioner, filtrering og segmentering. Sammen gør de det muligt at styre et stort produktkatalog uden manuelt arbejde.</p>`,

  'upselling-cross-selling': h`<p><strong>Upselling</strong> er at få kunden til at vælge en dyrere eller bedre version af det, de allerede er på vej til at købe, mens cross-selling er at tilbyde et supplerende produkt, der naturligt hører til, fx et cover til en telefon. Begge dele udnytter trafik, man allerede har, og er blandt de billigste måder at øge omsætningen på.</p>`,

  'nyhedstrekanten': h`<p><strong>Nyhedstrekanten</strong> ("hey, you, see, so") prioriterer det vigtigste budskab først, fordi en læser skanner og kan forlade siden når som helst: hey fanger opmærksomhed, you taler til læserens behov, see leverer beviset, og so afslutter med en klar CTA. Man kan derfor ikke gemme det vigtigste nederst, som i en lang, lineær tekst.</p>`,

  'konverteringsoptimering': h`<p><strong>CRO</strong> (konverteringsoptimering) er den løbende, cykliske proces at øge andelen af besøgende, der konverterer: observere et problem via fx Hotjar eller GA4, formulere en hypotese, teste den, typisk med et A/B-splittest, og implementere vinderen. Det bør ske løbende frem for kun før lancering, fordi en højere konverteringsrate gælder al fremtidig trafik og derfor ofte er billigere end at købe mere trafik.</p>`,

  'haard-vs-blod-konvertering': h`<p><strong>Hård konvertering</strong> er de direkte, forretningskritiske handlinger som et gennemført køb eller en udfyldt kontaktformular — her opstår den reelle værdi. Blød konvertering er mindre forpligtende skridt som en nyhedsbrevstilmelding eller et like, der koster kunden mindre, men kan plejes mod et køb senere, fx gennem Klaviyo-flows.</p>`,

  '10-tips-til-konverteringsoptimering': h`<p>Konkrete CRO-greb spænder fra landingssider — en dedikeret, responsiv side der matcher annoncen med synlige USP'er — over navigation, hvor max fire klik til produktet og en tydelig "læg i kurv"-knap tæller, til selve flowet: en optimeret kurv med synlig fragtpris, få trin i kassen og altid mulighed for gæstekøb, da tvunget kontooprettelse er en hyppig årsag til forladte kurve.</p>`,

  'a-b-splittest': h`<p>Et <strong>A/B-splittest</strong> viser version A og B samtidig til forskellige, tilfældige besøgende, så man kan isolere effekten af præcis én ændring og måle en konkret metrik, før man vælger vinderen. Næsten alt kan testes — knapfarver, CTA-tekst, overskrifter — og i Klaviyo kan man fx splitteste to emnelinjer i en mail.</p>`,

  'cookiebanner-der-konverterer': h`<p>Et godt cookiebanner skal være synligt og have en positiv, kontrolgivende overskrift frem for juridisk sprog, og "Accepter alle" gives ofte visuel prioritet for at reducere friktion. Samtidig skal et reelt, lige så tilgængeligt fravalg findes, ellers bliver det et ulovligt dark pattern — netop spændingsfeltet mellem konvertering og compliance.</p>`,

  '3-partsintegrationer': h`<p><strong>3. partsintegrationer</strong> er eksterne systemer, der kobles på Shopify via apps eller API'er og hver løser én specialiseret opgave — fragt, lager, regnskab, analytics, samtykke og e-mailmarkedsføring. Shopify er i sig selv kun en handelsmotor, så "best of breed"-integrationer giver sofistikering, men hver enkelt koster et abonnement og er et potentielt fejlpunkt.</p>`,

  'hotjar': h`<p><strong>Hotjar</strong> viser, hvordan besøgende rent faktisk bruger siden: heatmaps viser aggregeret klik- og scrolladfærd, recordings er optagelser af enkelte sessioner, og surveys er spørgeskemaer på siden. Det bruges typisk til at opdage, hvor folk falder fra eller rage-klikker på noget, der ikke er klikbart — observationer der bliver til hypoteser, man tester med et A/B-splittest.</p>`,

  'ga4': h`<p><strong>GA4</strong> registrerer begivenheder som sidevisninger, "læg i kurv" og køb på tværs af hele webshoppen og installeres fx via Google Tag Manager, verificeret med Google Tag Assistant før lancering som en del af QA. Det giver indblik i trafikkilder, hvor i tragten folk falder fra, og hvilken omsætning der kommer fra hvilke kanaler.</p>`,

  'klaviyo-flows': h`<p><strong>Klaviyo-flows</strong> er automatiserede mails udløst af kundens adfærd, fx Welcome, Abandoned Checkout eller Post Purchase, bygget op om en trigger, tidsforsinkelser og betinget logik. En kritisk detalje er altid at tilføje filtrene "is in list" og "person can receive email marketing" på hvert flow, så man ikke mailer folk uden samtykke.</p>`,

  'flows-vs-kampagnemails': h`<p>Kampagnemails er manuelt afsendte udsendelser til et bredt segment på et bestemt tidspunkt, fx Black Friday, mens flows er automatiserede og personlige mails, der kører kontinuerligt baseret på kundens egen adfærd. En sund e-mailkanal har ifølge Texta typisk en 50/50-fordeling af omsætning mellem de to.</p>`,

  'deliverability': h`<p><strong>Deliverability</strong> handler om, at mails rent faktisk lander i indbakken frem for i spam, hvilket afgøres af afsenderens omdømme hos mailudbyderne. Det styrkes gennem god listehygiejne via en sunset flow, tekst frem for tung grafik, et dedikeret afsenderdomæne, korrekt DMARC/SPF/DKIM og en spamrate under 0,10 procent.</p>`,

  'e-mail-kpi-er': h`<p>De centrale e-mail-KPI'er er open rate, click rate, konverteringsrate, AOV samt unsubscribe-, spam- og bounce rate som sundhedstjek, og list growth. Et fashion-eksempel giver et realistisk ankerpunkt — omkring 40-45 procent åbningsrate og 0,5-1,5 procent konverteringsrate — frem for at sammenligne med generiske branchegennemsnit.</p>`,

  'single-vs-double-opt-in': h`<p>Ved single opt-in er man tilmeldt, straks man sender formularen, mens double opt-in kræver, at man derudover klikker et bekræftelseslink. Double opt-in giver en renere liste, men koster tilmeldinger, og Texta anbefaler single opt-in i Danmark på grund af højere listevækst, mens fx Tyskland ofte bruger double opt-in af hensyn til GDPR.</p>`,

  'digital-retorik': h`<p><strong>Digital retorik</strong> er klassisk retorik overført til en digital virkelighed, hvor forløbet er multilineært — en besøgende kan lande hvor som helst og i vilkårlig rækkefølge — og modtageren er en aktiv medskaber frem for passiv. Det betyder, at produkttekster og mails skal fungere som selvstændige, overbevisende enheder uanset indgang, samtidig med at de hænger sammen i ét samlet brandbudskab.</p>`,

  'det-retoriske-septagram': h`<p><strong>Septagrammet</strong> analyserer en kommunikationssituation ud fra syv elementer samlet: afsender, modtager, omstændigheder, sprog, emne, genre og medie. Svag kommunikation skyldes ofte, at ét element ikke passer med de andre, fx for formelt sprog i en genre som Instagram, og værktøjet bruges til bevidst at tjekke, at alle syv elementer stemmer overens, før man skriver en tekst.</p>`,

  'etos-patos-logos': h`<p><strong>Etos, patos og logos</strong> er de tre klassiske appelformer: etos er afsenderens troværdighed, patos er den følelsesmæssige appel, og logos er appellen til fornuft og fakta — og de optræder typisk sammen på samme side. Hoff-Clausen udvider etos digitalt til tekstuel, intertekstuel, eksemplarisk og rituel etos, og man kan genkende alle tre appelformer samtidig på en Shopify-produktside: tillidsbadges, anmeldelser, en sammenligningstabel og et stemningsbillede.</p>`,

  'seo-grundopsaetning': h`<p><strong>SEO-grundopsætning</strong> dækker de basale elementer, der gør en side synlig for søgemaskiner: meta-titel/beskrivelse, sitemap, rene URL'er, alt-tekst på billeder og intern linkbygning. Det afgørende er, at arbejdet kun skal laves én gang og derefter virker gratis og vedvarende, modsat betalte annoncer.</p>`,

  'cookiebot': h`<p><strong>Cookiebot</strong> scanner en webshop for alle cookies, der reelt sættes — også fra tredjepartsapps — og kategoriserer dem, så besøgende kan til- eller fravælge pr. kategori i stedet for kun alt-eller-intet. Det genererer samtidig automatisk en altid opdateret cookiedeklaration, så man ikke selv skal holde manuelt øje med nye cookies.</p>`,

});
