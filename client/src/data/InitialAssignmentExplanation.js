

export const ASSIGNMENT_EXPLANATION = {
    BUILDSCREEN_1: {
        answer: `Welkom engineer! We willen je graag feliciteren met je nieuwe functie als project leider bij ons ruimtevaart bedrijf. Het is een tijdje geleden dat we elkaar hebben gesproken, dus we geven je nog een keer een kleine introductie over jou opdracht. Ons doel is om een mars rover te bouwen. Jij maakt deel uit van het engineering team dat zich bezig houd met de beweging van de rover. Het is jou en je team taak om de mars rover in elkaar te zetten en rijdende te krijgen. Er zijn al wat voorbereidingen getroffen zodat jij zo snel mogelijk aan het werk kan. Zo moeten in totaal 3 projecten voltooid worden: Testen van de motoren, installeren van de lichten en het testen van de rover. In deze opdracht beginnen we met het testen van de motoren. Daarover krijg je later in deze opdracht meer informatie. We gaan nu eerst onze test setup bouwen.`,
        thread_id: 6,
    },
    BUILDSCREEN_2: {
        answer: `Hierboven zie je de eerste instructie om de windmolen te bouwen, we beginnen met het aansluiten de batterij. Koppel de rode draad aan de + kant van het blauwe bord en de zwarte draad aan de - kant van het blauwe bord, zoals op de video wordt voorgedaan. Als het groene lampje brand, zit je goed. Klik vervolgens op de knop om verder te gaan.`,
        thread_id: 7,
    },
    BUILDSCREEN_3: {
        answer: 'We gaan nu de motor aansluiten. Op de motor vind je een cijfer. Verbind de draden van motor 1 met de M1 aansluiting op het blauwe board. Doe hetzelfde voor motor 2, 3 en 4. Vergeet niet dat de rode draad links moet en de zwarte draad rechts. De GND aansluiten gebruiken we niet.',
        thread_id: 8
    },
    CODINGSCREEN_1: {
        answer: 'Om de motoren aan en uit te kunnen zetten, moeten we een klein stukje code schrijven. Omdat coderen voor jou waarschijnlijk nieuw is, zullen we er op een gepast tempo doorheen gaan. Ik zal je goed begelijden en je helpen als je vastloopt. Je kan je vragen over programmeren, natuur- en wiskunde stellen in door op het chatgpt icoontje rechtsonderin te klikken. Klik op de knop om te beginnen met coderen.',
        thread_id: 9
    },
    CODINGSCREEN_2: {
        answer: 'Om de motoren aan en uit te kunnen zetten, moeten we een klein stukje code schrijven. Omdat coderen voor jou waarschijnlijk nieuw is, zullen we er op een gepast tempo doorheen gaan. Ik zal je goed begeleiden en je helpen als je vastloopt. Je kan je vragen over programmeren, natuur- en wiskunde stellen in door op het chatgpt icoontje rechtsonderin te klikken. Let wel op dat je mij maximaal 10 vragen per opdracht kan stellen. We gaan leren hoe we de bovenstaande aan/uit schakelaar zelf kunnen maken. Deze kennis gaan we toepassen om de motoren aan en uit te kunnen zetten. Klik op de knop om te beginnen met coderen.',
        thread_id: 10
    },
    CODINGSCREEN_3: {
        answer: `Hoe zorgen we ervoor dat de motoren aangaan wanneer wij dat willen? We kunnen dit doen door gebruik te maken van zogenaamde "if/ else statements". Je kan een if/ else statement ook wel vergelijken met waar of niet waar (In het Engels: true or false). Waneer een uitspraak waar is, gebruiken we hetgeen dat in de if statement beschreven staat, is de uitspraak niet waar? Dan voeren we de code uit die in de else statement staat. In ons geval willen we dat de motoren aangaan wanneer de knop ingedrukt wordt. We kunnen dit doen door te zeggen: als de knop ingedrukt is, zet dan de motor aan. Als de knop niet ingedrukt is, zet dan de motor uit.`,
        thread_id: 11
    },
    CODINGSCREEN_4: {
        answer: `We gaan nu jouw kennis testen. We willen dat de lamp aangaat als de schakelaar aan de rechterkant is. Versleep de juiste conditie in de if-statement en de daarbij passende actie die we moeten ondernemen. Let op er zijn meerdere antwoorden mogelijk, vind ze allemaal. Verder hoef je niet alle blokken te gebruiken.`,
        thread_id: 12
    },
    CODINGQUESTIONS_1: {
        answer: `Nu je jouw introductie hebt gehad met coderen, gaan we jouw kennis toepassen om de motoren werkende te krijgen. We hebben weer een schakelaar, als deze naar links staat, willen we dat de motoren uitstaan. Staat deze naar rechts, dan gaan de motoren aan. Dit kunnen we bereiken door weer gebruik te maken van een if else statement. Het is aan jou om de juiste conditie en actie te vinden. Succes!`,
        thread_id: 13
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
        
1. De snelheid is groter dan, of gelijk aan 0.3 en kleiner dan, of gelijk aan 0.4 (0.3 m/s $\leq$ v $\leq$ 0.4 m/s)
        
2. De snelheid is constant na 1 seconden (t $\geq$ 1s, v = constant)
        
3. De maximale verselling is niet lager dan 0.3 m/s$^2$ (v $\geq$ 0.3 m/s$^2$)
        
4. De afgelegde afstand na 5 seconde is hoger dan 2 meter (s > 5 meter)
        
5. De motor staat na dan 1 seconden still (t < 1 seconden)
        `,
        thread_id: 15,
    },
    ASSIGNMENTQUESTIONSINTRO_21: {
        answer: `Top! Nu we weten hoe we met programmeren het energieverbruik
        van de batterij kunnen visualiseren, is het tijd om te gaan rekenen. Zoals eerder
        gezegd gaan we ons in deze opdracht bezig houden met circuits. Het is jou taak
        om er voor te zorgen dat zolang mogelijk kan blijven branden op 1 accu. Om
        dit te bereiken gaan we berekeningen doen aan schakelingen, laten we beginnen.`,
        thread_id: 16,
    },
    ASSIGNMENTQUESTIONSINTRO_22: {
        answer: `We kunnen nu de weerstand in de schakeling plaatsen om de LED te laten branden.`,
        thread_id: 17,
    },
    ASSIGNMENTQUESTIONSINTRO_31: {
        answer: `In dit project ga jij de optimale snelheid bepalen van de auto. Om tot een conclusie te komen ga je 4 snelheden bekijken. Bij elke snelheid bereken je de efficiëntie van de auto. Je krijgt hier uiteindelijk 4 punten uit die je kan gaan plotten. Zo kan je een uitspraak doen over de optimale snelheid van de auto. Ik heb een stappenplan voor jou gemaakt die je kan uitwerken om tot het antwoord te komen, succes!`,
        thread_id: 18,
    },
    ASSIGNMENTQUESTIONSINTRO_32: {
        answer: `Fantastisch werk engineer! Je hebt alle opdrachten voltooid. We zijn overtuigd van jou capaciteiten om de race te winnen. Kies de beste bestuurder(s) uit in jouw groepje, bouw het parcours en start de race, succes!`,
        thread_id: 19,
    }
};