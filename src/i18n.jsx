import { createContext, useContext } from 'react'

/**
 * Prototype-scope translations. Everything the traveller can see (labels,
 * headings, buttons, placeholders, tags) is keyed here so a single language
 * flip on the Landing screen swaps the whole app.
 *
 * Keys are dotted paths: `landing.title`, `rides.home.headline`, etc. Missing
 * keys fall back to the English string and then to the raw key — a fallback
 * chain that keeps development friendly (a missing translation shows a
 * readable English string rather than silently blanking).
 */

const dict = {
  en: {
    // ---------- Common ----------
    'common.continue': 'Continue',
    'common.confirm': 'Confirm',
    'common.startPrototype': 'Start prototype',
    'common.skip': 'Skip',
    'common.change': 'Change',
    'common.remove': 'Remove',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.done': 'Done',
    'common.or': 'OR',
    'common.new': 'New',
    'common.recommended': 'Recommended',
    'common.comingSoon': 'Coming soon',
    'common.search': 'Search',
    'common.viewMoreDetails': 'View more details',

    // ---------- Landing ----------
    'landing.title': 'Prototype settings',
    'landing.subtitle': "Pick the arm and language you'd like to preview.",
    'landing.appearance': 'Appearance / المظهر',
    'landing.light': 'Light',
    'landing.dark': 'Dark',
    'landing.searchVersion': 'Search version / نسخة البحث',
    'landing.variant1': 'Variant 1',
    'landing.variant1Sub': 'Flight details with date/time picker',
    'landing.variant2': 'Variant 2',
    'landing.variant2Sub': 'Flight details popup after car selection',
    'landing.chooseLanguage': 'Choose your language / اختر لغتك',
    'landing.english': 'English',
    'landing.englishSub': 'Left to right',
    'landing.arabic': 'العربية',
    'landing.arabicSub': 'من اليمين إلى اليسار',
    'landing.taglineEn': 'Rides funnel prototype',
    'landing.taglineAr': 'نموذج تجريبي لتدفق الرحلات',

    // ---------- Home ----------
    'home.signUp': 'Sign up',
    'home.specialDeals': 'Special deals and offers',
    'home.viewAll': 'View all',
    'home.dealCode': 'Code:',
    'home.comingSoon': 'is coming soon',
    'home.copied': 'copied',
    'home.offerDetails': 'offer details coming soon',
    'home.product.flights': 'Flights',
    'home.product.stays': 'Stays',
    'home.product.activities': 'Activities',
    'home.product.rides': 'Rides',
    'home.service.transfers': 'Airport Transfers',
    'home.service.esim': 'eSIM',
    'home.service.packages': 'Packages',
    'home.service.concierge': 'Concierge',
    'home.service.haramain': 'Haramain Train',
    'home.service.private-jet': 'Private Jet',
    'home.service.six-flags': 'Six Flags Qiddiya City',
    'home.service.more': 'See More',
    'home.tab.home': 'Home',
    'home.tab.explore': 'Explore',
    'home.tab.bookings': 'Bookings',
    'home.tab.offers': 'Top offers',
    'home.tab.profile': 'Profile',

    // ---------- Rides — home widget ----------
    'rides.home.title': 'Rides',
    'rides.home.headline': 'Rides for every journey',
    'rides.home.tagline': 'Airport rides • Within City • Hourly',
    'rides.home.bookNow': 'Book a ride now',
    'rides.home.pickupLocation': 'Pickup location',
    'rides.home.destination': 'Destination',
    'rides.home.pickupDateTime': 'Pickup date & time',
    'rides.home.passengers': 'Passengers',
    'rides.home.searchCars': 'Search cars',
    'rides.home.upcoming': 'for your upcoming Bookings',
    'rides.home.bookARide': 'Book a ride',
    'rides.home.tracking': 'Tracking',

    // ---------- Rides — route sheet ----------
    'rides.route.title': 'Plan your route',
    'rides.route.pickupLabel': 'Pickup location',
    'rides.route.destinationLabel': 'Destination',
    'rides.route.hint':
      'Did you not find what you are looking for?\nTry to type more information on the search.',

    // ---------- Rides — date & time sheet ----------
    'rides.dateTime.titleV1': 'Add pickup date & time',
    'rides.dateTime.titleV2': 'Add pickup details',
    'rides.dateTime.pickupDate': 'Pickup date',
    'rides.dateTime.pickupArrivalDate': 'Pickup/Arrival date',
    'rides.dateTime.pickupTime': 'Pickup time',
    'rides.dateTime.setTimeOrFlight': 'Pickup time or flight tracking',
    'rides.dateTime.setTime': 'Set a pickup time',
    'rides.dateTime.setTimeMyself': 'Set a pickup time myself',
    'rides.dateTime.trackFlight': 'Track my flight',
    'rides.dateTime.trackDesc':
      'We track your flight and make sure your driver meets you when you land',
    'rides.dateTime.warningPrefix': 'Your driver arrives at',
    'rides.dateTime.warningSuffix':
      "exactly. If your flight is late we can't hold the car.",
    'rides.dateTime.mustBook': 'Rides must be booked 24 hours in advance',
    'rides.dateTime.viewMore': 'View more details',

    // ---------- Rides — flight prompt ----------
    'rides.flightPrompt.title': 'Add your flight',
    'rides.flightPrompt.benefit1':
      'This helps us find your terminal, suggest pickup time and track your flight.',
    'rides.flightPrompt.benefit2':
      'Your driver waits an hour after you land',
    'rides.flightPrompt.placeholder':
      'Flight number or airline, e.g. SV 202',

    // ---------- Rides — flight search ----------
    'rides.flightSearch.title': 'Add your flight',
    'rides.flightSearch.placeholder':
      'Airline, flight number or city',
    'rides.flightSearch.filterBy': 'Filter by',
    'rides.flightSearch.originAirport': 'Origin airport',
    'rides.flightSearch.flightsTo': 'flights to',
    'rides.flightSearch.flightTo': 'flight to',
    'rides.flightSearch.arrivesOn': 'Arrives on',
    'rides.flightSearch.emptyStart': 'Start typing to search flight or airline',
    'rides.flightSearch.emptyResults': 'No flights match that search.',
    'rides.flightSearch.emptyHint':
      "Try the airline, the flight number, or where you're flying from.",
    'rides.flightSearch.flightWord': 'Flight',
    'rides.flightSearch.timeConnector': 'to',
    // Cities + airlines — English strings match the raw data; the Arabic dict
    // supplies the localised versions and render falls back to the raw string
    // for any name that hasn't been translated yet.
    'rides.city.Dubai': 'Dubai',
    'rides.city.London': 'London',
    'rides.city.Riyadh': 'Riyadh',
    'rides.city.Doha': 'Doha',
    'rides.city.Jeddah': 'Jeddah',
    'rides.airline.Saudia Airlines': 'Saudia Airlines',
    'rides.airline.Emirates': 'Emirates',
    'rides.airline.Qatar Airways': 'Qatar Airways',
    'rides.airline.flydubai': 'flydubai',

    // ---------- Rides — results ----------
    'rides.results.title': 'Available cars',
    'rides.results.filterCarType': 'Car type',
    'rides.results.filterChildSeat': 'Child seat',
    'rides.results.filterLuggage': 'Luggage',
    'rides.results.freeCancellation': 'Free cancellation till',
    'rides.results.meetGreet': 'Meet & Greet',
    'rides.results.childSeatAvailable': 'Child seat available',
    'rides.results.arabicSpeakingDriver': 'Arabic speaking driver',
    'rides.results.priceDropped': 'Price dropped by 10%',
    // Car catalogue — English strings match the raw data; the Arabic dict
    // supplies the localised versions and the render falls back through both.
    'rides.car.economy-sedan.name': 'Economy Sedan',
    'rides.car.economy-sedan.model': 'Toyota Altis or similar',
    'rides.car.economy-sedan.promo': 'Price dropped by 10%',
    'rides.car.luxury-sedan.name': 'Luxury Sedan',
    'rides.car.luxury-sedan.model': 'Tesla model Y or similar',
    'rides.car.luxury-suv.name': 'Luxury SUV',
    'rides.car.luxury-suv.model': 'GMC Yukon XL or similar',

    // ---------- Rides — review ----------
    'rides.review.title': 'Review your booking',
    'rides.review.airportPickup': 'Your airport pick up',
    'rides.review.pickupDateAndTime': 'Pickup date and time',
    'rides.review.from': 'From',
    'rides.review.to': 'To',
    'rides.review.freeCancellationTill': 'Free cancellation till',
    'rides.review.meetGreetIncluded': 'Meet & Greet included',
    'rides.review.childSeatAvailable': 'Child seat available',
    'rides.review.contactDetails': 'Contact details',
    'rides.review.title.Mr': 'Mr',
    'rides.review.title.Ms': 'Ms',
    'rides.review.title.Mrs': 'Mrs',
    'rides.review.titleAria': 'Title',
    'rides.review.firstName': 'First name',
    'rides.review.lastName': 'Last name',
    'rides.review.email': 'Email',
    'rides.review.code': 'Code',
    'rides.review.phone': 'Phone number',
    'rides.review.marketingOptIn': 'Get special deals and travel inspiration',
    'rides.review.howWeUseInfo': 'How we use your details',
    'rides.review.flightNumberTitle': 'Flight number (optional)',
    'rides.review.flightNumberNote':
      'This helps us track your flight in case of delays',
    'rides.review.flightNumberPlaceholder': 'Flight number, e.g. SV 202',
    'rides.review.extras': 'Extras',
    'rides.review.extrasNote': 'Will be provided based on availability',
    'rides.review.childSeatName': 'Child seat',
    'rides.review.childSeatNote': 'Secure rides for children',
    'rides.review.languageName': 'Language preference',
    'rides.review.languageOptional': 'optional',
    'rides.review.languageNote': 'We will try our best to match your preference',
    'rides.review.languageAria': 'Language preference',
    'rides.review.language.No preference': 'No preference',
    'rides.review.language.Arabic': 'Arabic',
    'rides.review.language.English': 'English',
    'rides.review.language.Urdu': 'Urdu',
    'rides.review.language.Hindi': 'Hindi',
    'rides.review.language.Filipino': 'Filipino',
    'rides.review.rewards': 'Rewards you can earn',
    'rides.review.rewardsNote':
      'This booking is eligible for one of the following rewards',
    'rides.review.pointEquals': '1 Point equals',
    'rides.review.aboutReward': 'About',
    'rides.review.selectCar': 'Select',
    'rides.review.passengersA11y': 'passengers',
    'rides.review.bagsA11y': 'bags',
    'rides.review.currency': 'SAR',
    'rides.review.priceBreakdown': 'Price breakdown',
    'rides.review.errFirstName': 'Enter your first name',
    'rides.review.errLastName': 'Enter your last name',
    'rides.review.errEmail': 'Enter a valid email address',
    'rides.review.errPhone': 'Enter a valid phone number',
    'rides.review.continue': 'Continue',

    // ---------- Rides — toasts ----------
    'rides.toast.addRoute': 'Add a pickup location and destination first',
    'rides.toast.addDateTime': 'Add a pickup date and time first',
    'rides.toast.thanks': 'Thanks',
    'rides.toast.thanksSuffix': '— taking you to payment',

    // ---------- Calendar ----------
    'cal.months': 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
    'cal.weekdays': 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    'cal.arrivesOn': 'Arrives on',
  },

  ar: {
    // ---------- Common ----------
    'common.continue': 'متابعة',
    'common.confirm': 'تأكيد',
    'common.startPrototype': 'ابدأ النموذج التجريبي',
    'common.skip': 'تخطّ',
    'common.change': 'تغيير',
    'common.remove': 'إزالة',
    'common.back': 'رجوع',
    'common.close': 'إغلاق',
    'common.done': 'تم',
    'common.or': 'أو',
    'common.new': 'جديد',
    'common.recommended': 'موصى به',
    'common.comingSoon': 'قريبًا',
    'common.search': 'بحث',
    'common.viewMoreDetails': 'عرض المزيد من التفاصيل',

    // ---------- Landing (bilingual labels stay bilingual; body flips) ----------
    'landing.title': 'إعدادات النموذج التجريبي',
    'landing.subtitle': 'اختر النسخة واللغة اللتين تريد معاينتهما.',
    'landing.appearance': 'المظهر / Appearance',
    'landing.light': 'فاتح',
    'landing.dark': 'داكن',
    'landing.searchVersion': 'نسخة البحث / Search version',
    'landing.variant1': 'النسخة الأولى',
    'landing.variant1Sub': 'تفاصيل الرحلة مع منتقي التاريخ والوقت',
    'landing.variant2': 'النسخة الثانية',
    'landing.variant2Sub': 'نافذة تفاصيل الرحلة بعد اختيار السيارة',
    'landing.chooseLanguage': 'اختر لغتك / Choose your language',
    'landing.english': 'English',
    'landing.englishSub': 'Left to right',
    'landing.arabic': 'العربية',
    'landing.arabicSub': 'من اليمين إلى اليسار',
    'landing.taglineEn': 'Rides funnel prototype',
    'landing.taglineAr': 'نموذج تجريبي لتدفق الرحلات',

    // ---------- Home ----------
    'home.signUp': 'إنشاء حساب',
    'home.specialDeals': 'العروض المميزة',
    'home.viewAll': 'عرض الكل',
    'home.dealCode': 'الرمز:',
    'home.comingSoon': 'قريبًا',
    'home.copied': 'تم النسخ',
    'home.offerDetails': 'تفاصيل العرض قريبًا',
    'home.product.flights': 'طيران',
    'home.product.stays': 'فنادق',
    'home.product.activities': 'أنشطة',
    'home.product.rides': 'مواصلات',
    'home.service.transfers': 'مواصلات المطار',
    'home.service.esim': 'شريحة إلكترونية',
    'home.service.packages': 'باقات',
    'home.service.concierge': 'كونسيرج',
    'home.service.haramain': 'قطار الحرمين',
    'home.service.private-jet': 'طائرة خاصة',
    'home.service.six-flags': 'سيكس فلاجز قدية سيتي',
    'home.service.more': 'المزيد',
    'home.tab.home': 'الرئيسية',
    'home.tab.explore': 'استكشف',
    'home.tab.bookings': 'الحجوزات',
    'home.tab.offers': 'أفضل العروض',
    'home.tab.profile': 'الملف الشخصي',

    // ---------- Rides — home widget ----------
    'rides.home.title': 'المواصلات',
    'rides.home.headline': 'مواصلات لكل رحلة',
    'rides.home.tagline': 'مواصلات المطار • داخل المدينة • بالساعة',
    'rides.home.bookNow': 'احجز رحلة الآن',
    'rides.home.pickupLocation': 'موقع الانطلاق',
    'rides.home.destination': 'الوجهة',
    'rides.home.pickupDateTime': 'تاريخ ووقت الانطلاق',
    'rides.home.passengers': 'الركاب',
    'rides.home.searchCars': 'ابحث عن السيارات',
    'rides.home.upcoming': 'لحجوزاتك القادمة',
    'rides.home.bookARide': 'احجز مواصلات',
    'rides.home.tracking': 'يتم تتبع',

    // ---------- Rides — route sheet ----------
    'rides.route.title': 'خطط لطريقك',
    'rides.route.pickupLabel': 'موقع الانطلاق',
    'rides.route.destinationLabel': 'الوجهة',
    'rides.route.hint':
      'لم تجد ما تبحث عنه؟\nحاول كتابة معلومات أكثر في البحث.',

    // ---------- Rides — date & time sheet ----------
    'rides.dateTime.titleV1': 'أضف تاريخ ووقت الانطلاق',
    'rides.dateTime.titleV2': 'أضف تفاصيل الانطلاق',
    'rides.dateTime.pickupDate': 'تاريخ الانطلاق',
    'rides.dateTime.pickupArrivalDate': 'تاريخ الانطلاق / الوصول',
    'rides.dateTime.pickupTime': 'وقت الانطلاق',
    'rides.dateTime.setTimeOrFlight': 'وقت الانطلاق أو تتبع الرحلة',
    'rides.dateTime.setTime': 'حدد وقت الانطلاق',
    'rides.dateTime.setTimeMyself': 'حدد وقت الانطلاق بنفسي',
    'rides.dateTime.trackFlight': 'تتبع رحلتي',
    'rides.dateTime.trackDesc':
      'نتتبع رحلتك ونضمن وصول السائق عند هبوطك',
    'rides.dateTime.warningPrefix': 'سيصل السائق في تمام',
    'rides.dateTime.warningSuffix':
      '. إذا تأخرت رحلتك لا يمكننا الاحتفاظ بالسيارة.',
    'rides.dateTime.mustBook': 'يجب حجز المواصلات قبل 24 ساعة',
    'rides.dateTime.viewMore': 'عرض المزيد من التفاصيل',

    // ---------- Rides — flight prompt ----------
    'rides.flightPrompt.title': 'أضف رحلتك',
    'rides.flightPrompt.benefit1':
      'يساعدنا هذا في تحديد صالة الوصول واقتراح وقت الانطلاق وتتبع رحلتك.',
    'rides.flightPrompt.benefit2':
      'سائقك ينتظرك لمدة ساعة بعد هبوطك',
    'rides.flightPrompt.placeholder':
      'رقم الرحلة أو اسم شركة الطيران، مثال SV 202',

    // ---------- Rides — flight search ----------
    'rides.flightSearch.title': 'أضف رحلتك',
    'rides.flightSearch.placeholder':
      'شركة الطيران أو رقم الرحلة أو المدينة',
    'rides.flightSearch.filterBy': 'تصفية حسب',
    'rides.flightSearch.originAirport': 'مطار المنشأ',
    'rides.flightSearch.flightsTo': 'رحلات إلى',
    'rides.flightSearch.flightTo': 'رحلة إلى',
    'rides.flightSearch.arrivesOn': 'يصل يوم',
    'rides.flightSearch.emptyStart': 'ابدأ الكتابة للبحث عن رحلة أو شركة طيران',
    'rides.flightSearch.emptyResults': 'لا توجد رحلات تطابق البحث.',
    'rides.flightSearch.emptyHint':
      'جرّب اسم شركة الطيران أو رقم الرحلة أو المدينة التي تسافر منها.',
    'rides.flightSearch.flightWord': 'رحلة',
    'rides.flightSearch.timeConnector': 'إلى',
    'rides.city.Dubai': 'دبي',
    'rides.city.London': 'لندن',
    'rides.city.Riyadh': 'الرياض',
    'rides.city.Doha': 'الدوحة',
    'rides.city.Jeddah': 'جدة',
    'rides.airline.Saudia Airlines': 'الخطوط السعودية',
    'rides.airline.Emirates': 'طيران الإمارات',
    'rides.airline.Qatar Airways': 'الخطوط القطرية',
    'rides.airline.flydubai': 'فلاي دبي',

    // ---------- Rides — results ----------
    'rides.results.title': 'السيارات المتاحة',
    'rides.results.filterCarType': 'نوع السيارة',
    'rides.results.filterChildSeat': 'مقعد أطفال',
    'rides.results.filterLuggage': 'الأمتعة',
    'rides.results.freeCancellation': 'إلغاء مجاني حتى',
    'rides.results.meetGreet': 'استقبال وترحيب',
    'rides.results.childSeatAvailable': 'مقعد أطفال متاح',
    'rides.results.arabicSpeakingDriver': 'سائق يتحدث العربية',
    'rides.results.priceDropped': 'انخفض السعر بنسبة ١٠٪',
    'rides.car.economy-sedan.name': 'سيدان اقتصادية',
    'rides.car.economy-sedan.model': 'تويوتا ألتيس أو مماثل',
    'rides.car.economy-sedan.promo': 'انخفض السعر بنسبة ١٠٪',
    'rides.car.luxury-sedan.name': 'سيدان فاخرة',
    'rides.car.luxury-sedan.model': 'تسلا موديل Y أو مماثل',
    'rides.car.luxury-suv.name': 'إس يو في فاخرة',
    'rides.car.luxury-suv.model': 'جي إم سي يوكن XL أو مماثل',

    // ---------- Rides — review ----------
    'rides.review.title': 'راجع حجزك',
    'rides.review.airportPickup': 'انطلاقك من المطار',
    'rides.review.pickupDateAndTime': 'تاريخ ووقت الانطلاق',
    'rides.review.from': 'من',
    'rides.review.to': 'إلى',
    'rides.review.freeCancellationTill': 'إلغاء مجاني حتى',
    'rides.review.meetGreetIncluded': 'استقبال وترحيب مشمول',
    'rides.review.childSeatAvailable': 'مقعد أطفال متاح',
    'rides.review.contactDetails': 'بيانات الاتصال',
    'rides.review.title.Mr': 'السيد',
    'rides.review.title.Ms': 'الآنسة',
    'rides.review.title.Mrs': 'السيدة',
    'rides.review.titleAria': 'اللقب',
    'rides.review.firstName': 'الاسم الأول',
    'rides.review.lastName': 'الاسم الأخير',
    'rides.review.email': 'البريد الإلكتروني',
    'rides.review.code': 'الرمز',
    'rides.review.phone': 'رقم الهاتف',
    'rides.review.marketingOptIn': 'أرسل لي العروض المميزة ووحي السفر',
    'rides.review.howWeUseInfo': 'كيف نستخدم بياناتك',
    'rides.review.flightNumberTitle': 'رقم الرحلة (اختياري)',
    'rides.review.flightNumberNote':
      'يساعدنا هذا في تتبع رحلتك في حال تأخرها',
    'rides.review.flightNumberPlaceholder': 'رقم الرحلة، مثال SV 202',
    'rides.review.extras': 'الإضافات',
    'rides.review.extrasNote': 'ستُقدَّم حسب التوفر',
    'rides.review.childSeatName': 'مقعد أطفال',
    'rides.review.childSeatNote': 'رحلات آمنة للأطفال',
    'rides.review.languageName': 'تفضيل اللغة',
    'rides.review.languageOptional': 'اختياري',
    'rides.review.languageNote': 'سنبذل جهدنا لتلبية تفضيلك',
    'rides.review.languageAria': 'تفضيل اللغة',
    'rides.review.language.No preference': 'لا يوجد تفضيل',
    'rides.review.language.Arabic': 'العربية',
    'rides.review.language.English': 'الإنجليزية',
    'rides.review.language.Urdu': 'الأردية',
    'rides.review.language.Hindi': 'الهندية',
    'rides.review.language.Filipino': 'الفلبينية',
    'rides.review.rewards': 'مكافآت يمكنك كسبها',
    'rides.review.rewardsNote': 'هذا الحجز مؤهل لإحدى المكافآت التالية',
    'rides.review.pointEquals': '١ نقطة تعادل',
    'rides.review.aboutReward': 'حول',
    'rides.review.selectCar': 'اختر',
    'rides.review.passengersA11y': 'ركاب',
    'rides.review.bagsA11y': 'حقائب',
    'rides.review.currency': 'ر.س',
    'rides.review.priceBreakdown': 'تفاصيل السعر',
    'rides.review.errFirstName': 'أدخل اسمك الأول',
    'rides.review.errLastName': 'أدخل اسمك الأخير',
    'rides.review.errEmail': 'أدخل بريدًا إلكترونيًا صحيحًا',
    'rides.review.errPhone': 'أدخل رقم هاتف صحيحًا',
    'rides.review.continue': 'متابعة',

    // ---------- Rides — toasts ----------
    'rides.toast.addRoute': 'أضف موقع الانطلاق والوجهة أولًا',
    'rides.toast.addDateTime': 'أضف تاريخ ووقت الانطلاق أولًا',
    'rides.toast.thanks': 'شكرًا',
    'rides.toast.thanksSuffix': '— جارٍ التوجيه إلى الدفع',

    // ---------- Calendar ----------
    'cal.months':
      'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
    'cal.weekdays': 'أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت',
    'cal.arrivesOn': 'يصل يوم',

    // ---------- Upcoming demo bookings (only Arabic — English falls back
    //             to the raw booking strings on the data object) ----------
    'rides.upcoming.route.Riyadh': 'الرياض',
    'rides.upcoming.route.London': 'لندن',
    'rides.upcoming.flight.line2': '02:30 م – 11:50 م • الخميس 14 مايو',
    'rides.upcoming.flight.line3': 'Flynas • XY 30Z',
    'rides.upcoming.stay.title': 'فندق سوفيتيل لندن',
    'rides.upcoming.stay.line2': 'لندن، المملكة المتحدة',
    'rides.upcoming.stay.line3': '12 مايو – 14 مايو',
  },
}

