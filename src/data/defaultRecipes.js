/**
 * @fileoverview Recetas predeterminadas para la aplicación Recetario Mágico
 * Contiene un conjunto curado de recetas tradicionales para inicializar la aplicación
 * Optimizado para rendimiento y mantenibilidad
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

/**
 * Configuración optimizada para recetas por defecto
 * Centralizadas para fácil mantenimiento y modificación
 */
const RECIPE_CONFIG = Object.freeze({
  // Timestamp base para evitar recálculos repetidos de Date
  BASE_TIMESTAMP: new Date("2024-01-01T00:00:00.000Z").toISOString(),

  // URLs de imágenes optimizadas y verificadas
  IMAGES: Object.freeze({
    PLACEHOLDER: "https://placehold.co/600x300/E2E8F0/A0AEC0?text=Receta",
    CDN_BASE: "https://images.unsplash.com/",
  }),

  // Configuración de categorías mapeadas para mejor rendimiento
  CATEGORY_MAP: Object.freeze({
    BREAKFAST: "Desayuno 🥐",
    LUNCH: "Almuerzo 🥗",
    DINNER: "Cena 🍝",
    DESSERT: "Postre 🍰",
    SNACK: "Snack 🍿",
    DRINK: "Bebida 🍹",
    OTHER: "Otro ✨",
  }),
});

/**
 * Función auxiliar para crear una receta optimizada
 * Evita duplicación de código y asegura consistencia
 *
 * @param {Object} recipe - Datos de la receta
 * @param {string} recipe.id - ID único de la receta
 * @param {string} recipe.name - Nombre de la receta
 * @param {string[]} recipe.ingredients - Lista de ingredientes
 * @param {string[]} recipe.instructions - Pasos de preparación
 * @param {string} recipe.prepTime - Tiempo de preparación
 * @param {string} recipe.category - Categoría de la receta
 * @param {string} recipe.imageUrl - URL de la imagen
 * @param {number} recipe.servings - Número de porciones
 * @returns {Object} Receta formateada y optimizada
 */
const createRecipe = (recipe) => {
  return Object.freeze({
    id: recipe.id,
    name: recipe.name,
    ingredients: Object.freeze([...recipe.ingredients]),
    instructions: Object.freeze([...recipe.instructions]),
    prepTime: recipe.prepTime,
    category: recipe.category,
    imageUrl: recipe.imageUrl || RECIPE_CONFIG.IMAGES.PLACEHOLDER,
    servings: recipe.servings,
    createdAt: RECIPE_CONFIG.BASE_TIMESTAMP,
  });
};

/**
 * Array de recetas predeterminadas optimizado
 * Cada receta está congelada para prevenir mutaciones accidentales
 * Organizado por categorías para mejor legibilidad y mantenimiento
 */
