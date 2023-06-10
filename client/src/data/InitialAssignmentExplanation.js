
import {getSpecificAssignmentsDetail} from '../hooks/assignmentDetails';







export const ASSIGNMENT_EXPLANATION = {
    BUILDSCREEN_1: {
        answer: `Hey ik zie dat jij nieuw bent binnen ons bedrijf! Welkom! Ik ben een AI systeem van het team dat een ruimte rover gaat bouwen. Als het goed is ben jij samen met 2 andere aangewezen om deze taak te volbrengen. §We zullen de ruimte rover in 3 fases volbrengen: \n\nFase 1: Hierin testen we de snelheid en versnelling van de motoren. \n\nFase 2: Hierin testen we het elektriciteits netwerk van de rover. \n\nFase 3: Hierin testen we het energieverbruik en efficiëntië van de rover.`,
        thread_id: 6,
    },
    BUILDSCREEN_2: {
        answer: `Elke Fase bestaat uit 4 delen die jij en je team moeten volbrengen: \n\nBouwen: Je bouwt de test opstelling waarmee jij aan de slag gaat. \n\nCodeer kennis: Je leert hier hoe je code kan schrijven om je test opstelling te laten werken. \n\nCode schrijven: Hier schrijf je de code voor de test opstelling. \n\nOnderzoek: Gebruik jouw natuur- en wiskunde kennis om de rover te verbeteren.`,
        thread_id: 7,
    },
    BUILDSCREEN_3: {
        answer: `Laten we beginnen met het bouwen van de eerste testopstelling. Er zijn in totaal 4 houders die in elkaar gezet moeten worden. Het is aan jou en je team om de precieze opstelling te vinden, zoals in de bovenstaan figuur. Overleg je aanpak met elkaar, success!`,
        thread_id: 8,
    },
    BUILDSCREEN_4: {
        answer: ' We gaan nu de motor aansluiten. Op de motor vind je een cijfer. Verbind de draden van motor 1 met de M1 aansluiting op het blauwe board. Doe hetzelfde voor motor 2, 3 en 4. Vergeet niet dat de rode draad links moet en de zwarte draad rechts. De GND aansluiten gebruiken we niet.',
        thread_id: 9
    },
    CODINGSCREEN_1: {
        answer: 'Zoals je misschien gemerkt hebt, kunnen we de motoren nog niet aan zetten. Om dit te bereiken, moeten we een klein stukje code schrijven. Ik zie in onze systemen dat jij nog niet eerder gecodeerd hebt. Daarom zal ik jou en je team helpen met het schrijven van de code. §Je kan je vragen over programmeren, natuur- en wiskunde stellen door op het chatgpt icoontje rechtsonderin te klikken. Let wel op dat je mij maximaal 10 vragen per opdracht kan stellen.',
        thread_id: 10
    },
    CODINGSCREEN_2: {
        answer: "Hierboven zie je een Aan en Uit knop. De lamp gaat aan als je op 'Aan' klikt en gaat uit als je op 'Uit', logisch. Zo'n knop kunnen we ook gebruiken om de motoren aan en uit te zetten! §Hoe kunnen we hier code voor schrijven? We gaan hiervoor een zogenaamde 'if-else statement' voor gebruiken. Daar heb je waarschijnlijk nog nooit van gehoord. §Laten we op de volgende pagina kijken hoe een if-else statement werkt.",
        thread_id: 11
    },
    CODINGSCREEN_3: {
        answer: `In het bovenstaande blok is een if-else statement geschreven. Een if-else statement kan je vergelijken met een 'waar of niet waar' uitspraak. Als de uitspraak waar is, dan voeren we de actie uit die in de if-statement staat. §Is de uitspraak niet waar is? Dan voeren we de actie uit die in de else-statement staat. §Als we op de bovenstaande 'Aan'knop drukken, dan is de uitspraak tussen de haakjes van de if-statement waar, dus wordt dat stukje code uitgevoerd en gaat de lamp aan. Andersom, gaat de lamp uit.`,
        thread_id: 12
    },
    CODINGQUESTIONS_1: {
        answer: `Het is nu tijd voor het echte werk. Zorg dat de motoren aan gaan als de schakelaar aan de rechterkant is en uitgaan als de schakelaar aan de linker kant is. \n\nTip: Motor 1 doet het al.`,
        thread_id: 14
    },
    ASSIGNMENTQUESTIONSINTRO_11: {
        answer: `Goed gedaan! Jullie hebben de motoren aan de praat gekregen! Het is nu tijd voor ¿onderzoek¿. Het is aan jou en je team de taak om uit te zoeken wat de bewegingseigenschappen zijn van de motoren. §Verder is het belangrijk dat jullie kennis op gelijke hoogte is. Op het volgende scherm gaan jullie ¿brainstormen over snelheid, versnelling en de bijbehorende wiskunde¿. §¿Door tests goed uit te voeren, kan je geld verdienen om uit te geven in de rover shop.¿ Hier kan je de rover upgraden, in project 3 ga je namelijk racen tegen andere crews. `,
        thread_id: 14
    },
    ASSIGNMENTQUESTIONSINTRO_12: {
        answer: `We hebben helaas net te horen gekregen dat ¿1 van de motoren kapot is gegaan¿. Gelukkig heb jij samen met je team al metingen gedaan met goed werkende motoren. Hierdoor kon ik een paar ¿eisen vaststellen voor een goed werkende motor¿§ Op de volgende pagina kan je deze ¿eisen bekijken door op het plus icoontje te drukken.¿`,
        thread_id: 15,
    },
    ASSIGNMENTQUESTIONSINTRO_21: {
        answer: `Een ander team is de laatste paar weken bezig geweest metingen van de planeet waarop we ons bevinden. \n\nZij hebben gevonden dat deze planeet zonnestormen ervaart. Hierbij worden alle electronische aparaten uitgeschakeld en kunnen we de rover niet laten rijden. \n\nIk heb wat gechecks gedaan in ons magazijn. We hebben een apparaat aan boord wat ons kan beschermen tegen zonne stormen, genaamd de sd-23. We moeten alleen nog de juiste weerstand vinden waarbij we het apparaat kunnen laten werken met onze spanningsbron. \n\nDaarom is het aan jou en je team de taak om deze weerstand te vinden, success!`,
        thread_id: 16,
    },
    ASSIGNMENTQUESTIONSINTRO_22: {
        answer: `Nu je de weerstand hebt verkregen, is het tijd om het circuit te bouwen. Er is alleeen één probleem. We hebben niet de preciese weerstand gevonden die jij hebt berekend. De aanwezige weerstanden zijn: 10Ω, 100Ω, 330Ω, 1000Ω. \n\n Gelukkig kunnen we de correcte weerstand vinden door andere weerstanden in serie en/of parallel te zetten. Bedenk met je crew hoe je dit kan doen, maak schetsen en doe berekeningen. Je hebt maar 3 pogingen om de weerstand goed te krijgen. \n\nHet is aan jou en je team om de juiste weerstand te vinden, success!`,
        thread_id: 17,
    },
    ASSIGNMENTQUESTIONSINTRO_23: {
        answer: `Ik heb een simulatie gemaakt waarin je kan testen of jouw setup goed werkt tegen zonnestormen. In de simulatie wordt er een zonnestorm gesimuleert. Hoe dichter jij bij de ideale weerstand zat in vorige opdract, hoe meer tijd je hebt om te reageren op de zonnestorm. \n\nJe kan de simulatie starten in het volgende scherm.`,
        thread_id: 17,
    },
    ASSIGNMENTQUESTIONSINTRO_31: {
        answer: `Om de basis te halen met de brandstof die hebben voor de rover, moeten we zuinig rijden. Er is een optimale snelheid waarmee de rover het zuinigste rijd. We hebben deze snelheid nodig om een zo lang mogelijke afstand te kunnen afleggen op 1 accu. Probeer zo accuraat mogelijk te werken, je gebruikt je data straks in echt tegen andere crews!`,
        thread_id: 18,
    },
    ASSIGNMENTQUESTIONSINTRO_32: {
        answer: `Fantastisch werk engineer! Je hebt alle opdrachten voltooid. We zijn overtuigd van jou capaciteiten om de race te winnen. Kies de beste bestuurder(s) uit in jouw groepje, bouw het parcours en start de race, succes!`,
        thread_id: 19,
    }
};


// 1. De snelheid is groter dan, of gelijk aan acceleration[0] en kleiner dan, of gelijk aan 0.4 
                    
// 2. De gemiddelde snelheid is groter dan  
        
// 3. De afgelegde afstand na 15 seconden is groter dan 
        
// 4. De maximale snelheid is groter dan 0.3 m/s
        
// 5. De motor staat still na 1 seconde`,