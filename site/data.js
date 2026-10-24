/* AJR — datos centralizados del catálogo.
   Oferta confirmada por la dueña en fase 3. No representa existencias.
   Editar aquí colegios, líneas, categorías, productos y teléfono.
   photo: ruta web de una fotografía identificada; vacío = fotografía pendiente.
   sizes y price: completar solo con información confirmada por AJR.
   Insignias recibidas: correspondencia visual revisada; autenticidad y permisos
   pendientes de validar antes de publicar. El usuario confirmó que el logo
   «Mis mágicas palabras II» corresponde al jardín del catálogo.
   Trazabilidad de fotografías y dudas: REVISION-MATERIAL-AJR.md.
*/
const AJR_DATA = {
  "demo": false,
  "phone": "56996722542",
  "lines": [
    {
      "id": "colegios",
      "name": "Vestuario escolar"
    },
    {
      "id": "empresas",
      "name": "Vestuario corporativo"
    },
    {
      "id": "deportes",
      "name": "Vestuario deportivo"
    }
  ],
  "categories": [
    "Buzos",
    "Poleras de gimnasia",
    "Poleras piqué",
    "Shorts deportivos",
    "Chaquetas polares",
    "Polerones de algodón",
    "Poleras de algodón",
    "Chaquetas corporativas",
    "Polares corporativos",
    "Poleras piqué corporativas",
    "Camisetas deportivas",
    "Cortavientos",
    "Chaquetas deportivas",
    "Polerones deportivos"
  ],
  "schools": [
    {
      "id": "harvest",
      "name": "Harvest Christian School",
      "cardName": "Colegio Harvest Christian School",
      "initials": "HCS",
      "image": "assets/insignias/harvest.webp"
    },
    {
      "id": "adventista",
      "name": "Colegio Adventista",
      "cardName": "Colegio Adventista",
      "initials": "CA",
      "image": "assets/insignias/adventista.webp"
    },
    {
      "id": "corazon-maria",
      "name": "Colegio Corazón de María",
      "cardName": "Colegio Corazón de María",
      "initials": "CM",
      "image": "assets/insignias/corazon-maria.webp"
    },
    {
      "id": "san-luis",
      "name": "Colegio San Luis",
      "cardName": "Colegio San Luis",
      "initials": "SL",
      "image": "assets/insignias/san-luis.webp"
    },
    {
      "id": "san-esteban",
      "name": "Colegio San Esteban",
      "cardName": "Colegio San Esteban",
      "initials": "SE",
      "image": "assets/insignias/san-esteban.webp"
    },
    {
      "id": "british",
      "name": "Antofagasta British School",
      "cardName": "Antofagasta British School",
      "initials": "ABS",
      "image": "assets/insignias/british.webp"
    },
    {
      "id": "magicas-palabras",
      "name": "Jardín Infantil Mis Mágicas Palabras",
      "cardName": "Jardín Infantil Mis Mágicas Palabras",
      "initials": "MMP",
      "image": "assets/insignias/magicas-palabras.webp"
    }
  ],
  "products": [
    {
      "id": 1,
      "line": "colegios",
      "school": "harvest",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "assets/productos/colegios/harvest-buzo.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 2,
      "line": "colegios",
      "school": "harvest",
      "name": "Polera de gimnasia",
      "category": "Poleras de gimnasia",
      "type": "tee",
      "photo": "assets/productos/colegios/harvest-polera-gimnasia.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 3,
      "line": "colegios",
      "school": "harvest",
      "name": "Polera piqué",
      "category": "Poleras piqué",
      "type": "polo",
      "photo": "assets/productos/colegios/harvest-polera-pique.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 4,
      "line": "colegios",
      "school": "harvest",
      "name": "Short deportivo",
      "category": "Shorts deportivos",
      "type": "shorts",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 5,
      "line": "colegios",
      "school": "harvest",
      "name": "Chaqueta polar",
      "category": "Chaquetas polares",
      "type": "jacket",
      "photo": "assets/productos/colegios/harvest-chaqueta-polar.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 6,
      "line": "colegios",
      "school": "adventista",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "assets/productos/colegios/adventista-buzo.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 7,
      "line": "colegios",
      "school": "adventista",
      "name": "Polera de gimnasia",
      "category": "Poleras de gimnasia",
      "type": "tee",
      "photo": "assets/productos/colegios/adventista-polera-gimnasia.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 8,
      "line": "colegios",
      "school": "adventista",
      "name": "Short",
      "category": "Shorts deportivos",
      "type": "shorts",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 9,
      "line": "colegios",
      "school": "adventista",
      "name": "Chaqueta polar",
      "category": "Chaquetas polares",
      "type": "jacket",
      "photo": "assets/productos/colegios/adventista-chaqueta-polar.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 10,
      "line": "colegios",
      "school": "corazon-maria",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "assets/productos/colegios/corazon-maria-buzo.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 11,
      "line": "colegios",
      "school": "corazon-maria",
      "name": "Polera de gimnasia",
      "category": "Poleras de gimnasia",
      "type": "tee",
      "photo": "assets/productos/colegios/corazon-maria-polera-gimnasia.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 12,
      "line": "colegios",
      "school": "corazon-maria",
      "name": "Polera piqué",
      "category": "Poleras piqué",
      "type": "polo",
      "photo": "assets/productos/colegios/corazon-maria-polera-pique.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 13,
      "line": "colegios",
      "school": "corazon-maria",
      "name": "Short deportivo",
      "category": "Shorts deportivos",
      "type": "shorts",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 14,
      "line": "colegios",
      "school": "corazon-maria",
      "name": "Chaqueta polar",
      "category": "Chaquetas polares",
      "type": "jacket",
      "photo": "assets/productos/colegios/corazon-maria-chaqueta-polar.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 15,
      "line": "colegios",
      "school": "san-luis",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "assets/productos/colegios/san-luis-buzo.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 16,
      "line": "colegios",
      "school": "san-luis",
      "name": "Polera de gimnasia",
      "category": "Poleras de gimnasia",
      "type": "tee",
      "photo": "assets/productos/colegios/san-luis-polera-gimnasia.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 17,
      "line": "colegios",
      "school": "san-luis",
      "name": "Polera piqué",
      "category": "Poleras piqué",
      "type": "polo",
      "photo": "assets/productos/colegios/san-luis-polera-pique.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 18,
      "line": "colegios",
      "school": "san-luis",
      "name": "Short deportivo",
      "category": "Shorts deportivos",
      "type": "shorts",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 19,
      "line": "colegios",
      "school": "san-luis",
      "name": "Chaqueta polar",
      "category": "Chaquetas polares",
      "type": "jacket",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 20,
      "line": "colegios",
      "school": "san-luis",
      "name": "Polerón de algodón",
      "category": "Polerones de algodón",
      "type": "hoodie",
      "photo": "assets/productos/colegios/san-luis-poleron-algodon.webp",
      "photoAlt": "Polerón negro con capucha y bolsillo delantero del Colegio San Luis, con escudo y bordado amarillo.",
      "whatsappMessage": "Hola, vi una referencia por confirmar de Polerón de algodón (Colegio San Luis) en el catálogo de AJR. ¿Ofrecen esta prenda? ¿Pueden confirmar modelos, tallas, precio y disponibilidad?",
      "sizes": [],
      "price": null
    },
    {
      "id": 21,
      "line": "colegios",
      "school": "san-esteban",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "assets/productos/colegios/san-esteban-buzo.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 22,
      "line": "colegios",
      "school": "san-esteban",
      "name": "Polera de gimnasia",
      "category": "Poleras de gimnasia",
      "type": "tee",
      "photo": "assets/productos/colegios/san-esteban-polera-gimnasia.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 23,
      "line": "colegios",
      "school": "san-esteban",
      "name": "Polera piqué",
      "category": "Poleras piqué",
      "type": "polo",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 24,
      "line": "colegios",
      "school": "san-esteban",
      "name": "Short deportivo",
      "category": "Shorts deportivos",
      "type": "shorts",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 25,
      "line": "colegios",
      "school": "british",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 26,
      "line": "colegios",
      "school": "british",
      "name": "Polera de gimnasia",
      "category": "Poleras de gimnasia",
      "type": "tee",
      "photo": "assets/productos/colegios/british-polera-gimnasia.webp",
      "photoAlt": "Polera de gimnasia blanca de The Antofagasta British School, con mangas negras, franjas rojas y escudo ABS.",
      "whatsappMessage": "Hola, vi una referencia por confirmar de Polera de gimnasia (Antofagasta British School) en el catálogo de AJR. ¿Ofrecen esta prenda? ¿Pueden confirmar modelos, tallas, precio y disponibilidad?",
      "sizes": [],
      "price": null
    },
    {
      "id": 27,
      "line": "colegios",
      "school": "british",
      "name": "Polera piqué",
      "category": "Poleras piqué",
      "type": "polo",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 28,
      "line": "colegios",
      "school": "magicas-palabras",
      "name": "Buzos",
      "category": "Buzos",
      "type": "tracksuit",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 29,
      "line": "colegios",
      "school": "magicas-palabras",
      "name": "Poleras de algodón",
      "category": "Poleras de algodón",
      "type": "tee",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 30,
      "line": "empresas",
      "school": null,
      "name": "Chaquetas corporativas",
      "category": "Chaquetas corporativas",
      "type": "jacket",
      "photo": "assets/productos/empresas/chaqueta-corporativa.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 31,
      "line": "empresas",
      "school": null,
      "name": "Polares corporativos",
      "category": "Polares corporativos",
      "type": "jacket",
      "photo": "assets/productos/empresas/polar-corporativo.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 32,
      "line": "empresas",
      "school": null,
      "name": "Poleras piqué corporativas",
      "category": "Poleras piqué corporativas",
      "type": "polo",
      "photo": "assets/productos/empresas/polera-pique-corporativa.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 33,
      "line": "deportes",
      "school": null,
      "name": "Camisetas deportivas",
      "category": "Camisetas deportivas",
      "type": "tee",
      "photo": "assets/productos/deportes/camiseta-deportiva.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 34,
      "line": "deportes",
      "school": null,
      "name": "Cortavientos",
      "category": "Cortavientos",
      "type": "jacket",
      "photo": "",
      "sizes": [],
      "price": null
    },
    {
      "id": 35,
      "line": "deportes",
      "school": null,
      "name": "Chaquetas deportivas",
      "category": "Chaquetas deportivas",
      "type": "jacket",
      "photo": "assets/productos/deportes/chaqueta-deportiva.webp",
      "sizes": [],
      "price": null
    },
    {
      "id": 36,
      "line": "deportes",
      "school": null,
      "name": "Polerones deportivos",
      "category": "Polerones deportivos",
      "type": "hoodie",
      "photo": "assets/productos/deportes/poleron-deportivo.webp",
      "sizes": [],
      "price": null
    }
  ]
};