export const DEFAULT_RECIPES = Object.freeze([
  // =============================================================================
  // DESAYUNOS 🥐
  // =============================================================================
  createRecipe({
    id: "receta-2",
    name: "Arepa con Queso",
    ingredients: [
      "2 tazas de harina de maíz precocida",
      "2 1/2 tazas de agua tibia",
      "1 cucharadita de sal",
      "200g de queso mozzarella o costeño rallado",
      "Mantequilla para untar",
    ],
    instructions: [
      "En un recipiente, mezclar la sal con el agua tibia hasta disolverla completamente.",
      "Agregar gradualmente la harina de maíz, mezclando con las manos hasta formar una masa homogénea.",
      "Dejar reposar la masa por 5 minutos.",
      "Formar bolas del tamaño de una pelota de tenis y aplastar para dar forma de disco grueso.",
      "Cocinar en una plancha caliente por 8 minutos de cada lado hasta dorar.",
      "Hacer una abertura en la arepa con un cuchillo, rellenar con queso y un poco de mantequilla.",
      "Servir inmediatamente mientras el queso esté derretido.",
    ],
    prepTime: "25 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.BREAKFAST,
    imageUrl: "https://i.ytimg.com/vi/AJu0gRFsBrs/maxresdefault.jpg",
    servings: 4,
  }),

  createRecipe({
    id: "receta-7",
    name: "Calentado Paisa",
    ingredients: [
      "2 tazas de arroz del día anterior",
      "1 taza de frijoles cocidos",
      "200g de chicharrón troceado",
      "2 huevos",
      "1 cebolla mediana picada",
      "2 tomates picados",
      "Sal y pimienta al gusto",
      "Aceite para freír",
      "Arepa para acompañar",
    ],
    instructions: [
      "En una sartén grande, calentar aceite y freír el chicharrón hasta que esté crujiente.",
      "Agregar la cebolla y el tomate, sofreír hasta que estén tiernos.",
      "Añadir los frijoles y revolver por 3 minutos.",
      "Incorporar el arroz del día anterior y mezclar todo, salpimentar al gusto.",
      "En otra sartén, freír los huevos al gusto.",
      "Servir el calentado acompañado de los huevos fritos y arepa.",
    ],
    prepTime: "25 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.BREAKFAST,
    imageUrl:
      "https://mojo.generalmills.com/api/public/content/E0-vzj9d9UulD-SVrrdkww_gmi_hi_res_jpeg.jpeg?v=9e8db127&t=16e3ce250f244648bef28c5949fb99ff",
    servings: 4,
  }),

  createRecipe({
    id: "receta-8",
    name: "Changua con Huevo",
    ingredients: [
      "4 tazas de leche",
      "2 tazas de agua",
      "4 huevos",
      "4 tostadas",
      "Cilantro picado",
      "Cebolla larga picada",
      "Sal al gusto",
    ],
    instructions: [
      "En una olla, calentar el agua y la leche hasta que hierva.",
      "Agregar sal al gusto y la cebolla larga picada.",
      "Romper los huevos uno por uno directamente en la leche hirviendo.",
      "Cocinar por 3-4 minutos hasta que las claras estén cocidas pero las yemas cremosas.",
      "Partir las tostadas en pedazos y agregar a la sopa.",
      "Servir caliente y espolvorear con cilantro picado abundante.",
    ],
    prepTime: "15 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.BREAKFAST,
    imageUrl: "https://i.ytimg.com/vi/OII6GwDIq9Y/sddefault.jpg",
    servings: 4,
  }),

  createRecipe({
    id: "receta-12",
    name: "Huevos Pericos",
    ingredients: [
      "6 huevos",
      "3 tomates maduros picados",
      "1 cebolla mediana picada",
      "2 cucharadas de aceite",
      "Sal y pimienta al gusto",
      "Cilantro picado",
      "Cebolla larga picada",
    ],
    instructions: [
      "Calentar el aceite en una sartén a fuego medio.",
      "Sofreír la cebolla hasta que esté transparente y dorada.",
      "Agregar el tomate picado y cocinar hasta que se ablande y forme una salsa.",
      "Batir los huevos en un recipiente y salpimentar al gusto.",
      "Verter los huevos batidos en la sartén y revolver constantemente con una cuchara de palo.",
      "Cocinar hasta que los huevos estén cremosos pero bien cuajados.",
      "Espolvorear con cilantro y cebolla larga picada antes de servir.",
    ],
    prepTime: "15 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.BREAKFAST,
    imageUrl:
      "https://149496141.v2.pressablecdn.com/wp-content/uploads/2020/01/Huevos-Pericos.jpg",
    servings: 3,
  }),

  // =============================================================================
  // ALMUERZOS 🥗
  // =============================================================================
  createRecipe({
    id: "receta-1",
    name: "Ajiaco",
    ingredients: [
      "3 pechugas de pollo",
      "200g de papa pastusa",
      "300g de papa criolla",
      "1 rama de cebolla larga",
      "30g de cilantro",
      "1 manojo de guascas",
      "2 dientes de ajo picados",
      "1 mazorca grande",
      "1 taza de alcaparras",
      "2 litros de agua",
      "Crema de leche",
      "Sal y pimienta al gusto",
    ],
    instructions: [
      "Pela y corta en rodajas de 1 cm las papas pastusas.",
      "Corta la cebolla por la mitad y agrégala junto con ambos tipos de papa, la mazorca picada en 4 trozos y el agua a una olla grande.",
      "Salpimienta el pollo y añádelo a la olla con el ajo y el cilantro.",
      "Cocina todo a fuego medio durante 30 minutos. Luego, saca el pollo y desmenúzalo.",
      "Pon el pollo desmenuzado junto con las guascas en la olla y deja que cocine 10 minutos más.",
      "Cuando esté listo, saca la cebolla y sirve tu ajiaco con las alcaparras enteras y crema de leche.",
    ],
    prepTime: "50 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://polloseldorado.co/wp-content/uploads/2023/08/ajiaco-1024x536.jpg",
    servings: 6,
  }),

  createRecipe({
    id: "receta-4",
    name: "Arroz con Pollo",
    ingredients: [
      "2 tazas de arroz",
      "1 pollo despresado",
      "1 taza de arvejas",
      "1 zanahoria",
      "1 pimiento rojo",
      "4 tazas de caldo de pollo",
      "Azafrán o color",
      "Cilantro picado",
      "Sal y pimienta al gusto",
    ],
    instructions: [
      "Dorar las presas de pollo en una paellera o sartén grande.",
      "Retirar el pollo y en la misma grasa sofreír las verduras picadas.",
      "Agregar el arroz y sofreír por 2 minutos.",
      "Añadir el caldo caliente, el azafrán y el pollo.",
      "Cocinar a fuego medio por 20 minutos sin revolver.",
      "Incorporar las arvejas en los últimos 5 minutos.",
      "Dejar reposar 5 minutos antes de servir, decorar con cilantro.",
    ],
    prepTime: "45 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/LDRLW34JWNAPHDQ6I7KOOUJVKI.jpg",
    servings: 6,
  }),

  createRecipe({
    id: "receta-5",
    name: "Bandeja Paisa",
    ingredients: [
      "200g de carne molida",
      "100g de chicharrón",
      "1 taza de frijoles rojos cocidos",
      "1 taza de arroz blanco",
      "2 huevos",
      "1 plátano maduro",
      "1 aguacate",
      "1 arepa",
      "100g de morcilla",
      "100g de chorizo",
    ],
    instructions: [
      "Cocinar los frijoles rojos hasta que estén tiernos, condimentar al gusto.",
      "Preparar el arroz blanco de forma tradicional.",
      "Freír la carne molida con cebolla, tomate y condimentos.",
      "Freír el chicharrón hasta que esté crujiente.",
      "Freír el plátano maduro en rodajas hasta dorar.",
      "Freír los huevos al gusto y cocinar la morcilla y chorizo.",
      "Asar la arepa hasta que esté dorada.",
      "Servir todos los componentes en un plato grande con aguacate en rodajas.",
    ],
    prepTime: "60 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/7ZLBIEXDAFEUFB2MXROVEX2DHI.jpg",
    servings: 2,
  }),

  createRecipe({
    id: "receta-16",
    name: "Pescado a la Plancha con Patacón",
    ingredients: [
      "4 filetes de pescado (róbalo o pargo)",
      "2 plátanos verdes grandes",
      "Jugo de 2 limones",
      "Ajo molido, sal, pimienta",
      "Aceite para freír",
      "Ensalada verde",
      "Hogao para acompañar",
    ],
    instructions: [
      "Sazonar el pescado con limón, ajo, sal y pimienta. Marinar 30 minutos.",
      "Pelar los plátanos y cortarlos en rodajas gruesas.",
      "Freír las rodajas de plátano hasta dorar, retirar y aplastar.",
      "Freír nuevamente los patacones hasta que estén crujientes y dorados.",
      "Calentar una plancha y cocinar el pescado por 4-5 minutos de cada lado.",
      "Servir el pescado acompañado de los patacones crujientes.",
      "Acompañar con ensalada fresca y hogao al lado.",
    ],
    prepTime: "45 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://storage.googleapis.com/fitia_public_images/recipes%2FGR-R-V-00004757_he8j3zs0wr15eipnpsxfqfdj_large.jpg",
    servings: 4,
  }),

  createRecipe({
    id: "receta-17",
    name: "Sancocho Trifásico",
    ingredients: [
      "300g de pollo despresado",
      "300g de carne de res",
      "300g de carne de cerdo",
      "1 mazorca cortada",
      "200g de yuca",
      "200g de plátano verde",
      "200g de ñame",
      "Cilantro, cebolla, ajo",
      "Sal, comino y color al gusto",
    ],
    instructions: [
      "En una olla grande, cocinar las tres carnes con agua, sal y condimentos.",
      "Cuando las carnes estén medio cocidas, agregar la mazorca cortada en ruedas.",
      "Añadir la yuca, el ñame y el plátano verde pelados y cortados en trozos grandes.",
      "Cocinar hasta que todos los ingredientes estén tiernos (aproximadamente 45 minutos).",
      "Preparar un sofrito con cebolla, ajo, cilantro y color.",
      "Agregar el sofrito al sancocho y cocinar 10 minutos más.",
      "Servir caliente acompañado de arroz blanco, aguacate y ají.",
    ],
    prepTime: "90 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://www.mycolombianrecipes.com/wp-content/uploads/2013/11/Sancocho-trifasico.jpg",
    servings: 8,
  }),

  createRecipe({
    id: "receta-18",
    name: "Sudado de Pollo",
    ingredients: [
      "1 pollo despresado",
      "4 papas medianas",
      "2 zanahorias",
      "1 cebolla grande",
      "3 tomates",
      "1 pimiento rojo",
      "Cilantro y ajo",
      "Sal, comino, pimienta",
      "Aceite para sofreír",
    ],
    instructions: [
      "Dorar las presas de pollo en una olla con aceite caliente hasta sellar por todos los lados.",
      "Agregar cebolla, ajo y tomate picados, sofreír hasta que estén marchitos.",
      "Añadir las papas y zanahorias peladas y cortadas en trozos medianos.",
      "Incorporar el pimiento en tiras y condimentar con sal, comino y pimienta.",
      "Agregar un poco de agua o caldo, tapar y cocinar a fuego medio por 35 minutos.",
      "Remover ocasionalmente y agregar más líquido si es necesario.",
      "Espolvorear con cilantro fresco antes de servir acompañado de arroz.",
    ],
    prepTime: "50 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl: "https://i.ytimg.com/vi/jFn-F0Pc664/maxresdefault.jpg",
    servings: 6,
  }),

  createRecipe({
    id: "receta-19",
    name: "Tamales Tolimenses",
    ingredients: [
      "2 libras de masa de maíz",
      "1 libra de carne de cerdo",
      "1 libra de pollo",
      "200g de tocino",
      "4 huevos duros",
      "200g de arvejas",
      "200g de zanahoria",
      "Hojas de plátano",
      "Sal, comino, color y condimentos",
    ],
    instructions: [
      "Cocinar las carnes hasta que estén tiernas y desmechar finamente.",
      "Preparar un guiso con cebolla, tomate, ajo y las carnes desmechadas.",
      "Amasar la masa de maíz con sal, color y un poco del caldo de las carnes hasta suavizar.",
      "Escaldar las hojas de plátano en agua hirviendo para suavizarlas.",
      "Extender la masa sobre las hojas de plátano previamente limpias.",
      "Rellenar con el guiso, huevo duro, arvejas y zanahoria cocida.",
      "Envolver bien formando un paquete y amarrar con tiras de las mismas hojas.",
      "Cocinar en agua hirviendo por 2-3 horas hasta que estén completamente cocidos.",
    ],
    prepTime: "240 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://s3.amazonaws.com/rtvc-assets-senalcolombia.gov.co/s3fs-public/inline-images/tamal%20tolimense..jpg",
    servings: 12,
  }),

  createRecipe({
    id: "receta-22",
    name: "Mojarra Frita",
    ingredients: [
      "2 mojarras grandes enteras",
      "Jugo de 3 limones",
      "4 dientes de ajo molidos",
      "Sal y pimienta al gusto",
      "Comino molido",
      "Harina de trigo para enharinar",
      "Aceite abundante para freír",
      "Patacones para acompañar",
    ],
    instructions: [
      "Limpiar bien las mojarras, hacer cortes diagonales en los costados.",
      "Marinar con limón, ajo, sal, pimienta y comino por 30 minutos.",
      "Enharinar las mojarras por ambos lados.",
      "Calentar abundante aceite en una sartén grande a fuego medio-alto.",
      "Freír las mojarras por 6-8 minutos de cada lado hasta dorar completamente.",
      "Escurrir en papel absorbente para retirar el exceso de aceite.",
      "Servir inmediatamente acompañadas de patacones, arroz con coco y ensalada.",
    ],
    prepTime: "45 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl:
      "https://popmenucloud.com/cdn-cgi/image/width=1200,height=630,format=auto,fit=cover/fwadrutl/98349f72-f366-47ef-8b78-f8754ee3f883.jpeg",
    servings: 4,
  }),

  createRecipe({
    id: "receta-23",
    name: "Costillas BBQ",
    ingredients: [
      "2 kg de costillas de cerdo",
      "1/2 taza de salsa BBQ",
      "1/4 taza de miel",
      "2 cucharadas de mostaza",
      "2 cucharadas de salsa de soya",
      "4 dientes de ajo molidos",
      "1 cucharada de pimentón dulce",
      "Sal y pimienta negra",
      "Jugo de 1 limón",
    ],
    instructions: [
      "Salpimentar las costillas y marinar con ajo y limón por 1 hora.",
      "Mezclar la salsa BBQ, miel, mostaza, salsa de soya y pimentón para crear la salsa.",
      "Precalentar el horno a 160°C.",
      "Colocar las costillas en una bandeja y cubrir con papel aluminio.",
      "Hornear por 2 horas hasta que estén tiernas.",
      "Retirar el papel aluminio y bañar con la salsa BBQ.",
      "Aumentar la temperatura a 200°C y hornear 20 minutos más hasta caramelizar.",
      "Servir calientes con más salsa BBQ al lado.",
    ],
    prepTime: "180 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.LUNCH,
    imageUrl: "https://i.blogs.es/5fc93e/1/1366_2000.jpg",
    servings: 6,
  }),

  // =============================================================================
  // POSTRES 🍰
  // =============================================================================
  createRecipe({
    id: "receta-3",
    name: "Arroz con Leche",
    ingredients: [
      "1 taza de arroz",
      "4 tazas de leche entera",
      "1 taza de azúcar",
      "1 astilla de canela",
      "Cáscara de limón",
      "1 lata de leche condensada",
      "Canela en polvo para decorar",
      "Uvas pasas (opcional)",
    ],
    instructions: [
      "Cocinar el arroz en agua hasta que esté tierno, escurrir bien.",
      "En una olla, hervir la leche con la canela y la cáscara de limón.",
      "Agregar el arroz cocido y el azúcar a la leche hirviendo.",
      "Cocinar a fuego lento removiendo constantemente por 20 minutos.",
      "Incorporar la leche condensada y cocinar 5 minutos más hasta espesar.",
      "Retirar la canela y la cáscara de limón.",
      "Servir frío espolvoreado con canela en polvo y uvas pasas si se desea.",
    ],
    prepTime: "45 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DESSERT,
    imageUrl:
      "https://images.aws.nestle.recipes/resized/5d1538f70241ea26fa2c73c4cb5d06ff_arroz-con-leche_1200_628.jpeg",
    servings: 6,
  }),

  createRecipe({
    id: "receta-11",
    name: "Flan de Coco",
    ingredients: [
      "1 taza de azúcar para el caramelo",
      "400ml de leche de coco",
      "4 huevos",
      "1/2 taza de azúcar",
      "1 cucharadita de vainilla",
      "Coco rallado para decorar",
    ],
    instructions: [
      "Preparar caramelo dorando 1 taza de azúcar a fuego medio hasta obtener color dorado.",
      "Verter el caramelo en el molde para flan y cubrir todo el fondo.",
      "Batir los huevos con 1/2 taza de azúcar hasta espumar bien.",
      "Agregar la leche de coco y la vainilla, mezclar suavemente.",
      "Colar la mezcla y verter sobre el caramelo en el molde.",
      "Cocinar al baño maría por 45 minutos o hasta que al insertar un palillo salga limpio.",
      "Enfriar completamente antes de desmoldar y decorar con coco rallado.",
    ],
    prepTime: "90 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DESSERT,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-fJCs_zojm7rIMwLEhj_MzQEg7biZPdX9gw&s",
    servings: 8,
  }),

  createRecipe({
    id: "receta-20",
    name: "Torta de Plátano",
    ingredients: [
      "4 plátanos maduros grandes",
      "3 huevos",
      "1/2 taza de azúcar",
      "1/4 taza de mantequilla derretida",
      "1 taza de harina de trigo",
      "1 cucharadita de polvo de hornear",
      "1/2 cucharadita de canela",
      "1/4 cucharadita de nuez moscada",
      "Una pizca de sal",
    ],
    instructions: [
      "Precalentar el horno a 180°C y engrasar un molde para torta.",
      "Machacar los plátanos maduros hasta obtener un puré suave.",
      "Batir los huevos con el azúcar hasta que estén espumosos.",
      "Incorporar el puré de plátano y la mantequilla derretida a los huevos.",
      "En otro recipiente, mezclar la harina, polvo de hornear, canela, nuez moscada y sal.",
      "Integrar los ingredientes secos con la mezcla húmeda sin batir en exceso.",
      "Verter la mezcla en el molde y hornear por 35-40 minutos.",
      "Dejar enfriar antes de desmoldar y servir.",
    ],
    prepTime: "60 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DESSERT,
    imageUrl:
      "https://img-global.cpcdn.com/recipes/f486c8561c4ae35b/1200x630cq70/photo.jpg",
    servings: 8,
  }),

  createRecipe({
    id: "receta-21",
    name: "Tres Leches",
    ingredients: [
      "6 huevos",
      "200g de azúcar",
      "200g de harina de trigo",
      "1 lata de leche condensada",
      "1 lata de leche evaporada",
      "1 taza de crema de leche líquida",
      "1 cucharadita de vainilla",
      "Canela en polvo para decorar",
    ],
    instructions: [
      "Batir los huevos con el azúcar hasta triplicar el volumen y blanquear.",
      "Incorporar la harina tamificada con movimientos envolventes suaves.",
      "Hornear en molde engrasado a 180°C por 25-30 minutos hasta dorar.",
      "Mezclar las tres leches (condensada, evaporada y crema) con la vainilla.",
      "Hacer agujeros por toda la superficie del bizcocho con un palillo.",
      "Bañar completamente el bizcocho con la mezcla de las tres leches.",
      "Refrigerar por mínimo 4 horas o toda la noche antes de servir.",
      "Decorar con canela en polvo antes de servir.",
    ],
    prepTime: "300 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DESSERT,
    imageUrl:
      "https://www.lemonblossoms.com/wp-content/uploads/2023/03/Tres-Leches-Cake-S2-500x500.jpg",
    servings: 10,
  }),

  // =============================================================================
  // SNACKS 🍿
  // =============================================================================
  createRecipe({
    id: "receta-9",
    name: "Empanadas de Carne",
    ingredients: [
      "500g de harina de maíz amarilla",
      "300g de carne molida",
      "1 cebolla picada",
      "2 tomates picados",
      "1 pimiento rojo picado",
      "Comino, sal, pimienta",
      "Color (achiote)",
      "Aceite para freír",
    ],
    instructions: [
      "Preparar un guiso con la carne molida, cebolla, tomate y pimiento. Condimentar con comino, sal y pimienta.",
      "Preparar la masa con harina de maíz, agua tibia, sal y color hasta obtener consistencia suave.",
      "Amasar bien hasta que no se agriete.",
      "Formar discos de masa y rellenar con el guiso en el centro.",
      "Cerrar las empanadas presionando los bordes con un tenedor para sellar bien.",
      "Freír en aceite caliente hasta que estén doradas y crujientes.",
      "Escurrir en papel absorbente y servir calientes.",
    ],
    prepTime: "45 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.SNACK,
    imageUrl:
      "https://comidasparaguayas.com/assets/images/empanada-de-carne_800x534.webp",
    servings: 12,
  }),

  createRecipe({
    id: "receta-10",
    name: "Empanadas de Pollo",
    ingredients: [
      "500g de harina de maíz precocida",
      "2 pechugas de pollo",
      "1 cebolla picada",
      "2 dientes de ajo",
      "1 tomate picado",
      "Pasta de tomate",
      "Sal, pimienta y comino",
      "Aceite para freír",
    ],
    instructions: [
      "Cocinar las pechugas de pollo en agua con sal hasta que estén tiernas.",
      "Desmechar el pollo en tiras delgadas y reservar el caldo.",
      "Preparar un sofrito con cebolla, ajo y pasta de tomate, agregar el pollo desmechado.",
      "Condimentar con sal, pimienta y comino, cocinar 10 minutos.",
      "Preparar la masa con harina de maíz y el caldo de pollo tibio.",
      "Formar discos, rellenar con el guiso de pollo y cerrar bien.",
      "Freír en aceite caliente hasta dorar por ambos lados.",
    ],
    prepTime: "50 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.SNACK,
    imageUrl:
      "https://campollo.com/wp-content/uploads/2024/08/RECETA-DE-EMPANADAS-DE-POLLO-AGOSTO-scaled.jpg",
    servings: 15,
  }),

  createRecipe({
    id: "receta-15",
    name: "Patacones con Hogao",
    ingredients: [
      "3 plátanos verdes grandes",
      "2 tomates maduros",
      "1 cebolla mediana",
      "2 dientes de ajo",
      "Cilantro picado",
      "Aceite para freír",
      "Sal al gusto",
      "Cebolla larga",
    ],
    instructions: [
      "Pelar los plátanos y cortarlos en rodajas gruesas de 2 cm.",
      "Freír las rodajas en aceite caliente hasta dorar ligeramente.",
      "Retirar y aplastar cada rodaja con un plato o tostonera hasta quedar planas.",
      "Freír nuevamente hasta que estén dorados y muy crujientes.",
      "Para el hogao: sofreír cebolla, ajo y cebolla larga picados hasta transparentar.",
      "Agregar tomate picado y cocinar hasta formar una salsa espesa.",
      "Sazonar el hogao con sal y cilantro al gusto.",
      "Servir los patacones calientes cubiertos con el hogao y cilantro fresco.",
    ],
    prepTime: "30 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.SNACK,
    imageUrl:
      "https://vecinavegetariana.com/wp-content/uploads/2021/09/20210825_132959_edited-klein.jpeg",
    servings: 4,
  }),

  // =============================================================================
  // BEBIDAS 🍹
  // =============================================================================
  createRecipe({
    id: "receta-6",
    name: "Café",
    ingredients: [
      "30g de café molido",
      "500ml de agua",
      "Azúcar al gusto",
      "Leche opcional",
    ],
    instructions: [
      "Calentar el agua hasta que esté a punto de hervir (90-95°C).",
      "Colocar el café molido en un filtro o cafetera.",
      "Verter el agua caliente sobre el café de manera circular y lenta.",
      "Dejar que el café se filtre lentamente (3-4 minutos).",
      "Servir inmediatamente en tazas precalentadas.",
      "Endulzar al gusto y agregar leche si se desea.",
      "Acompañar con una galleta o arepa pequeña.",
    ],
    prepTime: "10 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DRINK,
    imageUrl:
      "https://i.revistapym.com.co/cms/2023/06/27174038/portada-cafe.jpeg?w=412&d=2.625",
    servings: 2,
  }),

  createRecipe({
    id: "receta-13",
    name: "Limonada de Coco",
    ingredients: [
      "1 coco fresco grande",
      "6 limones",
      "1/2 taza de azúcar",
      "3 tazas de agua fría",
      "Hielo picado",
      "Una pizca de sal",
    ],
    instructions: [
      "Extraer el agua y la pulpa del coco fresco.",
      "En la licuadora, mezclar la pulpa de coco con el agua de coco extraída.",
      "Agregar el jugo recién exprimido de los limones y el azúcar.",
      "Añadir una pizca de sal para realzar el sabor.",
      "Incorporar el agua fría y el hielo, licuar hasta obtener mezcla homogénea.",
      "Colar si se desea una textura más suave y sin pulpa.",
      "Servir inmediatamente en vasos con hielo y decorar con rodajas de limón.",
    ],
    prepTime: "20 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DRINK,
    imageUrl: "https://restaurantegostinos.com/wp-content/uploads/045.jpg",
    servings: 4,
  }),

  createRecipe({
    id: "receta-14",
    name: "Limonada Natural",
    ingredients: [
      "8 limones grandes",
      "1 litro de agua fría",
      "1/2 taza de azúcar (o al gusto)",
      "Hielo al gusto",
      "Una pizca de sal",
      "Hojas de menta fresca para decorar",
    ],
    instructions: [
      "Lavar bien los limones y extraer todo el jugo en un recipiente.",
      "En una jarra grande, mezclar el jugo de limón con el azúcar.",
      "Agregar una pizca de sal para potenciar el sabor cítrico.",
      "Incorporar el agua fría y revolver hasta que el azúcar se disuelva completamente.",
      "Probar y ajustar el dulzor agregando más azúcar si es necesario.",
      "Servir en vasos con abundante hielo.",
      "Decorar con hojas de menta fresca y una rodaja de limón.",
    ],
    prepTime: "10 minutos",
    category: RECIPE_CONFIG.CATEGORY_MAP.DRINK,
    imageUrl:
      "https://cdn0.uncomo.com/es/posts/0/9/0/como_hacer_limonada_sin_azucar_51090_orig.jpg",
    servings: 4,
  }),
]);

