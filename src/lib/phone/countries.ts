export type PhoneCountry = {
  iso2: string;
  name: string;
  dialCode: string;
};

const RAW_COUNTRIES: PhoneCountry[] = [
  { iso2: "AF", name: "Afeganistão", dialCode: "93" },
  { iso2: "ZA", name: "África do Sul", dialCode: "27" },
  { iso2: "AL", name: "Albânia", dialCode: "355" },
  { iso2: "DE", name: "Alemanha", dialCode: "49" },
  { iso2: "AD", name: "Andorra", dialCode: "376" },
  { iso2: "AO", name: "Angola", dialCode: "244" },
  { iso2: "AI", name: "Anguila", dialCode: "1264" },
  { iso2: "AG", name: "Antígua e Barbuda", dialCode: "1268" },
  { iso2: "SA", name: "Arábia Saudita", dialCode: "966" },
  { iso2: "DZ", name: "Argélia", dialCode: "213" },
  { iso2: "AR", name: "Argentina", dialCode: "54" },
  { iso2: "AM", name: "Armênia", dialCode: "374" },
  { iso2: "AW", name: "Aruba", dialCode: "297" },
  { iso2: "AU", name: "Austrália", dialCode: "61" },
  { iso2: "AT", name: "Áustria", dialCode: "43" },
  { iso2: "AZ", name: "Azerbaijão", dialCode: "994" },
  { iso2: "BS", name: "Bahamas", dialCode: "1242" },
  { iso2: "BH", name: "Bahrein", dialCode: "973" },
  { iso2: "BD", name: "Bangladesh", dialCode: "880" },
  { iso2: "BB", name: "Barbados", dialCode: "1246" },
  { iso2: "BE", name: "Bélgica", dialCode: "32" },
  { iso2: "BZ", name: "Belize", dialCode: "501" },
  { iso2: "BJ", name: "Benin", dialCode: "229" },
  { iso2: "BY", name: "Bielorrússia", dialCode: "375" },
  { iso2: "BO", name: "Bolívia", dialCode: "591" },
  { iso2: "BA", name: "Bósnia e Herzegovina", dialCode: "387" },
  { iso2: "BW", name: "Botsuana", dialCode: "267" },
  { iso2: "BR", name: "Brasil", dialCode: "55" },
  { iso2: "BN", name: "Brunei", dialCode: "673" },
  { iso2: "BG", name: "Bulgária", dialCode: "359" },
  { iso2: "BF", name: "Burkina Faso", dialCode: "226" },
  { iso2: "BI", name: "Burundi", dialCode: "257" },
  { iso2: "BT", name: "Butão", dialCode: "975" },
  { iso2: "CV", name: "Cabo Verde", dialCode: "238" },
  { iso2: "CM", name: "Camarões", dialCode: "237" },
  { iso2: "KH", name: "Camboja", dialCode: "855" },
  { iso2: "CA", name: "Canadá", dialCode: "1" },
  { iso2: "QA", name: "Catar", dialCode: "974" },
  { iso2: "KZ", name: "Cazaquistão", dialCode: "7" },
  { iso2: "TD", name: "Chade", dialCode: "235" },
  { iso2: "CL", name: "Chile", dialCode: "56" },
  { iso2: "CN", name: "China", dialCode: "86" },
  { iso2: "CY", name: "Chipre", dialCode: "357" },
  { iso2: "CO", name: "Colômbia", dialCode: "57" },
  { iso2: "KM", name: "Comores", dialCode: "269" },
  { iso2: "CG", name: "Congo", dialCode: "242" },
  { iso2: "CD", name: "Congo (RDC)", dialCode: "243" },
  { iso2: "KP", name: "Coreia do Norte", dialCode: "850" },
  { iso2: "KR", name: "Coreia do Sul", dialCode: "82" },
  { iso2: "CI", name: "Costa do Marfim", dialCode: "225" },
  { iso2: "CR", name: "Costa Rica", dialCode: "506" },
  { iso2: "HR", name: "Croácia", dialCode: "385" },
  { iso2: "CU", name: "Cuba", dialCode: "53" },
  { iso2: "CW", name: "Curaçao", dialCode: "599" },
  { iso2: "DK", name: "Dinamarca", dialCode: "45" },
  { iso2: "DJ", name: "Djibuti", dialCode: "253" },
  { iso2: "DM", name: "Dominica", dialCode: "1767" },
  { iso2: "EG", name: "Egito", dialCode: "20" },
  { iso2: "SV", name: "El Salvador", dialCode: "503" },
  { iso2: "AE", name: "Emirados Árabes Unidos", dialCode: "971" },
  { iso2: "EC", name: "Equador", dialCode: "593" },
  { iso2: "ER", name: "Eritreia", dialCode: "291" },
  { iso2: "SK", name: "Eslováquia", dialCode: "421" },
  { iso2: "SI", name: "Eslovênia", dialCode: "386" },
  { iso2: "ES", name: "Espanha", dialCode: "34" },
  { iso2: "US", name: "Estados Unidos", dialCode: "1" },
  { iso2: "EE", name: "Estônia", dialCode: "372" },
  { iso2: "SZ", name: "Eswatini", dialCode: "268" },
  { iso2: "ET", name: "Etiópia", dialCode: "251" },
  { iso2: "FJ", name: "Fiji", dialCode: "679" },
  { iso2: "PH", name: "Filipinas", dialCode: "63" },
  { iso2: "FI", name: "Finlândia", dialCode: "358" },
  { iso2: "FR", name: "França", dialCode: "33" },
  { iso2: "GA", name: "Gabão", dialCode: "241" },
  { iso2: "GM", name: "Gâmbia", dialCode: "220" },
  { iso2: "GH", name: "Gana", dialCode: "233" },
  { iso2: "GE", name: "Geórgia", dialCode: "995" },
  { iso2: "GI", name: "Gibraltar", dialCode: "350" },
  { iso2: "GD", name: "Granada", dialCode: "1473" },
  { iso2: "GR", name: "Grécia", dialCode: "30" },
  { iso2: "GL", name: "Groenlândia", dialCode: "299" },
  { iso2: "GP", name: "Guadalupe", dialCode: "590" },
  { iso2: "GU", name: "Guam", dialCode: "1671" },
  { iso2: "GT", name: "Guatemala", dialCode: "502" },
  { iso2: "GG", name: "Guernsey", dialCode: "44" },
  { iso2: "GY", name: "Guiana", dialCode: "592" },
  { iso2: "GF", name: "Guiana Francesa", dialCode: "594" },
  { iso2: "GN", name: "Guiné", dialCode: "224" },
  { iso2: "GW", name: "Guiné-Bissau", dialCode: "245" },
  { iso2: "GQ", name: "Guiné Equatorial", dialCode: "240" },
  { iso2: "HT", name: "Haiti", dialCode: "509" },
  { iso2: "HN", name: "Honduras", dialCode: "504" },
  { iso2: "HK", name: "Hong Kong", dialCode: "852" },
  { iso2: "HU", name: "Hungria", dialCode: "36" },
  { iso2: "YE", name: "Iêmen", dialCode: "967" },
  { iso2: "IN", name: "Índia", dialCode: "91" },
  { iso2: "ID", name: "Indonésia", dialCode: "62" },
  { iso2: "IQ", name: "Iraque", dialCode: "964" },
  { iso2: "IR", name: "Irã", dialCode: "98" },
  { iso2: "IE", name: "Irlanda", dialCode: "353" },
  { iso2: "IS", name: "Islândia", dialCode: "354" },
  { iso2: "IL", name: "Israel", dialCode: "972" },
  { iso2: "IT", name: "Itália", dialCode: "39" },
  { iso2: "JM", name: "Jamaica", dialCode: "1876" },
  { iso2: "JP", name: "Japão", dialCode: "81" },
  { iso2: "JE", name: "Jersey", dialCode: "44" },
  { iso2: "JO", name: "Jordânia", dialCode: "962" },
  { iso2: "XK", name: "Kosovo", dialCode: "383" },
  { iso2: "KW", name: "Kuwait", dialCode: "965" },
  { iso2: "LA", name: "Laos", dialCode: "856" },
  { iso2: "LS", name: "Lesoto", dialCode: "266" },
  { iso2: "LV", name: "Letônia", dialCode: "371" },
  { iso2: "LB", name: "Líbano", dialCode: "961" },
  { iso2: "LR", name: "Libéria", dialCode: "231" },
  { iso2: "LY", name: "Líbia", dialCode: "218" },
  { iso2: "LI", name: "Liechtenstein", dialCode: "423" },
  { iso2: "LT", name: "Lituânia", dialCode: "370" },
  { iso2: "LU", name: "Luxemburgo", dialCode: "352" },
  { iso2: "MO", name: "Macau", dialCode: "853" },
  { iso2: "MK", name: "Macedônia do Norte", dialCode: "389" },
  { iso2: "MG", name: "Madagascar", dialCode: "261" },
  { iso2: "MY", name: "Malásia", dialCode: "60" },
  { iso2: "MW", name: "Malawi", dialCode: "265" },
  { iso2: "MV", name: "Maldivas", dialCode: "960" },
  { iso2: "ML", name: "Mali", dialCode: "223" },
  { iso2: "MT", name: "Malta", dialCode: "356" },
  { iso2: "MA", name: "Marrocos", dialCode: "212" },
  { iso2: "MQ", name: "Martinica", dialCode: "596" },
  { iso2: "MU", name: "Maurício", dialCode: "230" },
  { iso2: "MR", name: "Mauritânia", dialCode: "222" },
  { iso2: "MX", name: "México", dialCode: "52" },
  { iso2: "MM", name: "Mianmar", dialCode: "95" },
  { iso2: "FM", name: "Micronésia", dialCode: "691" },
  { iso2: "MZ", name: "Moçambique", dialCode: "258" },
  { iso2: "MD", name: "Moldávia", dialCode: "373" },
  { iso2: "MC", name: "Mônaco", dialCode: "377" },
  { iso2: "MN", name: "Mongólia", dialCode: "976" },
  { iso2: "ME", name: "Montenegro", dialCode: "382" },
  { iso2: "MS", name: "Montserrat", dialCode: "1664" },
  { iso2: "NA", name: "Namíbia", dialCode: "264" },
  { iso2: "NR", name: "Nauru", dialCode: "674" },
  { iso2: "NP", name: "Nepal", dialCode: "977" },
  { iso2: "NI", name: "Nicarágua", dialCode: "505" },
  { iso2: "NE", name: "Níger", dialCode: "227" },
  { iso2: "NG", name: "Nigéria", dialCode: "234" },
  { iso2: "NU", name: "Niue", dialCode: "683" },
  { iso2: "NO", name: "Noruega", dialCode: "47" },
  { iso2: "NC", name: "Nova Caledônia", dialCode: "687" },
  { iso2: "NZ", name: "Nova Zelândia", dialCode: "64" },
  { iso2: "OM", name: "Omã", dialCode: "968" },
  { iso2: "NL", name: "Países Baixos", dialCode: "31" },
  { iso2: "PW", name: "Palau", dialCode: "680" },
  { iso2: "PS", name: "Palestina", dialCode: "970" },
  { iso2: "PA", name: "Panamá", dialCode: "507" },
  { iso2: "PG", name: "Papua-Nova Guiné", dialCode: "675" },
  { iso2: "PK", name: "Paquistão", dialCode: "92" },
  { iso2: "PY", name: "Paraguai", dialCode: "595" },
  { iso2: "PE", name: "Peru", dialCode: "51" },
  { iso2: "PF", name: "Polinésia Francesa", dialCode: "689" },
  { iso2: "PL", name: "Polônia", dialCode: "48" },
  { iso2: "PR", name: "Porto Rico", dialCode: "1787" },
  { iso2: "PT", name: "Portugal", dialCode: "351" },
  { iso2: "KE", name: "Quênia", dialCode: "254" },
  { iso2: "KG", name: "Quirguistão", dialCode: "996" },
  { iso2: "KI", name: "Quiribati", dialCode: "686" },
  { iso2: "GB", name: "Reino Unido", dialCode: "44" },
  { iso2: "CF", name: "República Centro-Africana", dialCode: "236" },
  { iso2: "DO", name: "República Dominicana", dialCode: "1809" },
  { iso2: "CZ", name: "República Tcheca", dialCode: "420" },
  { iso2: "RE", name: "Reunião", dialCode: "262" },
  { iso2: "RO", name: "Romênia", dialCode: "40" },
  { iso2: "RW", name: "Ruanda", dialCode: "250" },
  { iso2: "RU", name: "Rússia", dialCode: "7" },
  { iso2: "WS", name: "Samoa", dialCode: "685" },
  { iso2: "SM", name: "San Marino", dialCode: "378" },
  { iso2: "LC", name: "Santa Lúcia", dialCode: "1758" },
  { iso2: "KN", name: "São Cristóvão e Névis", dialCode: "1869" },
  { iso2: "ST", name: "São Tomé e Príncipe", dialCode: "239" },
  { iso2: "VC", name: "São Vicente e Granadinas", dialCode: "1784" },
  { iso2: "SN", name: "Senegal", dialCode: "221" },
  { iso2: "SL", name: "Serra Leoa", dialCode: "232" },
  { iso2: "RS", name: "Sérvia", dialCode: "381" },
  { iso2: "SC", name: "Seychelles", dialCode: "248" },
  { iso2: "SG", name: "Singapura", dialCode: "65" },
  { iso2: "SX", name: "Sint Maarten", dialCode: "1721" },
  { iso2: "SY", name: "Síria", dialCode: "963" },
  { iso2: "SO", name: "Somália", dialCode: "252" },
  { iso2: "LK", name: "Sri Lanka", dialCode: "94" },
  { iso2: "SD", name: "Sudão", dialCode: "249" },
  { iso2: "SS", name: "Sudão do Sul", dialCode: "211" },
  { iso2: "SE", name: "Suécia", dialCode: "46" },
  { iso2: "CH", name: "Suíça", dialCode: "41" },
  { iso2: "SR", name: "Suriname", dialCode: "597" },
  { iso2: "TH", name: "Tailândia", dialCode: "66" },
  { iso2: "TW", name: "Taiwan", dialCode: "886" },
  { iso2: "TJ", name: "Tajiquistão", dialCode: "992" },
  { iso2: "TZ", name: "Tanzânia", dialCode: "255" },
  { iso2: "TL", name: "Timor-Leste", dialCode: "670" },
  { iso2: "TG", name: "Togo", dialCode: "228" },
  { iso2: "TO", name: "Tonga", dialCode: "676" },
  { iso2: "TT", name: "Trinidad e Tobago", dialCode: "1868" },
  { iso2: "TN", name: "Tunísia", dialCode: "216" },
  { iso2: "TM", name: "Turcomenistão", dialCode: "993" },
  { iso2: "TR", name: "Turquia", dialCode: "90" },
  { iso2: "TV", name: "Tuvalu", dialCode: "688" },
  { iso2: "UA", name: "Ucrânia", dialCode: "380" },
  { iso2: "UG", name: "Uganda", dialCode: "256" },
  { iso2: "UY", name: "Uruguai", dialCode: "598" },
  { iso2: "UZ", name: "Uzbequistão", dialCode: "998" },
  { iso2: "VU", name: "Vanuatu", dialCode: "678" },
  { iso2: "VA", name: "Vaticano", dialCode: "39" },
  { iso2: "VE", name: "Venezuela", dialCode: "58" },
  { iso2: "VN", name: "Vietnã", dialCode: "84" },
  { iso2: "ZM", name: "Zâmbia", dialCode: "260" },
  { iso2: "ZW", name: "Zimbábue", dialCode: "263" },
];

