/* i18n.service.ts — lightweight internationalisation for PRAYAS (English /
 * Hindi). Ported from engines/i18n.js. Two layers: keyed DICT (data-i18n=) and
 * an English→translation AUTO map applied by a safe, data-preserving runtime
 * pass. A MutationObserver keeps JS-rendered chrome translated. */
import { Injectable } from '@angular/core';

const LANGS = [
    { code: 'en', label: 'English', native: 'English', short: 'EN' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', short: 'हिं' }
  ];

const DICT: any = {
    en: {
      'app.name': 'PRAYAS',
      'app.tagline': 'Data Monitoring Dashboard',
      'app.full': 'PRAYAS Data Monitoring Dashboard',

      'nav.index': 'Overview', 'nav.delay': 'Data Delay', 'nav.department': 'Department Report',
      'nav.anomaly': 'Anomaly Analysis', 'nav.reports': 'Reports Center', 'nav.alerts': 'Alerts Center',
      'sidebar.modules': 'Modules', 'sidebar.onTime': 'On-time submissions',
      'sidebar.onTimeSub': 'Across all monitored schemes',

      'hdr.home': 'Home', 'hdr.refresh': 'Refresh data', 'hdr.theme': 'Toggle theme',
      'hdr.alerts': 'Alerts', 'hdr.menu': 'Menu', 'hdr.language': 'Language',

      'filter.title': 'Filters', 'filter.scope': 'Scope',
      'scope.all': 'All', 'scope.critical': 'Critical', 'scope.pragati': 'Pragati',
      'filter.sector': 'Sector', 'filter.department': 'Department / Ministry', 'filter.state': 'State',
      'filter.district': 'District', 'filter.scheme': 'Scheme', 'filter.kpi': 'KPI',
      'filter.frequency': 'Data Frequency', 'filter.search': 'Search', 'filter.dateRange': 'Date range (From → To)',
      'filter.allSectors': 'All sectors', 'filter.allDepartments': 'All departments', 'filter.allStates': 'All states',
      'filter.allDistricts': 'All districts', 'filter.allSchemes': 'All schemes', 'filter.allKPIs': 'All KPIs',
      'filter.allFrequencies': 'All frequencies', 'filter.searchPlaceholder': 'Search scheme, KPI, project, code…',
      'filter.from': 'From date', 'filter.to': 'To date',
      'ms.selectAll': 'Select all', 'ms.clear': 'Clear', 'ms.searchPlaceholder': 'Search…',
      'btn.reset': 'Reset', 'btn.apply': 'Apply',
      'filter.active': 'Active filters', 'filter.none': 'None — showing all records',
      'filter.readMore': 'Read more', 'filter.showLess': 'Show less', 'filter.clearAll': 'Clear all',
      'filter.applied': '{n} filters applied', 'filter.appliedOne': '1 filter applied', 'filter.noneApplied': 'No filters applied',

      'menu.myProfile': 'My profile', 'menu.preferences': 'Preferences',
      'menu.notifications': 'Notification settings', 'menu.signout': 'Sign out',
      'profile.role': 'Dashboard Administrator',

      'modal.close': 'Close', 'modal.cancel': 'Cancel', 'modal.save': 'Save preferences',
      'modal.myProfile': 'My profile', 'modal.preferences': 'Preferences', 'modal.signout': 'Sign out',
      'modal.signoutMsg': 'Sign out of the PRAYAS monitoring dashboard? Your applied filters will be cleared from this session.',
      'modal.appearance': 'Appearance', 'modal.light': 'Light', 'modal.dark': 'Dark',
      'modal.defaultScope': 'Default scope on load', 'modal.rememberFilters': 'Remember filters between pages',
      'modal.role': 'Role', 'modal.accessScope': 'Access scope', 'modal.department': 'Department',
      'modal.lastSignin': 'Last sign-in', 'modal.session': 'Session',
      'modal.accessAll': 'All ministries & states', 'modal.pmu': 'Programme Monitoring Unit',
      'modal.sessionActive': 'Active · this device', 'modal.editDetails': 'Edit details',

      'toast.applied': 'Filters applied', 'toast.refreshing': 'Refreshing…',
      'toast.signedOut': 'You have been signed out', 'toast.prefsSaved': 'Preferences saved',
      'toast.langChanged': 'Language changed to English',

      'footer.copyright': '© {year} PRAYAS · Government of India · Data Monitoring Dashboard',

      'kpi.schemesMonitored': 'Schemes monitored', 'kpi.criticalSchemes': 'Critical schemes',
      'kpi.delayedSubmissions': 'Delayed submissions', 'kpi.defaulters': 'Defaulters',
      'kpi.outsideGrace': 'Outside grace', 'kpi.acrossFilters': 'Across current filters',

      /* landing page */
      'land.nav.features': 'Features', 'land.nav.benefits': 'Benefits', 'land.nav.how': 'How it works',
      'land.login': 'Sign In', 'land.signin': 'Sign In', 'land.signup': 'Sign Up', 'land.getStarted': 'Get started',
      'land.hero.badge': 'Government of India · Programme Monitoring',
      'land.hero.title': 'Monitor scheme data the moment it slips',
      'land.hero.sub': 'PRAYAS is a centralised data-monitoring dashboard that tracks submission delays, surfaces KPI anomalies, and compares reporting frequencies across ministries, departments, states and districts — all in one colourful, real-time view.',
      'land.hero.cta1': 'Sign in to dashboard', 'land.hero.cta2': 'Create an account',
      'land.hero.stat1': 'Departments / Ministries', 'land.hero.stat2': 'States & UTs',
      'land.hero.stat3': 'Districts', 'land.hero.stat4': 'Standard reports',
      'land.intro.title': 'What is PRAYAS?',
      'land.intro.body': 'PRAYAS gives programme-monitoring teams a single, real-time window into the health of scheme data submissions. Instead of chasing spreadsheets, teams see exactly which schemes are late, which values look abnormal, and where intervention is needed — across every level of government.',
      'land.purpose.title': 'Purpose & benefits',
      'land.purpose.sub': 'Why monitoring teams rely on PRAYAS',
      'land.ben1.title': 'Catch delays early', 'land.ben1.body': 'Grace-period and frequency tracking flag late submissions before they become defaulters.',
      'land.ben2.title': 'Spot data anomalies', 'land.ben2.body': 'Zero, negative, dip and abnormal-spike detection surface suspect values automatically.',
      'land.ben3.title': 'Decide with clarity', 'land.ben3.body': 'Colourful KPIs, charts and rankings turn raw records into decisions at a glance.',
      'land.ben4.title': 'Report in one click', 'land.ben4.body': 'Seventeen ready reports export to Excel, CSV, PDF or print — individually or in bulk.',
      'land.feat.title': 'Key features',
      'land.feat.sub': 'Everything a monitoring user needs',
      'land.f1.title': 'Delay & defaulter dashboard', 'land.f1.body': 'KPIs, frequency analysis, grace tracking and a full detail table for every scheme.',
      'land.f2.title': 'Department-wise reporting', 'land.f2.body': 'Delay rates and average delay rolled up by department, ministry, state and district.',
      'land.f3.title': 'Anomaly analysis', 'land.f3.body': 'Zero, consecutive-zero, negative, cumulative-dip and abnormal-spike detection.',
      'land.f4.title': 'Reports & analytics center', 'land.f4.body': '17 standard reports with multi-select bulk export to Excel and CSV.',
      'land.f5.title': 'Alerts & notifications', 'land.f5.body': 'Severity-ranked, searchable alert stream with acknowledge, snooze and export.',
      'land.f6.title': 'Powerful filtering', 'land.f6.body': 'Multi-select Sector, Department, State, District, Scheme, KPI and free-text search.',
      'land.f7.title': 'Bilingual & responsive', 'land.f7.body': 'English & Hindi throughout, on desktop, tablet and mobile.',
      'land.f8.title': 'Live or sample data', 'land.f8.body': 'Connects to the monitoring API, with a built-in sample dataset for demos.',
      'land.how.title': 'How PRAYAS helps you monitor & analyze',
      'land.how.sub': 'From raw submissions to decisions in four steps',
      'land.s1.title': 'Connect', 'land.s1.body': 'PRAYAS pulls every scheme record from the monitoring API into one dataset.',
      'land.s2.title': 'Filter', 'land.s2.body': 'Narrow to the sectors, departments, states, districts and KPIs that matter.',
      'land.s3.title': 'Detect', 'land.s3.body': 'Delays, defaulters and anomalies are computed and surfaced automatically.',
      'land.s4.title': 'Act', 'land.s4.body': 'Acknowledge alerts, export reports and brief leadership with executive summaries.',
      'land.cta.title': 'Ready to start monitoring?',
      'land.cta.body': 'Sign in to access the live Data Monitoring Dashboard.',
      'land.footer': '© {year} PRAYAS · Government of India · Data Monitoring Dashboard',

      /* login / auth page */
      'login.back': 'Back to home',
      'login.welcome': 'Welcome back',
      'login.sub': 'Sign in to the PRAYAS Data Monitoring Dashboard',
      'login.tabLogin': 'Sign In', 'login.tabSignup': 'Sign Up',
      'login.email': 'Email address', 'login.password': 'Password',
      'login.name': 'Full name', 'login.confirm': 'Confirm password',
      'login.emailPh': 'admin@prayas.gov.in', 'login.passwordPh': 'Enter your password',
      'login.namePh': 'Your full name', 'login.remember': 'Remember me',
      'login.forgot': 'Forgot password?',
      'login.signin': 'Sign in', 'login.signup': 'Create account',
      'login.or': 'or', 'login.noAccount': "Don't have an account?", 'login.haveAccount': 'Already have an account?',
      'login.signupLink': 'Sign Up', 'login.loginLink': 'Sign In',
      'login.demoNote': 'Demo build — any email and password will sign you in.',
      'login.errEmail': 'Please enter a valid email address.',
      'login.errPassword': 'Password must be at least 4 characters.',
      'login.errName': 'Please enter your name.',
      'login.errConfirm': 'Passwords do not match.',
      'login.success': 'Signed in — opening dashboard…'
    },

    hi: {
      'app.name': 'प्रयास',
      'app.tagline': 'डेटा निगरानी डैशबोर्ड',
      'app.full': 'प्रयास डेटा निगरानी डैशबोर्ड',

      'nav.index': 'अवलोकन', 'nav.delay': 'डेटा विलंब', 'nav.department': 'विभाग रिपोर्ट',
      'nav.anomaly': 'विसंगति विश्लेषण', 'nav.reports': 'रिपोर्ट केंद्र', 'nav.alerts': 'अलर्ट केंद्र',
      'sidebar.modules': 'मॉड्यूल', 'sidebar.onTime': 'समय पर प्रविष्टियाँ',
      'sidebar.onTimeSub': 'सभी निगरानी की गई योजनाओं में',

      'hdr.home': 'होम', 'hdr.refresh': 'डेटा ताज़ा करें', 'hdr.theme': 'थीम बदलें',
      'hdr.alerts': 'अलर्ट', 'hdr.menu': 'मेन्यू', 'hdr.language': 'भाषा',

      'filter.title': 'फ़िल्टर', 'filter.scope': 'दायरा',
      'scope.all': 'सभी', 'scope.critical': 'महत्वपूर्ण', 'scope.pragati': 'प्रगति',
      'filter.sector': 'क्षेत्र', 'filter.department': 'विभाग / मंत्रालय', 'filter.state': 'राज्य',
      'filter.district': 'ज़िला', 'filter.scheme': 'योजना', 'filter.kpi': 'केपीआई',
      'filter.frequency': 'डेटा आवृत्ति', 'filter.search': 'खोज', 'filter.dateRange': 'तिथि सीमा (से → तक)',
      'filter.allSectors': 'सभी क्षेत्र', 'filter.allDepartments': 'सभी विभाग', 'filter.allStates': 'सभी राज्य',
      'filter.allDistricts': 'सभी ज़िले', 'filter.allSchemes': 'सभी योजनाएँ', 'filter.allKPIs': 'सभी केपीआई',
      'filter.allFrequencies': 'सभी आवृत्तियाँ', 'filter.searchPlaceholder': 'योजना, केपीआई, परियोजना, कोड खोजें…',
      'filter.from': 'आरंभ तिथि', 'filter.to': 'अंत तिथि',
      'ms.selectAll': 'सभी चुनें', 'ms.clear': 'साफ़ करें', 'ms.searchPlaceholder': 'खोजें…',
      'btn.reset': 'रीसेट', 'btn.apply': 'लागू करें',
      'filter.active': 'सक्रिय फ़िल्टर', 'filter.none': 'कोई नहीं — सभी रिकॉर्ड दिखाए जा रहे हैं',
      'filter.readMore': 'और देखें', 'filter.showLess': 'कम दिखाएँ', 'filter.clearAll': 'सभी हटाएँ',
      'filter.applied': '{n} फ़िल्टर लागू', 'filter.appliedOne': '1 फ़िल्टर लागू', 'filter.noneApplied': 'कोई फ़िल्टर लागू नहीं',

      'menu.myProfile': 'मेरी प्रोफ़ाइल', 'menu.preferences': 'प्राथमिकताएँ',
      'menu.notifications': 'सूचना सेटिंग्स', 'menu.signout': 'साइन आउट',
      'profile.role': 'डैशबोर्ड प्रशासक',

      'modal.close': 'बंद करें', 'modal.cancel': 'रद्द करें', 'modal.save': 'प्राथमिकताएँ सहेजें',
      'modal.myProfile': 'मेरी प्रोफ़ाइल', 'modal.preferences': 'प्राथमिकताएँ', 'modal.signout': 'साइन आउट',
      'modal.signoutMsg': 'प्रयास निगरानी डैशबोर्ड से साइन आउट करें? इस सत्र से आपके लागू किए गए फ़िल्टर हटा दिए जाएँगे।',
      'modal.appearance': 'दिखावट', 'modal.light': 'लाइट', 'modal.dark': 'डार्क',
      'modal.defaultScope': 'लोड पर डिफ़ॉल्ट दायरा', 'modal.rememberFilters': 'पृष्ठों के बीच फ़िल्टर याद रखें',
      'modal.role': 'भूमिका', 'modal.accessScope': 'पहुँच दायरा', 'modal.department': 'विभाग',
      'modal.lastSignin': 'अंतिम साइन-इन', 'modal.session': 'सत्र',
      'modal.accessAll': 'सभी मंत्रालय और राज्य', 'modal.pmu': 'कार्यक्रम निगरानी इकाई',
      'modal.sessionActive': 'सक्रिय · यह डिवाइस', 'modal.editDetails': 'विवरण संपादित करें',

      'toast.applied': 'फ़िल्टर लागू किए गए', 'toast.refreshing': 'ताज़ा किया जा रहा है…',
      'toast.signedOut': 'आप साइन आउट हो गए हैं', 'toast.prefsSaved': 'प्राथमिकताएँ सहेजी गईं',
      'toast.langChanged': 'भाषा हिन्दी में बदली गई',

      'footer.copyright': '© {year} प्रयास · भारत सरकार · डेटा निगरानी डैशबोर्ड',

      'kpi.schemesMonitored': 'निगरानी की गई योजनाएँ', 'kpi.criticalSchemes': 'महत्वपूर्ण योजनाएँ',
      'kpi.delayedSubmissions': 'विलंबित प्रविष्टियाँ', 'kpi.defaulters': 'चूककर्ता',
      'kpi.outsideGrace': 'छूट अवधि से बाहर', 'kpi.acrossFilters': 'वर्तमान फ़िल्टर के अनुसार',

      /* landing page */
      'land.nav.features': 'विशेषताएँ', 'land.nav.benefits': 'लाभ', 'land.nav.how': 'यह कैसे काम करता है',
      'land.login': 'साइन इन', 'land.signin': 'साइन इन', 'land.signup': 'साइन अप', 'land.getStarted': 'शुरू करें',
      'land.hero.badge': 'भारत सरकार · कार्यक्रम निगरानी',
      'land.hero.title': 'योजना डेटा में देरी होते ही उसकी निगरानी करें',
      'land.hero.sub': 'प्रयास एक केंद्रीकृत डेटा निगरानी डैशबोर्ड है जो प्रविष्टि में देरी को ट्रैक करता है, केपीआई विसंगतियों को सामने लाता है, और मंत्रालयों, विभागों, राज्यों एवं ज़िलों में रिपोर्टिंग आवृत्तियों की तुलना करता है — सब एक ही रंगीन, रीयल-टाइम दृश्य में।',
      'land.hero.cta1': 'डैशबोर्ड में साइन इन करें', 'land.hero.cta2': 'खाता बनाएँ',
      'land.hero.stat1': 'विभाग / मंत्रालय', 'land.hero.stat2': 'राज्य और केंद्र शासित प्रदेश',
      'land.hero.stat3': 'ज़िले', 'land.hero.stat4': 'मानक रिपोर्ट',
      'land.intro.title': 'प्रयास क्या है?',
      'land.intro.body': 'प्रयास कार्यक्रम-निगरानी टीमों को योजना डेटा प्रविष्टियों की स्थिति का एक एकल, रीयल-टाइम दृश्य देता है। स्प्रेडशीट का पीछा करने के बजाय, टीमें ठीक-ठीक देख सकती हैं कि कौन-सी योजनाएँ विलंबित हैं, कौन-से मान असामान्य दिखते हैं, और कहाँ हस्तक्षेप आवश्यक है — सरकार के हर स्तर पर।',
      'land.purpose.title': 'उद्देश्य और लाभ',
      'land.purpose.sub': 'निगरानी टीमें प्रयास पर क्यों भरोसा करती हैं',
      'land.ben1.title': 'देरी को जल्दी पकड़ें', 'land.ben1.body': 'छूट-अवधि और आवृत्ति ट्रैकिंग चूककर्ता बनने से पहले विलंबित प्रविष्टियों को चिह्नित करती है।',
      'land.ben2.title': 'डेटा विसंगतियाँ पहचानें', 'land.ben2.body': 'शून्य, ऋणात्मक, गिरावट और असामान्य उछाल का पता स्वतः संदिग्ध मानों को सामने लाता है।',
      'land.ben3.title': 'स्पष्टता से निर्णय लें', 'land.ben3.body': 'रंगीन केपीआई, चार्ट और रैंकिंग कच्चे रिकॉर्ड को एक नज़र में निर्णयों में बदल देते हैं।',
      'land.ben4.title': 'एक क्लिक में रिपोर्ट', 'land.ben4.body': 'सत्रह तैयार रिपोर्ट Excel, CSV, PDF या प्रिंट में निर्यात — अलग-अलग या एक साथ।',
      'land.feat.title': 'मुख्य विशेषताएँ',
      'land.feat.sub': 'एक निगरानी उपयोगकर्ता को जो भी चाहिए',
      'land.f1.title': 'विलंब और चूककर्ता डैशबोर्ड', 'land.f1.body': 'हर योजना के लिए केपीआई, आवृत्ति विश्लेषण, छूट ट्रैकिंग और पूर्ण विवरण तालिका।',
      'land.f2.title': 'विभाग-वार रिपोर्टिंग', 'land.f2.body': 'विभाग, मंत्रालय, राज्य और ज़िले के अनुसार विलंब दर और औसत विलंब।',
      'land.f3.title': 'विसंगति विश्लेषण', 'land.f3.body': 'शून्य, लगातार-शून्य, ऋणात्मक, संचयी-गिरावट और असामान्य-उछाल का पता।',
      'land.f4.title': 'रिपोर्ट और विश्लेषण केंद्र', 'land.f4.body': 'Excel और CSV में मल्टी-सेलेक्ट बल्क निर्यात के साथ 17 मानक रिपोर्ट।',
      'land.f5.title': 'अलर्ट और सूचनाएँ', 'land.f5.body': 'स्वीकार, स्नूज़ और निर्यात के साथ गंभीरता-क्रमित, खोज-योग्य अलर्ट स्ट्रीम।',
      'land.f6.title': 'सशक्त फ़िल्टरिंग', 'land.f6.body': 'मल्टी-सेलेक्ट क्षेत्र, विभाग, राज्य, ज़िला, योजना, केपीआई और मुक्त-पाठ खोज।',
      'land.f7.title': 'द्विभाषी और उत्तरदायी', 'land.f7.body': 'डेस्कटॉप, टैबलेट और मोबाइल पर हर जगह अंग्रेज़ी और हिन्दी।',
      'land.f8.title': 'लाइव या नमूना डेटा', 'land.f8.body': 'निगरानी API से जुड़ता है, डेमो के लिए अंतर्निहित नमूना डेटासेट के साथ।',
      'land.how.title': 'प्रयास आपकी निगरानी और विश्लेषण में कैसे मदद करता है',
      'land.how.sub': 'कच्ची प्रविष्टियों से निर्णय तक चार चरणों में',
      'land.s1.title': 'जोड़ें', 'land.s1.body': 'प्रयास हर योजना रिकॉर्ड को निगरानी API से एक डेटासेट में लाता है।',
      'land.s2.title': 'फ़िल्टर करें', 'land.s2.body': 'महत्वपूर्ण क्षेत्रों, विभागों, राज्यों, ज़िलों और केपीआई तक सीमित करें।',
      'land.s3.title': 'पता लगाएँ', 'land.s3.body': 'विलंब, चूककर्ता और विसंगतियाँ स्वतः गणना कर सामने लाई जाती हैं।',
      'land.s4.title': 'कार्य करें', 'land.s4.body': 'अलर्ट स्वीकार करें, रिपोर्ट निर्यात करें और कार्यकारी सारांश से नेतृत्व को अवगत कराएँ।',
      'land.cta.title': 'निगरानी शुरू करने के लिए तैयार हैं?',
      'land.cta.body': 'लाइव डेटा निगरानी डैशबोर्ड तक पहुँचने के लिए साइन इन करें।',
      'land.footer': '© {year} प्रयास · भारत सरकार · डेटा निगरानी डैशबोर्ड',

      /* login / auth page */
      'login.back': 'होम पर वापस',
      'login.welcome': 'पुनः स्वागत है',
      'login.sub': 'प्रयास डेटा निगरानी डैशबोर्ड में साइन इन करें',
      'login.tabLogin': 'साइन इन', 'login.tabSignup': 'साइन अप',
      'login.email': 'ईमेल पता', 'login.password': 'पासवर्ड',
      'login.name': 'पूरा नाम', 'login.confirm': 'पासवर्ड की पुष्टि करें',
      'login.emailPh': 'admin@prayas.gov.in', 'login.passwordPh': 'अपना पासवर्ड दर्ज करें',
      'login.namePh': 'आपका पूरा नाम', 'login.remember': 'मुझे याद रखें',
      'login.forgot': 'पासवर्ड भूल गए?',
      'login.signin': 'साइन इन', 'login.signup': 'खाता बनाएँ',
      'login.or': 'या', 'login.noAccount': 'खाता नहीं है?', 'login.haveAccount': 'पहले से खाता है?',
      'login.signupLink': 'साइन अप', 'login.loginLink': 'साइन इन',
      'login.demoNote': 'डेमो बिल्ड — कोई भी ईमेल और पासवर्ड आपको साइन इन कर देगा।',
      'login.errEmail': 'कृपया एक मान्य ईमेल पता दर्ज करें।',
      'login.errPassword': 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।',
      'login.errName': 'कृपया अपना नाम दर्ज करें।',
      'login.errConfirm': 'पासवर्ड मेल नहीं खाते।',
      'login.success': 'साइन इन हो गया — डैशबोर्ड खोला जा रहा है…'
    }
  };

const AUTO: any = {
    // page titles + subtitles
    'PRAYAS Data Monitoring Dashboard': { hi: 'प्रयास डेटा निगरानी डैशबोर्ड' },
    'Track scheme data-submission delays, surface KPI anomalies, and compare current frequencies against historical performance — across ministries, departments, states and districts.':
      { hi: 'योजना डेटा-प्रविष्टि में देरी को ट्रैक करें, केपीआई विसंगतियों को सामने लाएँ, और मंत्रालयों, विभागों, राज्यों एवं ज़िलों में वर्तमान आवृत्तियों की ऐतिहासिक प्रदर्शन से तुलना करें।' },
    'Complete dataset': { hi: 'संपूर्ण डेटासेट' },
    'Modules': { hi: 'मॉड्यूल' },
    'Filters apply across every module': { hi: 'फ़िल्टर हर मॉड्यूल पर लागू होते हैं' },

    'Data Delay Dashboard': { hi: 'डेटा विलंब डैशबोर्ड' },
    'Submission delays, grace-period tracking and defaulter analysis.': { hi: 'प्रविष्टि विलंब, छूट-अवधि ट्रैकिंग और चूककर्ता विश्लेषण।' },
    'Clear drilldown': { hi: 'ड्रिलडाउन साफ़ करें' },
    'Delay analysis by frequency': { hi: 'आवृत्ति के अनुसार विलंब विश्लेषण' },
    'Click a bar to filter': { hi: 'फ़िल्टर करने के लिए बार पर क्लिक करें' },
    'Grace period': { hi: 'छूट अवधि' },
    'Frequency distribution': { hi: 'आवृत्ति वितरण' },
    'Click a slice to filter': { hi: 'फ़िल्टर करने के लिए स्लाइस पर क्लिक करें' },
    'Frequency summary': { hi: 'आवृत्ति सारांश' },
    'Detailed delay analysis': { hi: 'विस्तृत विलंब विश्लेषण' },
    'Top performers': { hi: 'शीर्ष प्रदर्शक' },
    'Top defaulters': { hi: 'शीर्ष चूककर्ता' },
    'Top 5 consecutive performers': { hi: 'शीर्ष 5 लगातार प्रदर्शक' },
    'Top 5 consecutive defaulters': { hi: 'शीर्ष 5 लगातार चूककर्ता' },

    'Department Wise Delay Report': { hi: 'विभाग-वार विलंब रिपोर्ट' },
    'Delay rates and average delay across departments and ministries.': { hi: 'विभागों और मंत्रालयों में विलंब दर और औसत विलंब।' },
    'Click a row to focus': { hi: 'फ़ोकस करने के लिए पंक्ति पर क्लिक करें' },
    'Department analysis': { hi: 'विभाग विश्लेषण' },
    'Frequency wise delay': { hi: 'आवृत्ति-वार विलंब' },
    'Grace split': { hi: 'छूट विभाजन' },
    'Scheme grid': { hi: 'योजना ग्रिड' },
    'Detailed schemes': { hi: 'विस्तृत योजनाएँ' },

    'Data Anomaly Analysis': { hi: 'डेटा विसंगति विश्लेषण' },
    'Detect zero, consecutive-zero, negative, cumulative-dip and abnormal-spike patterns within each frequency.':
      { hi: 'प्रत्येक आवृत्ति में शून्य, लगातार-शून्य, ऋणात्मक, संचयी-गिरावट और असामान्य-उछाल पैटर्न का पता लगाएँ।' },
    'Zero value analysis': { hi: 'शून्य मान विश्लेषण' },
    'Consecutive zero analysis': { hi: 'लगातार शून्य विश्लेषण' },
    'Negative value analysis': { hi: 'ऋणात्मक मान विश्लेषण' },
    'Cumulative dip analysis': { hi: 'संचयी गिरावट विश्लेषण' },
    'Abnormal spike analysis': { hi: 'असामान्य उछाल विश्लेषण' },
    'State wise': { hi: 'राज्य-वार' },
    'District wise': { hi: 'ज़िला-वार' },
    'Scheme wise': { hi: 'योजना-वार' },

    'Reports & Analytics Center': { hi: 'रिपोर्ट और विश्लेषण केंद्र' },
    'Reports & Analytics Centre': { hi: 'रिपोर्ट और विश्लेषण केंद्र' },
    'Generate, preview and export 17 standard PRAYAS reports for the current filtered view.':
      { hi: 'वर्तमान फ़िल्टर किए गए दृश्य के लिए 17 मानक प्रयास रिपोर्ट बनाएँ, देखें और निर्यात करें।' },
    'Reports': { hi: 'रिपोर्ट' },
    'Select all': { hi: 'सभी चुनें' },
    'Download all': { hi: 'सभी डाउनलोड करें' },
    'Columns': { hi: 'कॉलम' },

    'Alerts & Notifications Center': { hi: 'अलर्ट और सूचना केंद्र' },
    'Categorized, severity-ranked alerts generated from the current filtered view, plus delivery settings and summary templates.':
      { hi: 'वर्तमान फ़िल्टर किए गए दृश्य से उत्पन्न श्रेणीबद्ध, गंभीरता-क्रमित अलर्ट, साथ ही वितरण सेटिंग्स और सारांश टेम्पलेट।' },
    'Alert stream': { hi: 'अलर्ट स्ट्रीम' },
    'Summary template': { hi: 'सारांश टेम्पलेट' },
    'Channels': { hi: 'चैनल' },
    'Alert frequency': { hi: 'अलर्ट आवृत्ति' },
    'Export': { hi: 'निर्यात' },
    'Acknowledge all': { hi: 'सभी स्वीकारें' },
    'Group': { hi: 'समूह' },
    'Unread only': { hi: 'केवल अपठित' },

    // common KPI / labels generated in JS
    'Total alerts': { hi: 'कुल अलर्ट' }, 'High severity': { hi: 'उच्च गंभीरता' },
    'Medium severity': { hi: 'मध्यम गंभीरता' }, 'Unacknowledged': { hi: 'अस्वीकृत' },
    'Schemes monitored': { hi: 'निगरानी की गई योजनाएँ' }, 'Critical schemes': { hi: 'महत्वपूर्ण योजनाएँ' },
    'Delayed submissions': { hi: 'विलंबित प्रविष्टियाँ' }, 'Defaulters': { hi: 'चूककर्ता' },
    'Outside grace': { hi: 'छूट अवधि से बाहर' }, 'Across current filters': { hi: 'वर्तमान फ़िल्टर के अनुसार' },
    'Total schemes': { hi: 'कुल योजनाएँ' }, 'Delayed': { hi: 'विलंबित' }, 'Critical': { hi: 'महत्वपूर्ण' },
    'Within grace': { hi: 'छूट के भीतर' }, 'On time': { hi: 'समय पर' },
    'Avg delay (days)': { hi: 'औसत विलंब (दिन)' }, 'Frequency missed': { hi: 'छूटी आवृत्ति' }
  };

let reverseAuto: any = null;
function buildReverse() { reverseAuto = AUTO; }

const SAFE_SELECTOR = [
  'h1', 'h2', 'h3', 'h4', '.page-head p', '.section__head .sub', '.kpi__label', '.kpi__foot',
  '.nav-link span', '.filter-pill', '.summary-badge', '.as-toggle', '.setting-label',
  '.module-card h3', '.module-card p', 'button', 'label'
].join(',');

function firstTextNode(el: any): any {
  for (let i = 0; i < el.childNodes.length; i++) {
    const n = el.childNodes[i];
    if (n.nodeType === 3 && n.textContent.trim()) return n;
  }
  return null;
}

@Injectable({ providedIn: 'root' })
export class I18n {
  lang = 'en';
  readonly LANGS = LANGS;
  readonly DICT = DICT;
  readonly AUTO = AUTO;
  private _obs: MutationObserver | null = null;
  private _changeSubs: Array<(lang: string) => void> = [];

  init(): string {
    let l = 'en';
    try { l = localStorage.getItem('prayas.lang') || 'en'; } catch (e) {}
    this.lang = DICT[l] ? l : 'en';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('lang', this.lang);
    if (!reverseAuto) buildReverse();
    return this.lang;
  }

  set(lang: string) {
    if (!DICT[lang]) return;
    this.lang = lang;
    try { localStorage.setItem('prayas.lang', lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    this.refresh(document);
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: lang }));
    this._changeSubs.forEach((f) => { try { f(lang); } catch (e) { console.error(e); } });
  }

  /** subscribe to language changes (Angular-friendly equivalent of the document event) */
  onChange(fn: (lang: string) => void): () => void {
    this._changeSubs.push(fn);
    return () => { this._changeSubs = this._changeSubs.filter((f) => f !== fn); };
  }

  t(key: string, vars?: Record<string, any>): string {
    let s = (DICT[this.lang] && DICT[this.lang][key]);
    if (s == null) s = (DICT['en'][key] != null ? DICT['en'][key] : key);
    if (vars) Object.keys(vars).forEach((k) => { s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
    return s;
  }

  apply(root?: any) {
    root = root || document;
    const q = (sel: string, fn: (el: any) => void) => root.querySelectorAll(sel).forEach(fn);
    q('[data-i18n]', (el) => { el.textContent = this.t(el.getAttribute('data-i18n')); });
    q('[data-i18n-html]', (el) => { el.innerHTML = this.t(el.getAttribute('data-i18n-html')); });
    q('[data-i18n-ph]', (el) => { el.setAttribute('placeholder', this.t(el.getAttribute('data-i18n-ph'))); });
    q('[data-i18n-title]', (el) => {
      const v = this.t(el.getAttribute('data-i18n-title'));
      el.setAttribute('title', v); el.setAttribute('aria-label', v);
    });
    q('[data-i18n-aria]', (el) => { el.setAttribute('aria-label', this.t(el.getAttribute('data-i18n-aria'))); });
  }

  applyAuto(root?: any) {
    root = root || document;
    if (!reverseAuto) buildReverse();
    const scan = (el: any) => {
      if (!el || el.nodeType !== 1) return;
      if (el.hasAttribute && (el.hasAttribute('data-i18n') || el.hasAttribute('data-no-i18n'))) return;
      const node = firstTextNode(el);
      if (!node) return;
      const orig = el.getAttribute('data-i18n-auto') || node.textContent.trim();
      if (!orig) return;
      const entry = reverseAuto[orig];
      if (!entry) return;
      el.setAttribute('data-i18n-auto', orig);
      const pre = (node.textContent.match(/^\s*/) || [''])[0];
      const post = (node.textContent.match(/\s*$/) || [''])[0];
      node.textContent = pre + (this.lang === 'en' ? orig : (entry[this.lang] || orig)) + post;
    };
    root.querySelectorAll(SAFE_SELECTOR).forEach(scan);
    if (root.matches && root.matches(SAFE_SELECTOR)) scan(root);
  }

  refresh(root?: any) { this.apply(root); this.applyAuto(root); }

  observe() {
    if (this._obs || typeof MutationObserver === 'undefined') return;
    this._obs = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n: any) => { if (n.nodeType === 1) this.applyAuto(n); });
      }
    });
    this._obs.observe(document.body, { childList: true, subtree: true });
  }
}