const LangContext = createContext('en')
const ThemeContext = createContext('light')

export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

/**
 * Reactive theme context. `data-theme` on `<html>` drives the DS token swap,
 * but that lives in the DOM — components that need to branch on theme (e.g.
 * to pick a light vs dark art asset) can't `getComputedStyle` on every
 * render. Publishing the same state through context keeps consumers in
 * sync without a JS read of the DOM.
 */
export function ThemeProvider({ theme, children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

/**
 * `t(key)` — returns the string for the active language, falling back to the
 * English copy and then to the raw key. Missing keys stay visible (rather
 * than blanking), which makes it obvious during development that something
 * hasn't been translated yet.
 */
export function useT() {
  const lang = useContext(LangContext)
  return (key) => dict[lang]?.[key] ?? dict.en[key] ?? key
}

export function useLang() {
  return useContext(LangContext)
}

/**
 * Locale-aware month + weekday tables. Bind them into the data.js formatters
 * to get date strings in the active language:
 *
 *   const { months } = useCalendarLabels()
 *   formatDate(date, months)   // "15 سبتمبر 2026" in AR, "15 Sep 2026" in EN
 */
export function useCalendarLabels() {
  const lang = useContext(LangContext)
  const monthsRaw = dict[lang]?.['cal.months'] ?? dict.en['cal.months']
  const weekdaysRaw = dict[lang]?.['cal.weekdays'] ?? dict.en['cal.weekdays']
  return {
    months: monthsRaw.split(','),
    weekdays: weekdaysRaw.split(','),
    arrivesOn: dict[lang]?.['cal.arrivesOn'] ?? dict.en['cal.arrivesOn'],
  }
}