const brazil = RAW_COUNTRIES.find((c) => c.iso2 === "BR")!;
const others = RAW_COUNTRIES.filter((c) => c.iso2 !== "BR").sort((a, b) =>
  a.name.localeCompare(b.name, "pt-BR")
);

export const PHONE_COUNTRIES: PhoneCountry[] = [brazil, ...others];

const DIAL_CODES_BY_LENGTH = [...RAW_COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length
);

const byIso2 = new Map(RAW_COUNTRIES.map((c) => [c.iso2, c]));

export function isoToFlag(iso2: string): string {
  return [...iso2.toUpperCase()].map((char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  ).join("");
}

export function getCountryByIso2(iso2: string): PhoneCountry | undefined {
  return byIso2.get(iso2.toUpperCase());
}

export function getCountryByDialCode(dialCode: string): PhoneCountry | undefined {
  if (dialCode === "1") return getCountryByIso2("US");
  return RAW_COUNTRIES.find((c) => c.dialCode === dialCode);
}

export function detectCountryFromStored(
  digits: string
): { country: PhoneCountry; national: string } | null {
  const clean = digits.replace(/\D/g, "");
  if (!clean) return null;

  const brazil = getCountryByIso2("BR");
  if (!brazil) return null;

  if (clean.startsWith("55") && clean.length >= 12) {
    return { country: brazil, national: clean.slice(2) };
  }

  if (clean.length === 11 && clean.startsWith("55")) {
    return { country: brazil, national: clean };
  }

  for (const country of DIAL_CODES_BY_LENGTH) {
    if (country.iso2 === "BR") continue;
    if (!clean.startsWith(country.dialCode)) continue;

    const national = clean.slice(country.dialCode.length);
    if (national.length < 4) continue;

    if (country.dialCode.length > 1 && clean.length <= 11) continue;

    if (country.dialCode === "1") {
      const us = getCountryByIso2("US");
      if (us) return { country: us, national };
    }

    return { country, national };
  }

  if (clean.length === 10 || clean.length === 11) {
    return { country: brazil, national: clean };
  }

  return null;
}

export function filterCountries(query: string): PhoneCountry[] {
  const q = query.trim().toLowerCase();
  if (!q) return PHONE_COUNTRIES;

  const digits = q.replace(/\D/g, "");
  return PHONE_COUNTRIES.filter((country) => {
    if (country.name.toLowerCase().includes(q)) return true;
    if (digits && country.dialCode.startsWith(digits)) return true;
    if (q.startsWith("+") && country.dialCode.startsWith(q.slice(1))) return true;
    return false;
  });
}

export const DEFAULT_COUNTRY = brazil;
