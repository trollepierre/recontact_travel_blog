const { expect } = require('../../test-helper');
const serializer = require('../../../src/serializers/chapters');
const articleFr = require('../fixtures/articleFr');

describe('Unit | Serializer | chapters', () => {
  it('should return an array of Article objects serialized from metadatas', () => {
    // when
    const chapters = serializer.serialize(articleFr);

    // then
    const expectedChapters =
      {
        title: '59. Perdus autour du mont Gongga',
        chapters: [
          {
            imgLink: 'img1.jpg',
            title: 'Le trek incroyable autour du mont Gongga Par Pierre avec Vincent et Franzi',
            text: ['Rassemblant trois valeureux compagnons :', "- Pierre, l'expérimenté", '- Franzi, la photographe', '- Vincent, le guide à la carte', '', "Ce trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement..."],
          },
          {
            imgLink: 'img2.jpg',
            title: 'Le programme',
            text: ['La région de Kangding', "Située sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\".", '', "Le mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !", 'Le trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.'],
          },
          {
            imgLink: 'img3.jpg',
            title: 'Un départ compliqué',
            text: ['J1 - 10h', "En Chine, toute situation dépassant l'ordinaire, devient rapidement problématique. Mais on s'en sort bien : Vincent a bien préparé le début du programme et un taxi nous dépose devant le mont. À nous l'aventure !", '', "Mais, mais, qu'est ce qui se passe, Vincent ?", "Un étourdissement, mal de crâne ? C'est sûrement l'acclimatation : passer de zéro à 3300 mètres en deux jours, c'est difficile.", "Après quelques barres énergétiques, un paracetamol et une bonne pause, on peut commencer ! C'est pas trop tôt : le décor qui nous accueille promet déjà beaucoup ! J'ai des fourmis dans les jambes !", "Nous commençons donc à marcher, mais on se rend vite compte que le taxi nous a déposés après le village de Laoyulin. Nous n'avons pas pu demander aux locaux de nous avancer plus avec les quatre roues motrices et donc on a vingt kilomètres supplémentaires pour arriver au \"vrai\" départ à 3500m.", '', "Ne voyant pas d'autres solutions, il nous faut monter par nous-mêmes. Cinq heures en plus du long programme qui nous attend... La galère !", '', "Une heure plus tard, une pause nous est nécessaire. C'est alors qu'arrive un gros quatre-quatre qu'on parvient à stopper, à demander trois petites places et de nous avancer des seize kilomètres restants : une bonne chose de faite."],
          },
          {
            imgLink: 'img4.jpg',
            title: 'Les Chinois viennent nous narguer',
            text: ['J1 - 13h30', 'Certes nous avions choisi de conserver notre indépendance et de vivre un trek bien à nous, pour nous surpasser. Mais depuis le début du trek, nous avons vu ce groupe de touristes chinois, parti le même jour, à rythme un peu plus lent. De plus, ils peuvent compter sur le dos de mules pour transporter leurs charges et victuailles, et sur les guides pour leur préparer de bons repas. Frustrant !'],
          },
          {
            imgLink: 'img5.jpg',
            title: 'Pluie',
            text: ['J1 - 15h30', "La pluie s'invite à notre trek. Soudaine, elle viendra pendant tout le trek miner notre moral, tremper nos affaires mais pas entartrer notre détermination !"],
          },
          {
            imgLink: 'img6.jpg',
            title: 'Le trek devient mémorable',
            text: ['J1 - 16h', 'On commence à apercevoir de grandes prairies et dedans... de grosses bêtes noires bien touffus : les yaks ! On peut prudemment même les approcher.'],
          },
          {
            imgLink: 'img7.jpg',
            title: 'Éboulis ou pas ?',
            text: ['J1 - 17h45', "Quatre heures plus tard, il est temps de trouver un emplacement au camp Dacaoba pour planter les tentes. Le vent s'étant pointé, je choisis un versant de montagne rocailleux pour s'abriter du froid. Franzi est sceptique, craint une avalanche. Mais l'enthousiasme des deux mecs auront raison d'elle."],
          },
          {
            imgLink: 'img8.jpg',
            title: 'Réchauffons-nous !',
            text: ['J1 - 18h', "Le froid pointe son nez. Il est vrai qu'à 4000m, on fait face à des températures moins caniculaires qu'à Chengdu en été.", '', "Pour nous réchauffer, nous commençons l'élaboration d'un feu. C'est sans compter l'humidité du bois, un PQ Chinois de m.... et un vent du diable. Une heure plus tard, on renonce.", '', "Également la face de Vincent n'a pas apprécié le soleil et le voilà avec un \"pelage\" de peau pas très esthétique malgré le temps nuageux (la crème solaire en montagne c'est indispensable !). Franzi est plus subtile : un petit nez rouge, ça veut tout dire !", '', "Quelques étirements, du paracetamol pour calmer les maux de crâne, un bon repas pour reprendre des forces. Le froid glacial s'invite dans nos tentes alors nous nous mettons à trois pour réchauffer une tente, regarder un bon film sur des alpinistes en danger et nous détendre. Le cap de la première journée est passé !"],
          },
          {
            imgLink: 'img9.jpg',
            title: 'Un lendemain compliqué',
            text: ['J2 - 8h', "Les premiers rayons du soleil pointent leur nez sur la tente. On ouvre la tente dans laquelle on s'est tous endormi et... mince ! Des ondées de nuages gris s'accaparent le haut du ciel dans la direction de notre chemin. Ce matin-là, on aura notre douche, coûte que coûte.", "Ce n'est pas la mer à boire, nous nous réchauffons devant un bon chocolat chaud, plions valises et tentes et nous mettons en route.", '', "Petit problème : c'est au tour de Franzi de manquer d'énergie. Grosse fatigue et l'altitude qui fait son effet, aie aie ! Va-t-on passer le col ?", 'Du fait de nos provisions, deux tentes, gros sacs de couchage, et autres équipements, nous avions une quarantaine de kilos à nous repartir.\r\nLa fatigue étant le danger numéro un, nous allégeons Franzi de ses douze kilos sur le dos et on repart à rythme moins soutenu.', 'Bilan de la situation : Il nous a fallu pas mal de motivation pour outrepasser tous ces soucis : froid, fatigue, altitude, humidité constante, vent et pluie, lourde charge,... et à chaque hésitation, plane le doute du demi-tour.', '', "Mon excès de confiance et de zèle était la seule assurance. On prit la décision de monter voir le col et on reporte la possibilité au demi-tour au lendemain, suivant l'état de chacun."],
          },
          {
            imgLink: 'img10.jpg',
            title: "L'éleveur de yak",
            text: ['J2 - 12h30', "Nous suivons la rivière Riwuqie depuis quelques kilomètres et sommes au milieu du passage Gyazila. Lorsque nous apercevons une tente. Et surtout l'heure de faire une pause. Nous arrivons chez un éleveur de yaks qui nous invite à boire de l'eau (chaude évidemment) et qui nous raconte sa vie dans les pâturages.", "Barrière de la langue oblige, même Vincent qui vit en Chine depuis huit mois, ne parvient pas à décrypter ses dires. On comprend qu'il possède 100 yaks et sa femme nous montre ses litres de lait de yaks, qu'elle utilise comme beurre, fromage, crème.", "En bonus de nous indiquer le chemin, ils nous offrent des médicaments contre l'altitude, l'idéal pour mes compagnons !"],
          },
          {
            imgLink: 'img11.jpg',
            title: 'En vue du glacier',
            text: ['J2 - 15h30', "Nous arrivons enfin au camp Riwuqie à 4200m. Le deuxième jour se termine avec l'intensification de la pluie. Nous nous réchauffons dans la tente d'un deuxième éleveur de yaks et surtout en vue d'un glacier, derrière lequel on peut voir le col !"],
          },
          {
            imgLink: 'img12.jpg',
            title: 'La pâture de yak au Xia Riwuqie',
            text: ['J2 - 17h', 'Nous nous installons dans les tentes, lorsque... SIFFLEMENTS AIGUS !', "L'éleveur appelle ses yaks, en train de brouter l'herbe 500m plus haut et... On assiste à une descente au galop de 80 yaks, bien plus vigoureux que ses cousins \"vaches\", qui mettront 5-10 minutes à revenir. Si le sol n'a pas tremblé, il n'en était pas loin !", "Et entouré de ses yaks, l'éleveur leur jette des granulés ou minéraux. Alors que je m'approche pour les examiner, il me crie de partir : les yaks sont dangereux et risquent de me foncer dessus, cornes en avant."],
          },
          {
            imgLink: 'img13.jpg',
            title: 'Le voyeur !',
            text: ['J3 - 7h', 'Durant la nuit, je ne trouve pas le sommeil et contemple le ciel : ô cette nuit si étoilée, quel spectacle ! Voici les petits moments de magie du voyage, me dis-je.', 'Je me rendors. Au petit matin, Franzi ouvre la tente et... à 5 mètres de la tente...'],
          },
          {
            imgLink: 'img14.jpg',
            title: "C'est reparti !",
            text: ['J3 - 8h10', "Le moral des troupes est au beau fixe, depuis qu'on a pu charger un sac sur une mule. La montée du col en sera moins compliquée. Mes compagnons s'arrêtent faire une pause photo devant ce magnifique glacier. Et moi, pendant ce temps, je grelotte en les attendant au pied du col."],
          },
          {
            imgLink: 'img15.jpg',
            title: 'Neige...',
            text: ["Évidemment il ne manquait plus qu'elle ! La neige est tombée cette nuit et surplombe les pourtours du col. Des conditions de marche plus compliquées mais un décor appréciable !", 'Nous sommes alors au Shang Riwuqie, devant un lac complètement glacé, qui alimente la rivière du même nom : on revient avec des photos magnifiques.'],
          },
          {
            imgLink: 'img16.jpg',
            title: 'Le col Riwuqie à 4800m enneigé',
            text: ['J3 - 10h30', "Les 50 derniers mètres sont très raides. Alors que Vincent et Franzi restent contemplatifs devant le sommet et je commence à grimper à grands pas avec mon gros sac. Zigzagant entre des chinois très hésitants, j'atteins le sommet. Et au moment d'apprécier ma victoire, on me rappelle : la mule étant déséquilibrée par notre sac, il faut qu'on le porte nous-mêmes au col. J'ai donc eu le droit à ma deuxième grimpette au sommet. Il y faisait froid, mais on profite des photos pour se réchauffer !"],
          },
          {
            imgLink: 'img17.jpg',
            title: "La grande prairie d'hiver",
            text: ['J3 - 11h', "Pour redescendre, nous redispatchons les sacs et avec 25 kilos sur les épaules, j'ai dévalé la pente en sprint devant le groupe de chinois amusés et très prudents.", '', "On arrive dès lors devant une grande vallée couverte de pâtures. C'est ici que viennent les yaks en hiver. Et en haut de tout cela, un yak solitaire nous regardant de haut, passer en file indienne (avec les chinois !!!)."],
          },
          {
            imgLink: 'img18.jpg',
            title: 'Temps variable',
            text: ['J3 - 14h45', "Le baromètre en deviendrait fou. En moins de deux heures, le temps s'est bien détérioré. La pluie revient nous ennuyer et les ruisseaux des glaciers sont devenus d'énormes coulées de boue, estompant les traces de notre chemin. Il nous faut sauter, se frayer un chemin de substitution et parfois ne pas hésiter à marcher dans la boue !"],
          },
          {
            imgLink: 'img19.jpg',
            title: 'La traversée de la rivière Moxi Gou en crue',
            text: ['J3 - 16h30', 'Devant cette rivière en crue, le groupe de chinois hésite à traverser pour rejoindre leurs mules devant passées, avant la crue.', '', "Le passage est constitué d'un tronc bien humide donc glissant puis de quelques pierres sous les eaux.", "C'est tout un spectacle de les regarder à l'oeuvre. L'un d'eux reste bloqué au milieu et démotive tout le monde de passer le tronc glissant. Devant leur inefficacité, je prends l'initiative de sauter sur le tronc puis sur quelques pierres sous marines vite-fait, bien-fait !", "La situation se débloque enfin et alors que je construis un passage de pierres plus grosses, l'une des randonneuses chinoises trouve le \"vrai\" passage, 10 mètres plus haut.", 'Les Chinois partent alors que nous plantons la tente, patientons la nuit au camp Moxi Gou, pour traverser avec nos sacs bien plus lourds le lendemain.'],
          },
          {
            imgLink: 'img20.jpg',
            title: "Traversée des cours d'eau",
            text: ['J4 - 13h', 'Le chemin continue à traverser les eaux de glacier, et alors que certains remontent leur pantalon, un audacieux tente la traversée pieds nus.', '', "Flop, mince, ma chaussure m'a échappé ! Je la rattrape, finis de traverser et m'aperçois que la chaussette à l'intérieur s'est fait la malle, emportée par le courant. Belle fin pour une chaussette..."],
          },
          {
            imgLink: 'img21.jpg',
            title: 'Le temps se met au beau fixe',
            text: ['J4 - 13h30', "Et alors qu'on suit la piste du groupe de chinois, le temps s'améliore. Cela en jette plein la vue ! J'en profite pour me dorer la pilule, et surtout me reposer de la charge sur le dos.", 'A la recherche du pont perdu...', "\"Environ trois heures de marche d'après la carte !\", nous indiquait fièrement Vincent ce matin. Quatre heures plus tard, nous sommes entre 300 et 500 mètres au-dessus d'une pente très abrupte, qui domine la grosse rivière en crue, dont nous cherchons le pont.", "L'inquiétude se fait sentir sur chacun d'entre nous. Les traces de mules continuent toujours dans la même direction alors nous avançons."],
          },
          {
            imgLink: 'img22.jpg',
            title: "La fatigue s'y mêle",
            text: ['J4 - 16h30', "La fatigue, l'exaspération nous attaquent de plein fouet, il faut s'arrêter. Nous trouvons un lieu de camp au soleil - idéal pour se réchauffer - et nous remplissons nos panses."],
          },
          {
            imgLink: 'img23.jpg',
            title: 'Le repas habituel',
            text: ["Elles ne font pas l'unanimité. Mais les soupes chinoises restent le meilleur moyen de se restaurer dans les treks. Léger, assez nourrissant et rapide à cuire. Souvenir, souvenir !", '', "Vincent se rappelle aussi des flocons d'avoine infâmes et du réconfort du saucisson et des chocolats."],
          },
          {
            imgLink: 'img24.jpg',
            title: 'Un pont à tribord !',
            text: ['J4 - 18h', "Sept heures de marche y sont passées et enfin : j'aperçois un pont entre les arbres ! Impatient je cherche le chemin qui y mène. Nous nous retrouvons devant une intersection à trois voies. Notre exténuation est de plus en plus forte, elle nous fera choisir le mauvais chemin, celui s'affaissant directement vers la rivière et donc le pont !"],
          },
          {
            imgLink: 'img25.jpg',
            title: 'Le feu de la dernière chance',
            text: ['J4 - 18h30', "Il est tard, une grosse montée nous attend alors on plante la tente au bord de la rivière. L'endroit regorge de bois mort et malgré l'humidité de l'air et la bruine incessante, nous nous résolvons à faire un feu de camp.", '', "Tout mon apprentissage y passe : du papier au petit bois sec, au bois moyen pour créer la structure d'un feu de camp ; le gros bois étant prêt pour tenir sur la durée. Nous allumons le papier... et rien ne prend. Un abri contre le vent est construit et malgré cela, toujours rien ne prend. Les brindilles s'échauffent, font de petites flammèches et puis rien. Ils nous restent le froid et l'humidité pour nous consoler...", '', 'et les jeux de cartes : entre le UNO et le Shit Head, on a bien rigolé.'],
          },
          {
            imgLink: 'img26.jpg',
            title: 'La montée vers le col',
            text: ['J5 - 9h45', "Le lendemain, malgré notre fatigue, il faut y aller, l'objectif n'est pas loin ! \"Une heure de montée, puis c'est de la descente : facile !\", nous rabâche Vincent. Convaincus par ses propos, nous nous mettons en marche lorsque la pluie s'arrête...", "...pour mieux revenir, cette fois sous forme de très fines gouttelettes. Nous grimpons, franchissons ponts et rivières, apercevons un sanglier... On dit que des ours rodent de ce côté de la rivière : hâtons-nous ! Mais Franzi est incapable de suivre notre rythme. C'est au cours d'une énième pause que j'aperçois un refuge.", 'Le Mont Gongga et ses implications', 'J5 - 12h', "\"Je sais pas du tout où on est !\" s'exclame Vincent, \"cette carte chinoise est tellement mauvaise !\" Nous la consultons et arrivons aux mêmes conclusions. Pas rassurant !", '', 'Vincent part inspecter les environs, alors que je prépare la popote. Ventres pleins, nous voyons la brume se dissiper et à travers les nuages, apparaît le Minya Konka, le mont Gongga. Du haut de ses 7556m, on le reconnaît directement à sa taille comparée à ses voisins, ses neiges éternelles et glaciers.', "\"On est en face du Gongga, on aurait dû y être il y a longtemps ! On avance vers le col de Yulongxi, ce n'est pas la bonne direction ! Du coup, il faut revenir sur le sentier et avancer pendant environ deux heures de plus avant de trouver le \"vrai\" pont.", "Je grimpe en haut voir le col de plus près et approuve la nouvelle localisation de Vincent. Personne n'est certain, mais les indices sont là et sur la carte. Motivons-nous et essayons !", "On redescend donc notre matinée en une heure à bon rythme. Je suis même distancé avec mon lourd sac car j'essaye d'épargner mes chevilles. On revient au croisement où nous avions pris la mauvaise direction. Vincent :", "\"Les bois sur le sol ont l'air d'avoir été utilisés pour une ancienne barrière - que quelqu'un a laissé ouvert ! Et ici, un signe qui nous montre l'autre direction ! Mince ! On l'avait pas vu !\"", "Facile à remarquer maintenant ! Je remets la barrière sur pied, pour bloquer la route aux prochains randonneurs égarés et on se sépare pour examiner les deux autres voies qui remontent sur la vallée. L'une est immaculée de boues par les sabots des mules, l'autre est utilisée par les randonneurs et les deux se rejoignent : on a retrouvé la route !"],
          },
          {
            imgLink: 'img27.jpg',
            title: "Les drapeaux de l'espoir !",
            text: ['J5 - 14h', "Et c'est reparti pour des kilomètres sans fin ! L'inquiétude grandit mais les pas des baudets nous rassurent même à un jour d'intervalle.", 'Soudain...', "Une vallée se dégage... et même plusieurs. Trois heures sont déjà passées. Le pont est sûrement là ! Mais rien n'y fait ! On continue à avancer à flancs de montagnes et soudain...", '', "On arrive sur le haut arrondi de la chaîne de montagnes. On peut voir de l'autre côté des montagnes de forêts et des nuages peu rassurants. On passe de l'autre côté de la chaîne de montagnes et commence à redescendre...", '', "On se retrouve devant les panneaux indiquant un monastère. On est pas loin de notre destination finale ! On vérifie à trois fois les signalisations (en Chinois évidemment) et prend la direction de notre village. La pluie revient mais n'entartrera plus notre motivation !"],
          },
          {
            imgLink: 'img28.jpg',
            title: 'Au chaud !!!!',
            text: ['J5 - 18h30', 'On arrive au village et trouve une guesthouse :', "- ce soir, c'est au chaud qu'on dormira et sûrement un bon repas"],
          },
          {
            imgLink: 'img29.jpg',
            title: 'La guesthouse et la galère de Yulongxi',
            text: ["Notre hôte tibétaine est vraiment robuste et à nos soins. Elle appelle un chauffeur pour nous mener à Yulongxi, ce \"lieu touristique\", où l'on souhaite prendre un bus retour à Kangding. La route allie les multiples paysages montagneux renversant. Nous en prennons plein les yeux !", "Arrivés sur la route vers le bled paisible, on ne rencontre aucune circulation sur cinquante kilomètres. Vive les incompréhensions entre un tibétain parlant mandarin et les pauvres bibres de vocabulaire de Vincent. On décide de changer de cap pour Shade, d'où on récupère un bus pour Kangding."],
          },
          {
            imgLink: 'img30.jpg',
            title: 'Quelques mots de Franzi',
            text: ["Je ne suis pas du tout une personne sportive, c'est pourquoi j'avais peur au début du trek que les garçons m'en demandent trop. Étonnement la première journée était super : la vue était magnifique et j'étais très motivée. Mais les jours suivants, la pluie et le froid toute la journée, ça m'a un peu démotivée et fatiguée. Nous n'étions peut-être pas assez préparés. Je me suis plusieurs fois demandée : \"qu'est-ce que je fais là ? Pourquoi ne pas rentrer au chaud à la maison ?\". Mais après avoir survécu à ce trek, je suis vraiment fière de moi ! Malgré la difficulté, ensemble, nous y sommes arrivés. Merci beaucoup Vincent et Pierre, de m'avoir motivée chaque jour et permise de vivre ce trek inoubliable. Je n'y serais pas arrivée sans vous et j'aurais pu le regretter. Surtout lorsque je regarde mes jolies photos, je pense à vous et ne peux m'empêcher de sourire ! :)"],
          },
          {
            imgLink: 'img31.jpg',
            title: 'Quelques mots de Vincent',
            text: ["Un grand merci à toi Pierre. Sans ta motivation, ta persévérance, ton sacrifice physique pour porter notre fardeau aux moments difficiles, il est fort probable que nous ne puissions jamais franchir ce maudit col. C'est sans doute la randonnée la plus exigeante de ma vie mais au combien stimulante et mémorable ! C'est en mettant le corps et l'esprit à l'épreuve que l'on prend conscience des forces cachées en nous. Une belle aventure entre amis, des paysages à couper le souffle, un silence rare et appréciable en Chine, un sentiment d'humilité face à la puissance et la beauté des chaines de montagnes de l'Himalaya, la générosité et hospitalité du peuple tibétain, et un mal de tête persistant qui est quand même sacrement perturbant, voici ce que je retiendrai de ce trek de folie en compagnie d'un baroudeur de première classe et d'une \"touriste\" allemande courageuse jusqu'au bout."],
          },
          {
            imgLink: 'img32.jpg',
            title: 'Ce trek en résumé d\'après moi',
            text: ["Ainsi passais-je l'une de mes semaines en Chine. Libéré de ce statut de touriste, livré à moi-même et avec deux amis, on a surpassé la difficulté lors de ce trek sans guide et sommes même monter à 4800m : pari réussi.\r\nCe n'a pas été facile tous les jours, chacun d'entre nous a souffert par moments mais c'est ainsi que les meilleures aventures restent gravées dans les mémoires.", 'Voici une carte :', 'http://cdn.displays2go.com/images/minya-konka-map.gif', "et voici les instructions pour les aventuriers d'entre vous qui souhaitent nous suivre !", 'http://zhilamhostel.com/trekking-gongga-on-your-own/'],
          },
        ],
      };
    expect(chapters).to.deep.equal(expectedChapters);
  });
});

