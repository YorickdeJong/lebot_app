
import {getSpecificAssignmentsDetail} from '../hooks/assignmentDetails';







export const ASSIGNMENT_EXPLANATION = {
    BUILDSCREEN_1: {
        answer: `Hey! Je bent eindelijk wakker! Hoe gaat het? Je bent buiten bewust zijn geraakt nadat ons ruimteschip is gecrasht. Laat me je snel bijpraten over wat er is gebeurd en wat we van plan zijn. We zijn een week geleden door een onbekende reden neergestort op een vreemde planeet. Het lijkt op aarde, maar we kunnen de buitenlucht niet inademen. Gelukkig hebben we een basis gedetecteerd waar we mogelijk hulp kunnen vinden. Er is een plan bedacht om die basis te bereiken. We hebben wat onderdelen gevonden waarmee we hopelijk een rover kunnen bouwen. Daarmee zouden we de basis kunnen bereiken. Ons AI systeem heeft drie fases gedefinieerd om de rover te bouwen en operationeel te krijgen.`,
        thread_id: 6,
    },
    BUILDSCREEN_2: {
        answer: `Samen 2 andere bemanningsleden ga jij ervoor zorgen dat deze 3 fases goed verlopen. Allereerst moeten we de motoren van de rover aan de praat krijgen. Daarna moeten we de lichten van de rover laten werken, zodat we ook 's nachts kunnen rijden. We moeten zo snel mogelijk bij die basis zijn, en met jouw expertise kunnen we de verlichtingssystemen zeker aan de praat krijgen. Ten slotte moeten we de optimale snelheid van de rover bepalen. We moeten zo zuinig mogelijk rijden om de afstand naar de basis te halen met de brandstof die we hebben. Jij bent altijd goed geweest met berekeningen, dus we vertrouwen erop dat je ons hierbij kunt helpen.`,
        thread_id: 7,
    },
    BUILDSCREEN_3: {
        answer: `Hierboven zie je de eerste instructie om de windmolen te bouwen, we beginnen met het aansluiten de batterij. Koppel de rode draad aan de + kant van het blauwe bord en de zwarte draad aan de - kant van het blauwe bord, zoals op de video wordt voorgedaan. Als het groene lampje brand, zit je goed. Klik vervolgens op de knop om verder te gaan.`,
        thread_id: 8,
    },
    BUILDSCREEN_4: {
        answer: 'We gaan nu de motor aansluiten. Op de motor vind je een cijfer. Verbind de draden van motor 1 met de M1 aansluiting op het blauwe board. Doe hetzelfde voor motor 2, 3 en 4. Vergeet niet dat de rode draad links moet en de zwarte draad rechts. De GND aansluiten gebruiken we niet.',
        thread_id: 9
    },
    CODINGSCREEN_1: {
        answer: 'Om de motoren aan en uit te kunnen zetten, moeten we een klein stukje code schrijven. Omdat coderen voor jou waarschijnlijk nieuw is, zullen we er op een gepast tempo doorheen gaan. Ik zal je goed begelijden en je helpen als je vastloopt. Je kan je vragen over programmeren, natuur- en wiskunde stellen in door op het chatgpt icoontje rechtsonderin te klikken. Klik op de knop om te beginnen met coderen.',
        thread_id: 10
    },
    CODINGSCREEN_2: {
        answer: 'Om de motoren aan en uit te kunnen zetten, moeten we een klein stukje code schrijven. Omdat coderen voor jou waarschijnlijk nieuw is, zullen we er op een gepast tempo doorheen gaan. Ik zal je goed begeleiden en je helpen als je vastloopt. Je kan je vragen over programmeren, natuur- en wiskunde stellen in door op het chatgpt icoontje rechtsonderin te klikken. Let wel op dat je mij maximaal 10 vragen per opdracht kan stellen. We gaan leren hoe we de bovenstaande aan/uit schakelaar zelf kunnen maken. Deze kennis gaan we toepassen om de motoren aan en uit te kunnen zetten. Klik op de knop om te beginnen met coderen.',
        thread_id: 11
    },
    CODINGSCREEN_3: {
        answer: `Hoe zorgen we ervoor dat de motoren aangaan wanneer wij dat willen? We kunnen dit doen door gebruik te maken van zogenaamde "if/ else statements". Je kan een if/ else statement ook wel vergelijken met waar of niet waar (In het Engels: true or false). Waneer een uitspraak waar is, gebruiken we hetgeen dat in de if statement beschreven staat, is de uitspraak niet waar? Dan voeren we de code uit die in de else statement staat. In ons geval willen we dat de motoren aangaan wanneer de knop ingedrukt wordt. We kunnen dit doen door te zeggen: als de knop ingedrukt is, zet dan de motor aan. Als de knop niet ingedrukt is, zet dan de motor uit.`,
        thread_id: 12
    },
    CODINGSCREEN_4: {
        answer: `We gaan nu jouw kennis testen. We willen dat de lamp aangaat als de schakelaar aan de rechterkant is. Versleep de juiste conditie in de if-statement en de daarbij passende actie die we moeten ondernemen. Let op er zijn meerdere antwoorden mogelijk, vind ze allemaal. Verder hoef je niet alle blokken te gebruiken.`,
        thread_id: 13
    },
    CODINGQUESTIONS_1: {
        answer: `Nu je jouw introductie hebt gehad met coderen, gaan we jouw kennis toepassen om de motoren werkende te krijgen. We hebben weer een schakelaar, als deze naar links staat, willen we dat de motoren uitstaan. Staat deze naar rechts, dan gaan de motoren aan. Dit kunnen we bereiken door weer gebruik te maken van een if else statement. Het is aan jou om de juiste conditie en actie te vinden. Succes!`,
        thread_id: 14
    },
    ASSIGNMENTQUESTIONSINTRO_11: {
        answer: `Heel goed gedaan! Je hebt de motoren aan de praat gekregen! We
        gaan nu een paar tests doen met een goed werkende motor, om zo accurate data
        te verzamelen. Die data kunnen we gebruiken als test, om te kijken of andere
        motoren ook goed functioneren. Op het volgende scherm kun je data verzame-
        len door op ’Druk hier om data te verzamelen’ te klikken. Dit zal een meeting
        starten, de motoren laten draaien en s,t en v,t grafieken produceren. Je kan de
        data live zien, zodat je een beter begrip krijgt van s,t en v,t grafieken. Laten
        we gelijk beginnen!`,
        thread_id: 14
    },
    ASSIGNMENTQUESTIONSINTRO_12: {
        answer: `We hebben helaas net te horen gekregen dat onze leverancier 6 motoren heeft geleverd, waarvan er 2 kapot zijn. Echter weten we niet welke dat zijn. Gelukkig heb jij net een aantal tests gedaan aan een goed werkende motor. Hierdoor waren we instaat om een aantal criteria op te stellen waaraan de motor moet voldoen: 
        
1. De snelheid is groter dan, of gelijk aan 0.3 en kleiner dan, of gelijk aan 0.4 
        
2. De snelheid is constant na 1 seconden 
        
3. De maximale verselling is niet lager dan 0.3 m/s$^2$ 
        
4. De afgelegde afstand na 5 seconde is hoger dan 2 meter 
        
5. De motor staat na dan 1 seconden still 
        `,
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