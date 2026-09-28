/* i18n.js — Arabic (source) / English / Spanish for "اكتشف صعيد مصر".
 * Translates visible text nodes and key attributes in place, flips <html dir>, and swaps the Latin font stack.
 * Keys are the source strings as written in index.html (tatweel and extra spaces ignored).
 */
window.I18N = (() => {
  'use strict';
  const D = {
    /* ---- brand & nav ---- */
    'اكتشف': { en: 'Discover', es: 'Descubre' },
    'صعيد مصر': { en: 'Upper Egypt', es: 'Alto Egipto' },
    'الرئيسية': { en: 'Home', es: 'Inicio' },
    'الجولات': { en: 'Tours', es: 'Rutas' },
    'الوجهات': { en: 'Destinations', es: 'Destinos' },
    'التجارب': { en: 'Experiences', es: 'Experiencias' },
    'تواصل معنا': { en: 'Contact us', es: 'Contacto' },
    'اللغة': { en: 'Language', es: 'Idioma' },
    'التنقل الرئيسي': { en: 'Main navigation', es: 'Navegación principal' },
    'اكتشف صعيد مصر — الصفحة الرئيسية': { en: 'Discover Upper Egypt — Home', es: 'Descubre el Alto Egipto — Inicio' },
    'اكتشف صعيد مصر — أعلى الصفحة': { en: 'Discover Upper Egypt — back to top', es: 'Descubre el Alto Egipto — volver arriba' },
    'اكتشف صعيد مصر': { en: 'Discover Upper Egypt', es: 'Descubre el Alto Egipto' },
    'ابحث عن وجهة…': { en: 'Search destinations…', es: 'Buscar destinos…' },
    'بحث': { en: 'Search', es: 'Buscar' },
    'بحث عن: ': { en: 'Searching for: ', es: 'Buscando: ' },
    'القائمة': { en: 'Menu', es: 'Menú' },
    'قائمة التنقل': { en: 'Navigation menu', es: 'Menú de navegación' },
    'تم تغيير اللغة': { en: 'Language: English', es: 'Idioma: Español' },
    'اللغة: العربية': { en: 'Language: Arabic', es: 'Idioma: Árabe' },

    /* ---- hero ---- */
    'حكايات من قلب الصعيد': { en: 'Stories from the heart of the South', es: 'Historias desde el corazón del Sur' },
    'من الأقصر إلى أسوان، اكتشف أماكن وتجارب وحرفاً تحكي قصة الجنوب كما يعيشها أهله.': {
      en: 'From Luxor to Aswan, discover places, experiences and crafts that tell the story of the South the way its people live it.',
      es: 'De Luxor a Asuán, descubre lugares, experiencias y oficios que cuentan la historia del Sur tal como la vive su gente.' },
    'ابدأ الاستكشاف': { en: 'Start exploring', es: 'Empieza a explorar' },
    'كولاج لصعيد مصر: سيدة نوبية مبتسمة، حرفي يشكّل الفخار، معابد وأشرعة على النيل': {
      en: 'Collage of Upper Egypt: a smiling Nubian woman, a potter at work, temples and sails on the Nile',
      es: 'Collage del Alto Egipto: una mujer nubia sonriente, un alfarero trabajando, templos y velas en el Nilo' },

    /* ---- paths ---- */
    'اختر ما يناسب مسارك': { en: 'Choose your path', es: 'Elige tu camino' },
    'رحلة بين مدينتين': { en: 'A journey between two cities', es: 'Un viaje entre dos ciudades' },
    'لحظات تبقى معك': { en: 'Experiences that stay with you', es: 'Experiencias que se quedan contigo' },
    'لا تفوّت ما يحدث': { en: 'Upcoming events', es: 'Próximos eventos' },
    'اكتشف ما يناسبك في صعيد مصر': { en: 'Find what suits you in Upper Egypt', es: 'Encuentra lo que va contigo en el Alto Egipto' },
    'للسياح والزوار': { en: 'For travellers & visitors', es: 'Para viajeros y visitantes' },
    'عش تجربة أصيلة بين النيل والتاريخ والضيافة الصعيدية': { en: 'Live an authentic experience between the Nile, history and Upper Egyptian hospitality.', es: 'Vive una experiencia auténtica entre el Nilo, la historia y la hospitalidad del Alto Egipto.' },
    'استكشف المزيد': { en: 'Explore more', es: 'Explorar más' },
    'لرواد الأعمال': { en: 'For entrepreneurs', es: 'Para emprendedores' },
    'تعرّف على الفرص الاستثمارية في الحرف والصناعات التراثية': { en: 'Discover investment opportunities in heritage crafts and industries.', es: 'Descubre oportunidades de inversión en la artesanía y las industrias del patrimonio.' },
    'للمستكشفين': { en: 'For explorers', es: 'Para exploradores' },
    'شراكات وفرص للمؤسسات والجهات السياحية لتطوير الوجهة معًا': { en: 'Partnerships and opportunities for institutions and tourism bodies to develop the destination together', es: 'Alianzas y oportunidades para instituciones y entidades turísticas para desarrollar el destino juntos' },
    'اكتشف الكنوز الأثرية والطبيعة الخلابة في صعيد مصر': { en: 'Uncover archaeological treasures and breathtaking nature across Upper Egypt.', es: 'Descubre tesoros arqueológicos y una naturaleza impresionante en todo el Alto Egipto.' },
    'رجلان صعيديان يتشاركان الشاي والتمر على ضفاف النيل': { en: 'Two Upper Egyptian men sharing tea and dates by the Nile', es: 'Dos hombres del Alto Egipto compartiendo té y dátiles junto al Nilo' },
    'سيدة مبتسمة تحمل منسوجات يدوية ملوّنة': { en: 'A smiling woman carrying colourful handwoven textiles', es: 'Una mujer sonriente con tejidos artesanales de colores' },
    'تماثيل وأعمدة معبد الأقصر عند الغروب': { en: 'Statues and columns of Luxor Temple at sunset', es: 'Estatuas y columnas del templo de Luxor al atardecer' },

    /* ---- experiences ---- */
    'Experiences that stay with you': { es: 'Experiencias que se quedan contigo' },
    'تجارب مختارة': { en: 'Handpicked experiences', es: 'Experiencias seleccionadas' },
    'لك': { en: 'for you', es: 'para ti' },
    'رحلة فلوكة عند الغروب': { en: 'Sunset felucca ride', es: 'Paseo en faluca al atardecer' },
    'استمتع بجمال النيل في رحلة هادئة بين أسوان وجزرها الساحرة، حيث يلتقي التاريخ بالطبيعة في أجمل صورة.': {
      en: 'Drift along the Nile between Aswan and its enchanting islands, where history meets nature at its most beautiful.',
      es: 'Navega por el Nilo entre Asuán y sus islas encantadoras, donde la historia se encuentra con la naturaleza en su forma más bella.' },
    'ساعتان تقريباً': { en: 'About 2 hours', es: 'Unas 2 horas' },
    'أسوان': { en: 'Aswan', es: 'Asuán' },
    'الأقصر': { en: 'Luxor', es: 'Luxor' },
    'اكتشف التجربة': { en: 'Discover this experience', es: 'Descubre esta experiencia' },
    'مذاقات صعيدية أصيلة': { en: 'Authentic Upper Egyptian flavours', es: 'Sabores auténticos del Alto Egipto' },
    'رحلة في عالم النكهات المحلية والأطباق التقليدية التي تحكي قصة المكان، من خبز الفرن البلدي إلى شاي الغروب على النيل.': {
      en: 'A journey through local flavours and traditional dishes that tell the story of the place, from village oven bread to sunset tea by the Nile.',
      es: 'Un viaje por los sabores locales y los platos tradicionales que cuentan la historia del lugar, del pan de horno de pueblo al té del atardecer junto al Nilo.' },
    '٢-٣ ساعات': { en: '2–3 hours', es: '2–3 horas' },
    'حرف تمتد عبر الأجيال': { en: 'Crafts passed down generations', es: 'Oficios de generación en generación' },
    'تعرف على الحرف اليدوية التقليدية وقابل الحرفيين المحليين في قرى الصعيد، وجرّب بنفسك النسيج والخزف والخوص.': {
      en: 'Meet local artisans in the villages of Upper Egypt and try weaving, pottery and palm-frond craft with your own hands.',
      es: 'Conoce a los artesanos locales en los pueblos del Alto Egipto y prueba con tus propias manos el tejido, la cerámica y la cestería de palma.' },
    'ساعة ونصف': { en: '1.5 hours', es: '1,5 horas' },
    'معابد تحكي التاريخ': { en: 'Temples that tell history', es: 'Templos que cuentan la historia' },
    'اكتشف عظمة الحضارة المصرية القديمة في معابد الأقصر المهيبة، مع مرشد يروي حكايات الملوك والآلهة بين الأعمدة.': {
      en: "Stand before the grandeur of ancient Egypt in Luxor's majestic temples, with a guide sharing tales of kings and gods among the columns.",
      es: 'Contempla la grandeza del antiguo Egipto en los majestuosos templos de Luxor, con un guía que comparte relatos de reyes y dioses entre las columnas.' },
    '٣-٤ ساعات': { en: '3–4 hours', es: '3–4 horas' },
    'فلوكة تعبر النيل عند الغروب بين الجبال والنخيل': { en: 'A felucca crossing the Nile at sunset between mountains and palms', es: 'Una faluca cruzando el Nilo al atardecer entre montañas y palmeras' },
    'افتح: رحلة فلوكة عند الغروب': { en: 'Open: Sunset felucca ride', es: 'Abrir: Paseo en faluca al atardecer' },
    'افتح: مذاقات صعيدية أصيلة': { en: 'Open: Authentic Upper Egyptian flavours', es: 'Abrir: Sabores auténticos del Alto Egipto' },
    'افتح: حرف تمتد عبر الأجيال': { en: 'Open: Crafts passed down generations', es: 'Abrir: Oficios de generación en generación' },
    'افتح: معابد تحكي التاريخ': { en: 'Open: Temples that tell history', es: 'Abrir: Templos que cuentan la historia' },

    /* ---- journey ---- */
    'من الأقصر إلى أسوان': { en: 'From Luxor to Aswan', es: 'De Luxor a Asuán' },
    'استكشف الأقصر': { en: 'Explore Luxor', es: 'Explorar Luxor' },
    'استكشف أسوان': { en: 'Explore Aswan', es: 'Explorar Asuán' },
    'كولاج يصل بين بيوت النوبة الزرقاء في أسوان ومعابد الأقصر عبر النيل': { en: 'Collage linking the blue Nubian houses of Aswan with the temples of Luxor across the Nile', es: 'Collage que une las casas nubias azules de Asuán con los templos de Luxor a través del Nilo' },

    /* ---- events ---- */
    'Upcoming events ·': { es: 'Próximos eventos ·' },
    'فعاليات': { en: 'Upcoming', es: 'Próximos' },
    'قادمة': { en: 'events', es: 'eventos' },
    'موسيقى': { en: 'Music', es: 'Música' },
    'أمسية نيلية': { en: 'A Nile evening', es: 'Una noche en el Nilo' },
    'على ضفاف أسوان': { en: 'on the banks of Aswan', es: 'a orillas de Asuán' },
    'استمتع بأجواء موسيقية ساحرة وسط جمال النيل وتحت النجوم.': { en: 'An enchanting evening of music by the Nile, under the stars.', es: 'Una velada musical encantadora junto al Nilo, bajo las estrellas.' },
    '6:00 مساءً': { en: '6:00 PM', es: '18:00' },
    'اكتشف الفعالية': { en: 'See event details', es: 'Ver detalles del evento' },
    'A different kind of peace': { es: 'Una paz diferente' },
    'عرض كل الفعاليات': { en: 'View all events', es: 'Ver todos los eventos' },
    'الفعالية التالية': { en: 'Next event', es: 'Siguiente evento' },
    'الفعالية السابقة': { en: 'Previous event', es: 'Evento anterior' },
    'الفعاليات القادمة': { en: 'Upcoming events', es: 'Próximos eventos' },
    'أمسية نيلية على ضفاف أسوان': { en: 'A Nile evening on the banks of Aswan', es: 'Una noche en el Nilo a orillas de Asuán' },
    '28 أكتوبر — أمسية نيلية على ضفاف أسوان': { en: '28 October — A Nile evening on the banks of Aswan', es: '28 de octubre — Una noche en el Nilo a orillas de Asuán' },
    '2 نوفمبر — سباق الفلايك السنوي': { en: '2 November — The annual felucca race', es: '2 de noviembre — La regata anual de falucas' },
    '15 نوفمبر — مهرجان المائدة الصعيدية': { en: '15 November — Upper Egyptian food festival', es: '15 de noviembre — Festival gastronómico del Alto Egipto' },
    '22 نوفمبر — أسبوع الحرف اليدوية': { en: '22 November — Handicrafts week', es: '22 de noviembre — Semana de la artesanía' },

    /* ---- newsletter ---- */
    'ابقَ على تواصل': { en: 'Stay in touch', es: 'Sigamos en contacto' },
    'أحدث القصص، الفعاليات والفرص مباشرة إلى بريدك.': { en: 'The latest stories, events and opportunities, straight to your inbox.', es: 'Las últimas historias, eventos y oportunidades, directamente en tu correo.' },
    'بريدك الإلكتروني': { en: 'Your email address', es: 'Tu correo electrónico' },
    'اشترك الآن': { en: 'Subscribe', es: 'Suscribirme' },
    'من فضلك أدخل بريداً إلكترونياً صحيحاً.': { en: 'Please enter a valid email address.', es: 'Introduce un correo electrónico válido.' },
    'تم الاشتراك! سنرسل لك أحدث القصص والفعاليات.': { en: "You're in! We'll send you the latest stories and events.", es: '¡Listo! Te enviaremos las últimas historias y eventos.' },

    /* ---- stories: رواد يصنعون الأثر ---- */
    'قصص ملهمة من الصعيد': { en: 'Featured entrepreneurs', es: 'Emprendedores destacados' },
    'رواد يصنعون الأثر': { en: 'Stories Made in Upper Egypt', es: 'Historias hechas en el Alto Egipto' },
    'تعرّف على سيدات وشباب من الأقصر وأسوان حوّلوا الحرف والتراث المحلي إلى مشاريع تنبض بالإبداع وتخلق فرصًا جديدة لمجتمعاتهم.':
      { en: 'Meet the local entrepreneurs, women and youth who are turning heritage, creativity and community into thriving businesses across Luxor and Aswan.',
        es: 'Conoce a los emprendedores locales, mujeres y jóvenes que convierten el patrimonio, la creatividad y la comunidad en negocios prósperos en Luxor y Asuán.' },
    'استكشف جميع الرواد': { en: 'Explore all entrepreneurs', es: 'Explora todos los emprendedores' },
    'عرض القصة': { en: 'View profile', es: 'Ver perfil' },
    'حرف يدوية': { en: 'Handicrafts', es: 'Artesanía' },
    'إكسسوارات': { en: 'Accessories', es: 'Accesorios' },
    'مهارات وتدريب': { en: 'Skills & Training', es: 'Habilidades y formación' },
    'التنقل بين القصص': { en: 'Story navigation', es: 'Navegación de historias' },
    'القصة السابقة': { en: 'Previous story', es: 'Historia anterior' },
    'القصة التالية': { en: 'Next story', es: 'Siguiente historia' },
    'فاطمة البغدادي': { en: 'Fatma Boghdady', es: 'Fatma Boghdady' },
    'الحرفجية': { en: 'El Herfagya', es: 'El Herfagya' },
    'تُبدع فاطمة في تصميم وصناعة منتجات جلدية يدوية مستوحاة من التراث المصري القديم، حيث تمزج بين الحرف التقليدية والتصميم العصري لتقدم قطعاً تحكي قصة الأقصر بروح جديدة.':
      { en: 'Fatma and her team create embroidery, leatherwork and handmade products that reflect the culture of Luxor. She launched a line of bags with Pharaonic motifs that has been exported abroad.',
        es: 'Fatma y su equipo crean bordados, marroquinería y productos hechos a mano que reflejan la cultura de Luxor. Lanzó una línea de bolsos con motivos faraónicos que se exporta al extranjero.' },
    'فاطمة البغدادي في ورشتها بالأقصر وأمامها حقائب جلدية وإكسسوارات من صنعها': { en: 'Fatma Boghdady in her Luxor workshop with her handmade leather bags and accessories', es: 'Fatma Boghdady en su taller de Luxor con sus bolsos de cuero y accesorios hechos a mano' },
    'زينب جمال': { en: 'Zainab Gamal', es: 'Zainab Gamal' },
    'زينب للإكسسوارات': { en: 'Zainab Accessories', es: 'Zainab Accessories' },
    'تصنع زينب إكسسوارات يدوية مستوحاة من جمال الطبيعة والتراث المحلي، لتقدم منتجات فريدة تعكس هوية الصعيد وتدعم الحرف المنزلية.':
      { en: 'Zainab creates unique accessories from her home workshop. She has developed her own designs and aims to grow her business beyond Luxor.',
        es: 'Zainab crea accesorios únicos desde su taller en casa. Ha desarrollado sus propios diseños y quiere hacer crecer su negocio más allá de Luxor.' },
    'منال عوض الله في كولاج تراثي مع أقمشتها المطرزة وسلال الخوص على ضفاف النيل': { en: 'Manal Awaga in a heritage collage with her embroidered fabrics and palm baskets by the Nile', es: 'Manal Awaga en un collage patrimonial con sus telas bordadas y cestas de palma junto al Nilo' },
    'زينب جمال في كولاج تراثي مع عقودها اليدوية وسلال الخوص على ضفاف النيل': { en: 'Zainab Gamal in a heritage collage with her handmade necklaces and palm baskets by the Nile', es: 'Zainab Gamal en un collage patrimonial con sus collares hechos a mano y cestas de palma junto al Nilo' },
    'زينب جمال تعرض مجموعة من العقود والإكسسوارات اليدوية من صنعها': { en: 'Zainab Gamal showing a collection of her handmade necklaces and accessories', es: 'Zainab Gamal mostrando una colección de collares y accesorios hechos a mano' },
    'منال عوض الله': { en: 'Manal Awaga', es: 'Manal Awaga' },
    'البيت النوبي': { en: 'El Baet Elnoby / Nubian House', es: 'El Baet Elnoby / Casa Nubia' },
    'تعمل منال على تدريب السيدات في المجتمع النوبي والحفاظ على الحرف اليدوية النوبية، من خلال منتجات تعبر عن الهوية والثقافة وتخلق فرصاً جديدة للنساء في أسوان.':
      { en: 'Manal runs handicraft and skills activities, training 50 women in embroidery, leatherwork and hand printing. She works with a core team of 15 women and more in rotation.',
        es: 'Manal dirige actividades de artesanía y formación, capacitando a 50 mujeres en bordado, marroquinería y estampado a mano. Trabaja con un equipo central de 15 mujeres y más en rotación.' },
    'منال عوض الله في البيت النوبي تعرض أقمشة مطرزة أمام جدارية نوبية': { en: 'Manal Awaga at the Nubian House showing embroidered fabrics in front of a Nubian mural', es: 'Manal Awaga en la Casa Nubia mostrando telas bordadas frente a un mural nubio' },

    /* ---- success stories ---- */
    'قصص نجاح': { en: 'Success stories', es: 'Historias de éxito' },
    'قصص النجاح': { en: 'Success stories', es: 'Historias de éxito' },
    'أفكار متجذّرة في الناس والمكان': { en: 'Ideas Rooted in People and Place', es: 'Ideas arraigadas en la gente y el lugar' },
    'اكتشف كيف يحافظ رواد الأعمال المحليون والنساء والشباب على التراث، ويخلقون الفرص، ويضعون صعيد مصر على الخريطة.':
      { en: 'Discover how local entrepreneurs, women and youth are preserving heritage, creating opportunities and putting Upper Egypt on the map.',
        es: 'Descubre cómo los emprendedores locales, las mujeres y los jóvenes preservan el patrimonio, crean oportunidades y ponen al Alto Egipto en el mapa.' },
    'عرض كل القصص': { en: 'View all stories', es: 'Ver todas las historias' },
    'اقرأ القصة كاملة': { en: 'Read full story', es: 'Leer la historia completa' },
    'حرف يدوية وتراث': { en: 'Handicrafts & Heritage', es: 'Artesanía y patrimonio' },
    'روح نوبية': { en: 'Ruh Nubia', es: 'Ruh Nubia' },
    'نحافظ على التراث النوبي حيًا من خلال الحرف اليدوية.': { en: 'Keeping Nubian heritage alive through handmade crafts.', es: 'Mantener vivo el patrimonio nubio a través de la artesanía.' },
    'أكثر من 20 حرفية مدعومة': { en: '20+ women artisans supported', es: 'Más de 20 artesanas apoyadas' },
    'حرف نوبية تقليدية': { en: 'Traditional Nubian crafts', es: 'Artesanía nubia tradicional' },
    'عملاء محليون ودوليون': { en: 'Local & international customers', es: 'Clientes locales e internacionales' },
    'حرفية نوبية تنسج سلة من الخوص أمام النيل في أسوان': { en: 'A Nubian artisan weaving a palm-frond basket by the Nile in Aswan', es: 'Una artesana nubia tejiendo una cesta de hoja de palma junto al Nilo en Asuán' },
    'سياحة وتكنولوجيا': { en: 'Tourism & Technology', es: 'Turismo y tecnología' },
    'تطبيق فسحة تريب': { en: 'Fusha Trip App', es: 'Fusha Trip App' },
    'منصة سفر رقمية تربط الزوار بتجارب محلية أصيلة في أسوان.': { en: 'A digital travel platform connecting visitors with authentic local experiences in Aswan.', es: 'Una plataforma digital de viajes que conecta a los visitantes con experiencias locales auténticas en Asuán.' },
    'تجارب محلية بسهولة': { en: 'Local experiences made easy', es: 'Experiencias locales sin complicaciones' },
    'دعم المرشدين المحليين': { en: 'Supporting local guides', es: 'Apoyo a los guías locales' },
    'نعرض أسوان الحقيقية': { en: 'Showcasing the real Aswan', es: 'Mostrando la Asuán auténtica' },
    'مرشد محلي يعرّف الزوار بمعبد الأقصر عند الغروب': { en: 'A local guide showing visitors Luxor Temple at sunset', es: 'Un guía local mostrando el Templo de Luxor a los visitantes al atardecer' },
    'منتجات إبداعية': { en: 'Creative Products', es: 'Productos creativos' },
    'كورنا': { en: 'Korna', es: 'Korna' },
    'نمزج الإلهام القديم بالتصميم الحديث لنصنع منتجات فريدة صُنعت في الأقصر.': { en: 'Blending ancient inspiration with modern designs to create unique products made in Luxor.', es: 'Combinamos la inspiración antigua con diseños modernos para crear productos únicos hechos en Luxor.' },
    'خلق فرص عمل محلية': { en: 'Creating local jobs', es: 'Creando empleos locales' },
    'مستوحاة من التراث الفرعوني': { en: 'Inspired by Pharaonic heritage', es: 'Inspirado en el patrimonio faraónico' },
    'مستدامة ومصنوعة محليًا': { en: 'Sustainable and locally made', es: 'Sostenible y de fabricación local' },
    'يدا حرفي تزخرفان إناء فخاري بنقوش تقليدية': { en: "An artisan's hands decorating a clay pot with traditional motifs", es: 'Las manos de un artesano decorando una vasija de barro con motivos tradicionales' },

    /* ---- gems: ما وراء المألوف ---- */
    'وجهات وكنوز مخفية': { en: 'Destinations & hidden gems', es: 'Destinos y joyas ocultas' },
    'ما وراء المألوف': { en: 'Beyond the Ordinary', es: 'Más allá de lo habitual' },
    'استكشف أماكن فريدة وتجارب أصيلة وكنوزًا أقل شهرة في الأقصر وأسوان، بعيدًا عن المسارات السياحية المعتادة.':
      { en: 'Explore unique places, authentic experiences and lesser-known gems across Luxor and Aswan, away from the usual tourist spots.',
        es: 'Explora lugares únicos, experiencias auténticas y joyas poco conocidas en Luxor y Asuán, lejos de los circuitos turísticos habituales.' },
    'استكشف كل الوجهات': { en: 'Explore all destinations', es: 'Explora todos los destinos' },
    'عرض التفاصيل': { en: 'View details', es: 'Ver detalles' },
    'الوجهة السابقة': { en: 'Previous destination', es: 'Destino anterior' },
    'الوجهة التالية': { en: 'Next destination', es: 'Siguiente destino' },
    'الوجهات': { en: 'Destinations', es: 'Destinos' },
    'أضف إلى المفضلة': { en: 'Add to favourites', es: 'Añadir a favoritos' },
    'إزالة من المفضلة': { en: 'Remove from favourites', es: 'Quitar de favoritos' },
    'تجارب حرفية': { en: 'Artisan experiences', es: 'Experiencias artesanales' },
    'ورشة الفضة النوبية': { en: 'Nubian Silver Workshop', es: 'Taller de plata nubia' },
    'قابل الحرفيين المحليين في أسوان واصنع خاتمك الفضي الخاص باسمك بالخط النوبي.': { en: 'Meet local artisans in Aswan and create your own personalized silver ring with your name in Nubian script.', es: 'Conoce a los artesanos locales de Asuán y crea tu propio anillo de plata personalizado con tu nombre en escritura nubia.' },
    'ورشة عملية': { en: 'Hands-on workshop', es: 'Taller práctico' },
    'حرفيون محليون': { en: 'Local artisans', es: 'Artesanos locales' },
    'حرفة نوبية أصيلة': { en: 'Authentic Nubian craft', es: 'Artesanía nubia auténtica' },
    'حرفية نوبية تعرض أعمالها اليدوية أمام النيل في أسوان': { en: 'A Nubian artisan presenting her handmade work by the Nile in Aswan', es: 'Una artesana nubia mostrando su trabajo hecho a mano junto al Nilo en Asuán' },
    'حرف محلية وتراث': { en: 'Local crafts & heritage', es: 'Artesanía local y patrimonio' },
    'قرية القرنة للفخار': { en: 'Al Qurna Pottery Village', es: 'Aldea alfarera de Al Qurna' },
    'زر قرية هادئة عند سفح جبال طيبة واكتشف تقنيات الفخار التقليدية المستوحاة من التصميم المصري القديم.': { en: 'Visit a quiet village at the foot of the Theban mountains and discover traditional pottery techniques inspired by ancient Egyptian design.', es: 'Visita una tranquila aldea al pie de las montañas tebanas y descubre técnicas alfareras tradicionales inspiradas en el diseño del antiguo Egipto.' },
    'فخار تقليدي': { en: 'Traditional pottery', es: 'Alfarería tradicional' },
    'إطلالات خلابة': { en: 'Scenic views', es: 'Vistas panorámicas' },
    'دعم المجتمع المحلي': { en: 'Support local community', es: 'Apoyo a la comunidad local' },
    'يدا خزّاف تزخرفان إناءً فخاريًا بنقوش تقليدية': { en: "A potter's hands decorating a clay vessel with traditional motifs", es: 'Las manos de un alfarero decorando una vasija de barro con motivos tradicionales' },
    'طبيعة وحرف يدوية': { en: 'Nature & handicrafts', es: 'Naturaleza y artesanía' },
    'حرف جزيرة إلفنتين': { en: 'Elephantine Island Crafts', es: 'Artesanía de la isla Elefantina' },
    'استكشف الأركان الهادئة في جزيرة إلفنتين وتعلّم حرف الخوص والألياف الطبيعية من الحرفيات المحليات.': { en: 'Explore the peaceful corners of Elephantine Island and learn traditional palm and natural fiber crafts from local women artisans.', es: 'Explora los rincones tranquilos de la isla Elefantina y aprende artesanía tradicional de palma y fibras naturales con las artesanas locales.' },
    'خامات مستدامة': { en: 'Sustainable materials', es: 'Materiales sostenibles' },
    'مبادرة تقودها النساء': { en: 'Women-led initiative', es: 'Iniciativa liderada por mujeres' },
    'أجواء نيلية هادئة': { en: 'Peaceful riverside setting', es: 'Entorno tranquilo junto al río' },
    'سيدة نوبية تنسج سلة من الخوص بين منتجاتها اليدوية': { en: 'A Nubian woman weaving a palm-frond basket among her handmade goods', es: 'Una mujer nubia tejiendo una cesta de hoja de palma entre sus productos artesanales' },

    /* ---- footer ---- */
    'بدعم من': { en: 'Supported by', es: 'Con el apoyo de' },
    'Spanish Agency for International Development Cooperation': { es: 'Agencia Española de Cooperación Internacional para el Desarrollo' },
    'استكشف': { en: 'Explore', es: 'Explorar' },
    'التجارب والمنتجات': { en: 'Experiences & products', es: 'Experiencias y productos' },
    'أفكار السفر': { en: 'Travel ideas', es: 'Ideas de viaje' },
    'رواد الأعمال': { en: 'Entrepreneurs', es: 'Emprendedores' },
    'الخريطة': { en: 'Map', es: 'Mapa' },
    'المنصة': { en: 'Platform', es: 'Plataforma' },
    'للسياح': { en: 'For travellers', es: 'Para viajeros' },
    'للجهات السياحية': { en: 'For tourism bodies', es: 'Para entidades turísticas' },
    'عن المشروع': { en: 'About the project', es: 'Sobre el proyecto' },
    'تابعنا': { en: 'Follow us', es: 'Síguenos' },
    'تذييل الصفحة': { en: 'Footer', es: 'Pie de página' },
    'لينكدإن': { en: 'LinkedIn', es: 'LinkedIn' }, 'يوتيوب': { en: 'YouTube', es: 'YouTube' }, 'فيسبوك': { en: 'Facebook', es: 'Facebook' }, 'إنستغرام': { en: 'Instagram', es: 'Instagram' },

    /* ---- accessibility drawer ---- */
    'إمكانية الوصول': { en: 'Accessibility', es: 'Accesibilidad' },
    'خصص تجربة التصفح بما يناسب احتياجاتك': { en: 'Adjust the site to suit your needs', es: 'Adapta el sitio a tus necesidades' },
    'إغلاق': { en: 'Close', es: 'Cerrar' },
    'المحتوى': { en: 'Content', es: 'Contenido' },
    'تحكم في كيفية عرض المحتوى على الموقع': { en: 'Control how content is displayed', es: 'Controla cómo se muestra el contenido' },
    'إخفاء الصور': { en: 'Hide images', es: 'Ocultar imágenes' },
    'خط سهل القراءة': { en: 'Readable font', es: 'Fuente legible' },
    'تصغير النص': { en: 'Smaller text', es: 'Reducir texto' },
    'تكبير النص': { en: 'Larger text', es: 'Ampliar texto' },
    'الألوان': { en: 'Colours', es: 'Colores' },
    'تخصيص ألوان الموقع لتحسين الرؤية': { en: 'Adjust colours for better visibility', es: 'Ajusta los colores para ver mejor' },
    'السطوع': { en: 'Brightness', es: 'Brillo' },
    'عكس الألوان': { en: 'Invert colours', es: 'Invertir colores' },
    'تدرج رمادي': { en: 'Grayscale', es: 'Escala de grises' },
    'تباين عالٍ': { en: 'High contrast', es: 'Alto contraste' },
    'التنقل': { en: 'Navigation', es: 'Navegación' },
    'تسهيل التصفح والتنقل داخل الموقع': { en: 'Make browsing and navigation easier', es: 'Facilita la navegación por el sitio' },
    'تلميحات': { en: 'Tooltips', es: 'Descripciones' },
    'مؤشر كبير': { en: 'Large cursor', es: 'Cursor grande' },
    'تمييز الروابط': { en: 'Highlight links', es: 'Resaltar enlaces' },
    'دليل القراءة': { en: 'Reading guide', es: 'Guía de lectura' },
    'الحركة والصوت': { en: 'Motion & sound', es: 'Movimiento y sonido' },
    'تقليل المؤثرات الحركية والصوتية': { en: 'Reduce motion and sound effects', es: 'Reduce los efectos de movimiento y sonido' },
    'الإملاء الصوتي': { en: 'Voice dictation', es: 'Dictado por voz' },
    'قراءة النص': { en: 'Read aloud', es: 'Leer en voz alta' },
    'تقليل الحركة': { en: 'Reduce motion', es: 'Reducir movimiento' },
    'إعادة الإعدادات': { en: 'Reset settings', es: 'Restablecer ajustes' },
    'يتم حفظ تفضيلاتك تلقائياً في هذا المتصفح': { en: 'Your preferences are saved automatically in this browser', es: 'Tus preferencias se guardan automáticamente en este navegador' },
    'تمت إعادة الإعدادات': { en: 'Settings reset', es: 'Ajustes restablecidos' },
    'أقصى حجم للنص': { en: 'Maximum text size', es: 'Tamaño máximo de texto' },
    'قراءة النص غير مدعومة في هذا المتصفح': { en: 'Read aloud is not supported in this browser', es: 'La lectura en voz alta no es compatible con este navegador' },
    'الإملاء الصوتي غير مدعوم في هذا المتصفح': { en: 'Voice dictation is not supported in this browser', es: 'El dictado por voz no es compatible con este navegador' },
    'تعذّر الوصول إلى الميكروفون': { en: "Couldn't access the microphone", es: 'No se pudo acceder al micrófono' },
    'الإملاء الصوتي يعمل — تحدث الآن': { en: 'Voice dictation is on — speak now', es: 'Dictado por voz activado — habla ahora' },
    'سمعت: ': { en: 'Heard: ', es: 'Escuché: ' },
  };

  /* Localised event data (mirrors the EVENTS array in index.html) */
  const EVENTS = {
    en: [
      { cat: 'Music', title: 'A Nile evening<br>on the banks of Aswan', desc: 'An enchanting evening of music by the Nile, under the stars.', time: '6:00 PM', loc: 'Aswan', place: ['ASWAN', 'A different kind of peace'] },
      { cat: 'Sport on the Nile', title: 'The annual<br>felucca race', desc: 'Dozens of sailboats race across the Nile in an unforgettable spectacle.', time: '4:30 PM', loc: 'Aswan', place: ['ASWAN', 'Where the Nile sails'] },
      { cat: 'Food', title: 'Upper Egyptian<br>food festival', desc: 'Taste authentic Upper Egyptian dishes made by the mothers and cooks of the villages.', time: '1:00 PM', loc: 'Luxor', place: ['LUXOR', 'Flavours of the south'] },
      { cat: 'Handicrafts', title: 'Handicrafts<br>week', desc: 'Open workshops with artisans: weaving, pottery and palm-frond craft from the heart of the villages.', time: '10:00 AM', loc: 'Aswan', place: ['NUBIA', 'Woven by hand'] },
    ],
    es: [
      { cat: 'Música', title: 'Una noche en el Nilo<br>a orillas de Asuán', desc: 'Una velada musical encantadora junto al Nilo, bajo las estrellas.', time: '18:00', loc: 'Asuán', place: ['ASUÁN', 'Una paz diferente'] },
      { cat: 'Deporte en el Nilo', title: 'La regata anual<br>de falucas', desc: 'Decenas de veleros compiten sobre el Nilo en un espectáculo inolvidable.', time: '16:30', loc: 'Asuán', place: ['ASUÁN', 'Donde navega el Nilo'] },
      { cat: 'Gastronomía', title: 'Festival gastronómico<br>del Alto Egipto', desc: 'Prueba los platos auténticos del Alto Egipto preparados por las madres y cocineras de los pueblos.', time: '13:00', loc: 'Luxor', place: ['LUXOR', 'Sabores del sur'] },
      { cat: 'Artesanía', title: 'Semana de<br>la artesanía', desc: 'Talleres abiertos con artesanos: tejido, cerámica y cestería de palma desde el corazón de los pueblos.', time: '10:00', loc: 'Asuán', place: ['NUBIA', 'Tejido a mano'] },
    ],
  };

  const TITLES = { ar: 'صعيد مصر — تراث حي', en: 'Upper Egypt — Living Heritage', es: 'Alto Egipto — Patrimonio vivo' };
  const SPEECH = { ar: 'ar-EG', en: 'en-GB', es: 'es-ES' };
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const norm = s => String(s).replace(/ـ/g, '').replace(/\s+/g, ' ').trim();
  const textOrig = new WeakMap(), attrOrig = new WeakMap();
  let lang = 'ar';

  const lookup = (src, l) => { if (l === 'ar') return null; const e = D[norm(src)]; return e && e[l] != null ? e[l] : null; };

  function apply(l) {
    lang = ['ar', 'en', 'es'].includes(l) ? l : 'ar';
    const html = document.documentElement;
    html.setAttribute('lang', lang); html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); html.classList.toggle('lang-latin', lang !== 'ar');
    // text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const nodes = []; let n;
    while ((n = walker.nextNode())) { if (n.parentElement && n.parentElement.closest('script,style,#toast,#a11yTip,#news-msg')) continue; nodes.push(n); }
    nodes.forEach(node => {
      if (!textOrig.has(node)) { if (!norm(node.nodeValue)) return; textOrig.set(node, node.nodeValue); }
      const o = textOrig.get(node); const t = lookup(o, lang);
      if (t == null) { node.nodeValue = o; return; }
      node.nodeValue = o.match(/^\s*/)[0] + t + o.match(/\s*$/)[0];
    });
    // attributes
    document.querySelectorAll(ATTRS.map(a => '[' + a + ']').join(',')).forEach(el => {
      let orig = attrOrig.get(el);
      if (!orig) { orig = {}; ATTRS.forEach(a => { if (el.hasAttribute(a)) orig[a] = el.getAttribute(a); }); attrOrig.set(el, orig); }
      for (const a in orig) { const t = lookup(orig[a], lang); el.setAttribute(a, t == null ? orig[a] : t); }
    });
    document.title = TITLES[lang];
    try { localStorage.setItem('se-lang', lang); } catch {}
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  const api = {
    get lang() { return lang; },
    set: apply,
    t: (key) => { const v = lookup(key, lang); return v == null ? key : v; },
    events: () => EVENTS[lang] || null,          // null → use the Arabic source array
    speechLang: () => SPEECH[lang],
    init() { let saved = null; try { saved = localStorage.getItem('se-lang'); } catch {} apply(saved || 'ar'); },
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => api.init()); else api.init();
  return api;
})();