// =============================================================================
// COMPUTED VALUES - Valores derivados para optimización
// =============================================================================

/**
 * Map optimizado de recetas por categoría para acceso O(1)
 * Evita filtros repetidos en tiempo de ejecución
 */
export const RECIPES_BY_CATEGORY = Object.freeze(
  DEFAULT_RECIPES.reduce((acc, recipe) => {
    if (!acc[recipe.category]) {
      acc[recipe.category] = [];
    }
    acc[recipe.category].push(recipe);
    return acc;
  }, {})
);

/**
 * Set optimizado de IDs de recetas para validación O(1)
 * Útil para verificar si una receta existe
 */
export const RECIPE_IDS_SET = new Set(
  DEFAULT_RECIPES.map((recipe) => recipe.id)
);

/**
 * Map optimizado de recetas por ID para acceso directo O(1)
 * Evita búsquedas lineales en el array
 */
export const RECIPES_BY_ID = new Map(
  DEFAULT_RECIPES.map((recipe) => [recipe.id, recipe])
);

/**
 * Estadísticas computadas de las recetas para métricas
 * Valores pre-calculados para mejor rendimiento
 */
export const RECIPE_STATS = Object.freeze({
  TOTAL_RECIPES: DEFAULT_RECIPES.length,
  CATEGORIES_COUNT: Object.keys(RECIPES_BY_CATEGORY).length,
  AVERAGE_PREP_TIME: Math.round(
    DEFAULT_RECIPES.reduce((sum, recipe) => {
      const minutes = parseInt(recipe.prepTime) || 0;
      return sum + minutes;
    }, 0) / DEFAULT_RECIPES.length
  ),
  AVERAGE_SERVINGS: Math.round(
    DEFAULT_RECIPES.reduce((sum, recipe) => sum + recipe.servings, 0) /
      DEFAULT_RECIPES.length
  ),
});

// =============================================================================
// DEPRECATED - Mantenidos para compatibilidad hacia atrás
// =============================================================================

/**
 * @deprecated Usar DEFAULT_RECIPES en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const defaultRecipes = DEFAULT_RECIPES;
