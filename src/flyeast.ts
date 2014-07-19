// copyright 2014 Reece Elliott
module FlyEast {
    interface Location {
        lat: number;
        lon: number;
    }

    interface Place {
        country: string;
        city: string;
        lat: number;
        lon: number;
        rank: number;
        weight ? : number;
    }

    interface XY {
        x: number;
        y: number;
    }

    class Itinerary {
        home: Place = null;
        distance: number = 0;
        visited: number = 0;
        from: Place = null;
        destinationList: Place[] = [null, null];
        winDestination: number = 0; // index into destinationList
        bonus: number = 0;
    }

    var mapCanvas = null;
    var mapCtx = null;
    var mapWidth: number = 0;
    var mapHeight: number = 0;
    var mapImg = null;
    var mapViewElement = null;
    var mapViewCtx = null;
    var mapDotRadius = 4;
    var mapLineWidth = 1;
    var LOSE_BONUS_RATIO = 0.5;

    enum GameState {
        NewGame, Normal, Lose, Win
    };

    var gameState: GameState = GameState.NewGame;

    var itinerary = new Itinerary();

    var cityList: Place[] = [{
        country: "Afghanistan",
        city: "Kabul",
        lat: 34.28,
        lon: 69.11,
        rank: 1
    }, {
        country: "Albania",
        city: "Tirane",
        lat: 41.18,
        lon: 19.49,
        rank: 2
    }, {
        country: "Algeria",
        city: "Algiers",
        lat: 36.42,
        lon: 3.08,
        rank: 1
    }, {
        country: "American Samoa",
        city: "Pago Pago",
        lat: -14.16,
        lon: -170.43,
        rank: 3
    }, {
        country: "Andorra",
        city: "Andorra la Vella",
        lat: 42.31,
        lon: 1.32,
        rank: 3
    }, {
        country: "Angola",
        city: "Luanda",
        lat: -8.50,
        lon: 13.15,
        rank: 3
    }, {
        country: "Antigua and Barbuda",
        city: "Saint John's",
        lat: 17.7,
        lon: -61.51,
        rank: 3
    }, {
        country: "Argentina",
        city: "Buenos Aires",
        lat: -36.30,
        lon: -60.00,
        rank: 1
    }, {
        country: "Armenia",
        city: "Yerevan",
        lat: 40.10,
        lon: 44.31,
        rank: 3
    }, {
        country: "Aruba",
        city: "Oranjestad",
        lat: 12.32,
        lon: -70.02,
        rank: 3
    }, {
        country: "Australia",
        city: "Canberra",
        lat: -35.15,
        lon: 149.08,
        rank: 1
    }, {
        country: "Austria",
        city: "Vienna",
        lat: 48.12,
        lon: 16.22,
        rank: 1
    }, {
        country: "Azerbaijan",
        city: "Baku",
        lat: 40.29,
        lon: 49.56,
        rank: 3
    }, {
        country: "Bahamas",
        city: "Nassau",
        lat: 25.05,
        lon: -77.20,
        rank: 2
    }, {
        country: "Bahrain",
        city: "Manama",
        lat: 26.10,
        lon: 50.30,
        rank: 3
    }, {
        country: "Bangladesh",
        city: "Dhaka",
        lat: 23.43,
        lon: 90.26,
        rank: 2
    }, {
        country: "Barbados",
        city: "Bridgetown",
        lat: 13.05,
        lon: -59.30,
        rank: 3
    }, {
        country: "Belarus",
        city: "Minsk",
        lat: 53.52,
        lon: 27.30,
        rank: 2
    }, {
        country: "Belgium",
        city: "Brussels",
        lat: 50.51,
        lon: 4.21,
        rank: 1
    }, {
        country: "Belize",
        city: "Belmopan",
        lat: 17.18,
        lon: -88.30,
        rank: 3
    }, {
        country: "Benin",
        city: "Porto-Novo",
        lat: 6.23,
        lon: 2.42,
        rank: 3
    }, {
        country: "Bhutan",
        city: "Thimphu",
        lat: 27.31,
        lon: 89.45,
        rank: 3
    }, {
        country: "Bolivia",
        city: "La Paz",
        lat: -16.20,
        lon: -68.10,
        rank: 3
    }, {
        country: "Bosnia and Herzegovina",
        city: "Sarajevo",
        lat: 43.52,
        lon: 18.26,
        rank: 2
    }, {
        country: "Botswana",
        city: "Gaborone",
        lat: -24.45,
        lon: 25.57,
        rank: 3
    }, {
        country: "Brazil",
        city: "Brasilia",
        lat: -15.47,
        lon: -47.52,
        rank: 2
    }, {
        country: "British Virgin Islands",
        city: "Road Town",
        lat: 18.27,
        lon: -64.37,
        rank: 3
    }, {
        country: "Brunei Darussalam",
        city: "Bandar Seri Begawan",
        lat: 4.52,
        lon: 115.00,
        rank: 3
    }, {
        country: "Bulgaria",
        city: "Sofia",
        lat: 42.45,
        lon: 23.20,
        rank: 1
    }, {
        country: "Burkina Faso",
        city: "Ouagadougou",
        lat: 12.15,
        lon: -1.30,
        rank: 3
    }, {
        country: "Burundi",
        city: "Bujumbura",
        lat: -3.16,
        lon: 29.18,
        rank: 2
    }, {
        country: "Cambodia",
        city: "Phnom Penh",
        lat: 11.33,
        lon: 104.55,
        rank: 1
    }, {
        country: "Cameroon",
        city: "Yaounde",
        lat: 3.50,
        lon: 11.35,
        rank: 2
    }, {
        country: "Canada",
        city: "Ottawa",
        lat: 45.27,
        lon: -75.42,
        rank: 1
    }, {
        country: "Cape Verde",
        city: "Praia",
        lat: 15.02,
        lon: -23.34,
        rank: 3
    }, {
        country: "Cayman Islands",
        city: "George Town",
        lat: 19.20,
        lon: -81.24,
        rank: 2
    }, {
        country: "Central African Republic",
        city: "Bangui",
        lat: 4.23,
        lon: 18.35,
        rank: 3
    }, {
        country: "Chad",
        city: "N'Djamena",
        lat: 12.10,
        lon: 14.59,
        rank: 3
    }, {
        country: "Chile",
        city: "Santiago",
        lat: -33.24,
        lon: -70.40,
        rank: 1
    }, {
        country: "China",
        city: "Beijing",
        lat: 39.55,
        lon: 116.20,
        rank: 1
    }, {
        country: "Colombia",
        city: "Bogota",
        lat: 4.34,
        lon: -74.00,
        rank: 1
    }, {
        country: "Comros",
        city: "Moroni",
        lat: -11.40,
        lon: 43.16,
        rank: 3
    }, {
        country: "Congo",
        city: "Brazzaville",
        lat: -4.09,
        lon: 15.12,
        rank: 2
    }, {
        country: "Costa Rica",
        city: "San Jose",
        lat: 9.55,
        lon: -84.02,
        rank: 1
    }, {
        country: "Cote d'Ivoire",
        city: "Yamoussoukro",
        lat: 6.49,
        lon: -5.17,
        rank: 3
    }, {
        country: "Croatia",
        city: "Zagreb",
        lat: 45.50,
        lon: 15.58,
        rank: 1
    }, {
        country: "Cuba",
        city: "Havana",
        lat: 23.08,
        lon: -82.22,
        rank: 1
    }, {
        country: "Cyprus",
        city: "Nicosia",
        lat: 35.10,
        lon: 33.25,
        rank: 2
    }, {
        country: "Czech Republic",
        city: "Prague",
        lat: 50.05,
        lon: 14.22,
        rank: 1
    }, {
        country: "North Korea",
        city: "P'yongyang",
        lat: 39.09,
        lon: 125.30,
        rank: 1
    }, {
        country: "Congo",
        city: "Kinshasa",
        lat: -4.20,
        lon: 15.15,
        rank: 2
    }, {
        country: "Denmark",
        city: "Copenhagen",
        lat: 55.41,
        lon: 12.34,
        rank: 1
    }, {
        country: "Djibouti",
        city: "Djibouti",
        lat: 11.08,
        lon: 42.20,
        rank: 3
    }, {
        country: "Dominica",
        city: "Roseau",
        lat: 15.20,
        lon: -61.24,
        rank: 3
    }, {
        country: "Dominica Republic",
        city: "Santo Domingo",
        lat: 18.30,
        lon: -69.59,
        rank: 2
    }, {
        country: "East Timor",
        city: "Dili",
        lat: -8.29,
        lon: 125.34,
        rank: 2
    }, {
        country: "Ecuador",
        city: "Quito",
        lat: -0.15,
        lon: -78.35,
        rank: 1
    }, {
        country: "Egypt",
        city: "Cairo",
        lat: 30.01,
        lon: 31.14,
        rank: 1
    }, {
        country: "El Salvador",
        city: "San Salvador",
        lat: 13.40,
        lon: -89.10,
        rank: 1
    }, {
        country: "Equatorial Guinea",
        city: "Malabo",
        lat: 3.45,
        lon: 8.50,
        rank: 2
    }, {
        country: "Eritrea",
        city: "Asmara",
        lat: 15.19,
        lon: 38.55,
        rank: 2
    }, {
        country: "Estonia",
        city: "Tallinn",
        lat: 59.22,
        lon: 24.48,
        rank: 2
    }, {
        country: "Ethiopia",
        city: "Addis Ababa",
        lat: 9.02,
        lon: 38.42,
        rank: 2
    }, {
        country: "Falkland Islands",
        city: "Stanley",
        lat: -51.40,
        lon: -59.51,
        rank: 2
    }, {
        country: "Faroe Islands",
        city: "Torshavn",
        lat: 62.05,
        lon: -6.56,
        rank: 3
    }, {
        country: "Fiji",
        city: "Suva",
        lat: -18.06,
        lon: 178.30,
        rank: 3
    }, {
        country: "Finland",
        city: "Helsinki",
        lat: 60.15,
        lon: 25.03,
        rank: 1
    }, {
        country: "France",
        city: "Paris",
        lat: 48.50,
        lon: 2.20,
        rank: 1
    }, {
        country: "French Guiana",
        city: "Cayenne",
        lat: 5.05,
        lon: -52.18,
        rank: 3
    }, {
        country: "French Polynesia",
        city: "Papeete",
        lat: -17.32,
        lon: -149.34,
        rank: 3
    }, {
        country: "Gabon",
        city: "Libreville",
        lat: 0.25,
        lon: 9.26,
        rank: 3
    }, {
        country: "Gambia",
        city: "Banjul",
        lat: 13.28,
        lon: -16.40,
        rank: 3
    }, {
        country: "Georgia",
        city: "T'bilisi",
        lat: 41.43,
        lon: 44.50,
        rank: 2
    }, {
        country: "Macao",
        city: "Macau",
        lat: 22.12,
        lon: 113.33,
        rank: 3
    }, {
        country: "Republic of Moldova",
        city: "Chisinau",
        lat: 47.02,
        lon: 28.50,
        rank: 3
    }, {
        country: "Germany",
        city: "Berlin",
        lat: 52.30,
        lon: 13.25,
        rank: 1
    }, {
        country: "Ghana",
        city: "Accra",
        lat: 5.35,
        lon: -0.06,
        rank: 3
    }, {
        country: "Greece",
        city: "Athens",
        lat: 37.58,
        lon: 23.46,
        rank: 1
    }, {
        country: "Greenland",
        city: "Nuuk",
        lat: 64.10,
        lon: -51.35,
        rank: 2
    }, {
        country: "Guadeloupe",
        city: "Basse-Terre",
        lat: 16.00,
        lon: -61.44,
        rank: 3
    }, {
        country: "Guatemala",
        city: "Guatemala",
        lat: 14.40,
        lon: -90.22,
        rank: 1
    }, {
        country: "Guernsey",
        city: "St. Peter Port",
        lat: 49.26,
        lon: -2.33,
        rank: 2
    }, {
        country: "Guinea",
        city: "Conakry",
        lat: 9.29,
        lon: -13.49,
        rank: 3
    }, {
        country: "Guinea-Bissau",
        city: "Bissau",
        lat: 11.45,
        lon: -15.45,
        rank: 3
    }, {
        country: "Guyana",
        city: "Georgetown",
        lat: 6.50,
        lon: -58.12,
        rank: 3
    }, {
        country: "Haiti",
        city: "Port-au-Prince",
        lat: 18.40,
        lon: -72.20,
        rank: 1
    }, {
        country: "Honduras",
        city: "Tegucigalpa",
        lat: 14.05,
        lon: -87.14,
        rank: 1
    }, {
        country: "Hungary",
        city: "Budapest",
        lat: 47.29,
        lon: 19.05,
        rank: 1
    }, {
        country: "Iceland",
        city: "Reykjavik",
        lat: 64.10,
        lon: -21.57,
        rank: 1
    }, {
        country: "India",
        city: "New Delhi",
        lat: 28.37,
        lon: 77.13,
        rank: 1
    }, {
        country: "Indonesia",
        city: "Jakarta",
        lat: -6.09,
        lon: 106.49,
        rank: 1
    }, {
        country: "Iran",
        city: "Tehran",
        lat: 35.44,
        lon: 51.30,
        rank: 1
    }, {
        country: "Iraq",
        city: "Baghdad",
        lat: 33.20,
        lon: 44.30,
        rank: 1
    }, {
        country: "Ireland",
        city: "Dublin",
        lat: 53.21,
        lon: -6.15,
        rank: 1
    }, {
        country: "Israel",
        city: "Jerusalem",
        lat: 31.47,
        lon: 35.12,
        rank: 1
    }, {
        country: "Italy",
        city: "Rome",
        lat: 41.54,
        lon: 12.29,
        rank: 1
    }, {
        country: "Japan",
        city: "Tokyo",
        lat: 35.41,
        lon: 139.41,
        rank: 1
    }, {
        country: "Jamaica",
        city: "Kingston",
        lat: 18.00,
        lon: -76.50,
        rank: 1
    }, {
        country: "Jordan",
        city: "Amman",
        lat: 31.57,
        lon: 35.52,
        rank: 2
    }, {
        country: "Kazakhstan",
        city: "Astana",
        lat: 51.10,
        lon: 71.30,
        rank: 2
    }, {
        country: "Kenya",
        city: "Nairobi",
        lat: -1.17,
        lon: 36.48,
        rank: 1
    }, {
        country: "Kiribati",
        city: "Tarawa",
        lat: 1.30,
        lon: 173.00,
        rank: 2
    }, {
        country: "Kuwait",
        city: "Kuwait",
        lat: 29.30,
        lon: 48.00,
        rank: 2
    }, {
        country: "Kyrgyzstan",
        city: "Bishkek",
        lat: 42.54,
        lon: 74.46,
        rank: 3
    }, {
        country: "Laos",
        city: "Vientiane",
        lat: 17.58,
        lon: 102.36,
        rank: 1
    }, {
        country: "Latvia",
        city: "Riga",
        lat: 56.53,
        lon: 24.08,
        rank: 2
    }, {
        country: "Lebanon",
        city: "Beirut",
        lat: 33.53,
        lon: 35.31,
        rank: 1
    }, {
        country: "Lesotho",
        city: "Maseru",
        lat: -29.18,
        lon: 27.30,
        rank: 3
    }, {
        country: "Liberia",
        city: "Monrovia",
        lat: 6.18,
        lon: -10.47,
        rank: 2
    }, {
        country: "Libya",
        city: "Tripoli",
        lat: 32.54,
        lon: 13.11,
        rank: 2
    }, {
        country: "Liechtenstein",
        city: "Vaduz",
        lat: 47.08,
        lon: 9.31,
        rank: 2
    }, {
        country: "Lithuania",
        city: "Vilnius",
        lat: 54.38,
        lon: 25.19,
        rank: 2
    }, {
        country: "Luxembourg",
        city: "Luxembourg",
        lat: 49.37,
        lon: 6.09,
        rank: 1
    }, {
        country: "Madagascar",
        city: "Antananarivo",
        lat: -18.55,
        lon: 47.31,
        rank: 2
    }, {
        country: "Malawi",
        city: "Lilongwe",
        lat: -14.00,
        lon: 33.48,
        rank: 3
    }, {
        country: "Malaysia",
        city: "Kuala Lumpur",
        lat: 3.09,
        lon: 101.41,
        rank: 1
    }, {
        country: "Maldives",
        city: "Male",
        lat: 4.00,
        lon: 73.28,
        rank: 2
    }, {
        country: "Mali",
        city: "Bamako",
        lat: 12.34,
        lon: -7.55,
        rank: 3
    }, {
        country: "Malta",
        city: "Valletta",
        lat: 35.54,
        lon: 14.31,
        rank: 2
    }, {
        country: "Martinique",
        city: "Fort-de-France",
        lat: 14.36,
        lon: -61.02,
        rank: 3
    }, {
        country: "Mauritania",
        city: "Nouakchott",
        lat: -20.10,
        lon: 57.30,
        rank: 3
    }, {
        country: "Mayotte",
        city: "Mamoudzou",
        lat: -12.48,
        lon: 45.14,
        rank: 3
    }, {
        country: "Mexico",
        city: "Mexico",
        lat: 19.20,
        lon: -99.10,
        rank: 1
    }, {
        country: "Fed. States of Micronesia",
        city: "Palikir",
        lat: 6.55,
        lon: 158.09,
        rank: 3
    }, {
        country: "Mozambique",
        city: "Maputo",
        lat: -25.58,
        lon: 32.32,
        rank: 2
    }, {
        country: "Myanmar",
        city: "Yangon",
        lat: 16.45,
        lon: 96.20,
        rank: 3
    }, {
        country: "Namibia",
        city: "Windhoek",
        lat: -22.35,
        lon: 17.04,
        rank: 2
    }, {
        country: "Nepal",
        city: "Kathmandu",
        lat: 27.45,
        lon: 85.20,
        rank: 1
    }, {
        country: "Netherlands Antilles",
        city: "Willemstad",
        lat: 12.05,
        lon: -69.00,
        rank: 3
    }, {
        country: "Netherlands",
        city: "Amsterdam",
        lat: 52.23,
        lon: 4.54,
        rank: 1
    }, {
        country: "New Caledonia",
        city: "Noumea",
        lat: -22.17,
        lon: 166.30,
        rank: 2
    }, {
        country: "New Zealand",
        city: "Wellington",
        lat: -41.19,
        lon: 174.46,
        rank: 1
    }, {
        country: "Nicaragua",
        city: "Managua",
        lat: 12.06,
        lon: -86.20,
        rank: 2
    }, {
        country: "Niger",
        city: "Niamey",
        lat: 13.27,
        lon: 2.06,
        rank: 2
    }, {
        country: "Nigeria",
        city: "Abuja",
        lat: 9.05,
        lon: 7.32,
        rank: 2
    }, {
        country: "Norfolk Island",
        city: "Kingston",
        lat: -45.20,
        lon: 168.43,
        rank: 3
    }, {
        country: "Northern Mariana Islands",
        city: "Saipan",
        lat: 15.12,
        lon: 145.45,
        rank: 3
    }, {
        country: "Norway",
        city: "Oslo",
        lat: 59.55,
        lon: 10.45,
        rank: 1
    }, {
        country: "Oman",
        city: "Masqat",
        lat: 23.37,
        lon: 58.36,
        rank: 2
    }, {
        country: "Pakistan",
        city: "Islamabad",
        lat: 33.40,
        lon: 73.10,
        rank: 1
    }, {
        country: "Palau",
        city: "Koror",
        lat: 7.20,
        lon: 134.28,
        rank: 3
    }, {
        country: "Panama",
        city: "Panama",
        lat: 9.00,
        lon: -79.25,
        rank: 1
    }, {
        country: "Papua New Guinea",
        city: "Port Moresby",
        lat: -9.24,
        lon: 147.08,
        rank: 1
    }, {
        country: "Paraguay",
        city: "Asuncion",
        lat: -25.10,
        lon: -57.30,
        rank: 1
    }, {
        country: "Peru",
        city: "Lima",
        lat: -12.00,
        lon: -77.00,
        rank: 1
    }, {
        country: "Philippines",
        city: "Manila",
        lat: 14.40,
        lon: 121.03,
        rank: 1
    }, {
        country: "Poland",
        city: "Warsaw",
        lat: 52.13,
        lon: 21.00,
        rank: 1
    }, {
        country: "Portugal",
        city: "Lisbon",
        lat: 38.42,
        lon: -9.10,
        rank: 1
    }, {
        country: "Puerto Rico",
        city: "San Juan",
        lat: 18.28,
        lon: -66.07,
        rank: 2
    }, {
        country: "Qatar",
        city: "Doha",
        lat: 25.15,
        lon: 51.35,
        rank: 2
    }, {
        country: "Rawanda",
        city: "Kigali",
        lat: -1.59,
        lon: 30.04,
        rank: 2
    }, {
        country: "Republic of Korea",
        city: "Seoul",
        lat: 37.31,
        lon: 126.58,
        rank: 1
    }, {
        country: "Romania",
        city: "Bucuresti",
        lat: 44.27,
        lon: 26.10,
        rank: 1
    }, {
        country: "Russian Federation",
        city: "Moskva",
        lat: 55.45,
        lon: 37.35,
        rank: 1
    }, {
        country: "Saint Kitts and Nevis",
        city: "Basseterre",
        lat: 17.17,
        lon: -62.43,
        rank: 3
    }, {
        country: "Saint Lucia",
        city: "Castries",
        lat: 14.02,
        lon: -60.58,
        rank: 3
    }, {
        country: "Saint Pierre and Miquelon",
        city: "Saint-Pierre",
        lat: 46.46,
        lon: -56.12,
        rank: 3
    }, {
        country: "Saint Vincent ...",
        city: "Kingstown",
        lat: 13.10,
        lon: -61.10,
        rank: 3
    }, {
        country: "Samoa",
        city: "Apia",
        lat: -13.50,
        lon: -171.50,
        rank: 3
    }, {
        country: "San Marino",
        city: "San Marino",
        lat: 43.55,
        lon: 12.30,
        rank: 2
    }, {
        country: "Sao Tome and Principe",
        city: "Sao Tome",
        lat: 0.10,
        lon: 6.39,
        rank: 3
    }, {
        country: "Saudi Arabia",
        city: "Riyadh",
        lat: 24.41,
        lon: 46.42,
        rank: 1
    }, {
        country: "Senegal",
        city: "Dakar",
        lat: 14.34,
        lon: -17.29,
        rank: 2
    }, {
        country: "Sierra Leone",
        city: "Freetown",
        lat: 8.30,
        lon: -13.17,
        rank: 2
    }, {
        country: "Slovakia",
        city: "Bratislava",
        lat: 48.10,
        lon: 17.07,
        rank: 2
    }, {
        country: "Slovenia",
        city: "Ljubljana",
        lat: 46.04,
        lon: 14.33,
        rank: 2
    }, {
        country: "Solomon Islands",
        city: "Honiara",
        lat: -9.27,
        lon: 159.57,
        rank: 3
    }, {
        country: "Somalia",
        city: "Mogadishu",
        lat: 2.02,
        lon: 45.25,
        rank: 2
    }, {
        country: "South Africa",
        city: "Pretoria",
        lat: -25.44,
        lon: 28.12,
        rank: 1
    }, {
        country: "Spain",
        city: "Madrid",
        lat: 40.25,
        lon: -3.45,
        rank: 1
    }, {
        country: "Sudan",
        city: "Khartoum",
        lat: 15.31,
        lon: 32.35,
        rank: 1
    }, {
        country: "Suriname",
        city: "Paramaribo",
        lat: 5.50,
        lon: -55.10,
        rank: 2
    }, {
        country: "Swaziland",
        city: "Mbabane",
        lat: -26.18,
        lon: 31.06,
        rank: 2
    }, {
        country: "Sweden",
        city: "Stockholm",
        lat: 59.20,
        lon: 18.03,
        rank: 1
    }, {
        country: "Switzerland",
        city: "Bern",
        lat: 46.57,
        lon: 7.28,
        rank: 1
    }, {
        country: "Syrian Arab Republic",
        city: "Damascus",
        lat: 33.30,
        lon: 36.18,
        rank: 2
    }, {
        country: "Tajikistan",
        city: "Dushanbe",
        lat: 38.33,
        lon: 68.48,
        rank: 2
    }, {
        country: "Thailand",
        city: "Bangkok",
        lat: 13.45,
        lon: 100.35,
        rank: 1
    }, {
        country: "Republic of Macedonia",
        city: "Skopje",
        lat: 42.01,
        lon: 21.26,
        rank: 2
    }, {
        country: "Togo",
        city: "Lome",
        lat: 6.09,
        lon: 1.20,
        rank: 3
    }, {
        country: "Tonga",
        city: "Nuku'alofa",
        lat: -21.10,
        lon: -174.00,
        rank: 3
    }, {
        country: "Tunisia",
        city: "Tunis",
        lat: 36.50,
        lon: 10.11,
        rank: 1
    }, {
        country: "Turkey",
        city: "Ankara",
        lat: 39.57,
        lon: 32.54,
        rank: 1
    }, {
        country: "Turkmenistan",
        city: "Ashgabat",
        lat: 38.00,
        lon: 57.50,
        rank: 2
    }, {
        country: "Tuvalu",
        city: "Funafuti",
        lat: -8.31,
        lon: 179.13,
        rank: 3
    }, {
        country: "Uganda",
        city: "Kampala",
        lat: 0.20,
        lon: 32.30,
        rank: 1
    }, {
        country: "Ukraine",
        city: "Kiev",
        lat: 50.30,
        lon: 30.28,
        rank: 1
    }, {
        country: "United Arab Emirates",
        city: "Abu Dhabi",
        lat: 24.28,
        lon: 54.22,
        rank: 1
    }, {
        country: "United Kingdom",
        city: "London",
        lat: 51.36,
        lon: -0.05,
        rank: 1
    }, {
        country: "Tanzania",
        city: "Dodoma",
        lat: -6.08,
        lon: 35.45,
        rank: 2
    }, {
        country: "USA",
        city: "Washington DC",
        lat: 39.91,
        lon: -77.02,
        rank: 1
    }, {
        country: "Virgin Islands",
        city: "Charlotte Amalie",
        lat: 18.21,
        lon: -64.56,
        rank: 3
    }, {
        country: "Uruguay",
        city: "Montevideo",
        lat: -34.50,
        lon: -56.11,
        rank: 1
    }, {
        country: "Uzbekistan",
        city: "Tashkent",
        lat: 41.20,
        lon: 69.10,
        rank: 2
    }, {
        country: "Vanuatu",
        city: "Port-Vila",
        lat: -17.45,
        lon: 168.18,
        rank: 3
    }, {
        country: "Venezuela",
        city: "Caracas",
        lat: 10.30,
        lon: -66.55,
        rank: 1
    }, {
        country: "Viet Nam",
        city: "Hanoi",
        lat: 21.05,
        lon: 105.55,
        rank: 1
    }, {
        country: "Yugoslavia",
        city: "Belgrade",
        lat: 44.50,
        lon: 20.37,
        rank: 1
    }, {
        country: "Zambia",
        city: "Lusaka",
        lat: -15.28,
        lon: 28.16,
        rank: 2
    }, {
        country: "Zimbabwe",
        city: "Harare",
        lat: -17.43,
        lon: 31.02,
        rank: 1
    }, ];


    var freeCityList = [];

    function patchLatLonForCity(loc: Location) {
        var latNum: number = 0;
        var lonNum: number = 0;

        if (loc.lat > 0) {
            latNum = Math.floor(loc.lat);
        } else {
            latNum = Math.ceil(loc.lat);
        }
        if (loc.lon > 0) {
            lonNum = Math.floor(loc.lon);
        } else {
            lonNum = Math.ceil(loc.lon);
        }

        loc.lat = (latNum + (loc.lat - latNum) / 0.6);
        loc.lon = (lonNum + (loc.lon - lonNum) / 0.6);
    }

    function patchLatLon() {
        for (var i: number = cityList.length - 1; i >= 0; i--) {
            patchLatLonForCity(cityList[i]);
        }

        cityList.sort(function(a: Place, b: Place) {
            return a.lon - b.lon;
        });
    }

    function removeCityFromList(city: Place, cityList: Place[]) {
        var index: number = cityList.indexOf(city);
        if (index == -1)
            alert("city not in list");

        cityList.splice(index, 1);
    }

    function latLonToXY(lat: number, lon: number): XY {
        return {
            x: mapWidth * (lon / 360 + 0.5),
            y: mapHeight * (0.5 - lat / 180)
        };
    }

    // return the lat direction from A to B
    function diffLon(lonA: number, lonB: number): number {
        var diff: number = lonB - lonA;
        if (diff < -180)
            return 360 + diff; // +ve
        if (diff > 180)
            return diff - 360; // -ve
        return diff;
    }

    function calculateLatLonDistance(from: Place, to: Place): number {
        var R = 6371; // km
        var fromLat = from.lat / 180 * Math.PI;
        var fromLon = from.lon / 180 * Math.PI;
        var toLat = to.lat / 180 * Math.PI;
        var toLon = to.lon / 180 * Math.PI;
        var deltaLat = (toLat - fromLat) * 0.5;
        var deltaLon = (toLon - fromLon) * 0.5;
        var sinDeltaLon = Math.sin(deltaLon);
        var sinDeltaLat = Math.sin(deltaLat);
        var a = sinDeltaLat * sinDeltaLat + Math.cos(fromLat) * Math.cos(toLat) * sinDeltaLon * sinDeltaLon;
        var b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        return Math.round(R * b);
    }

    function drawRoute(from: Place, to: Place, col: string) {
        var fromXY: XY = latLonToXY(from.lat, from.lon);
        var toXY: XY = latLonToXY(to.lat, to.lon);

        mapCtx.strokeStyle = col;
        mapCtx.lineWidth = mapLineWidth;
        mapCtx.beginPath();
        mapCtx.moveTo(fromXY.x, fromXY.y);

        if (to.lon > from.lon) {
            mapCtx.lineTo(toXY.x, toXY.y);
        } else {
            // wrap
            mapCtx.lineTo(toXY.x + mapWidth, toXY.y);
            mapCtx.moveTo(fromXY.x - mapWidth, fromXY.y);
            mapCtx.lineTo(toXY.x, toXY.y);
        }
        mapCtx.stroke();
    }

    function selectDestinationInternal(index) {
        var destination: Place = itinerary.destinationList[index];

        // overwrite old city circle - so we don't get confused
        if (itinerary.from != itinerary.home) {
            drawCityCircle(itinerary.from, mapDotRadius, "#f04000");
        }

        if (index != itinerary.winDestination) {
            gameState = GameState.Lose;
            drawRoute(destination, itinerary.from, "white"); // draw from west to east
        } else {
            itinerary.distance += calculateLatLonDistance(itinerary.from, destination);
            itinerary.visited++;
            drawRoute(itinerary.from, destination, "#f04000");
            itinerary.from = destination;
            removeCityFromList(destination, freeCityList);
            drawCityCircle(destination, mapDotRadius, "white");

            if (freeCityList.length == 0) {
                gameState = GameState.Win;
            } else {
                pickTwoDestinations(itinerary.from);
            }
        }
    }

    function selectDestination() {
        var index: number = this.getAttribute("data-index");
        var destination: Place = itinerary.destinationList[index];

        selectDestinationInternal(index);
        itinerary.bonus = Math.floor(itinerary.visited * LOSE_BONUS_RATIO);

        centerMapOnCity(destination);
        updateHTML();
    }

    function setupHTML() {
        var destinationElements = document.getElementsByClassName("destination");
        for (var i = destinationElements.length - 1; i >= 0; i--) {
            destinationElements[i].addEventListener("click", selectDestination);
        }

        document.getElementById("win").addEventListener("click", restartGame);
        document.getElementById("lose").addEventListener("click", restartGame);
        document.getElementById("help").addEventListener("click", resumeGame);
    }

    function updateHTML() {
        var FADED: string = "0.4";
        document.getElementById("home").innerHTML = itinerary.home.city + " (" + itinerary.home.country + ")";
        document.getElementById("distance").innerHTML = itinerary.distance.toString() + " km";
        document.getElementById("visited").innerHTML = itinerary.visited.toString();
        document.getElementById("from").innerHTML = itinerary.from.city + " (" + itinerary.from.country + ")";
        document.getElementById("bonus").innerHTML = itinerary.bonus.toString();

        for (var i = 0; i < itinerary.destinationList.length; i++) {
            var destination: Place = itinerary.destinationList[i];
            var destinationStr: string = ""
            if (destination != null) {
                destinationStr = itinerary.destinationList[i].city +
                    "<br />(<span class=\"countryFont\">" +
                    itinerary.destinationList[i].country +
                    "</span>)"
            }

            var destinationElem = document.getElementById("destination" + (i + 1));
            destinationElem.innerHTML = destinationStr;
        }

        var helpDisplay: string = "none";
        var winDisplay: string = "none";
        var loseDisplay: string = "none";
        var destination1Opacity: string = FADED;
        var destination2Opacity: string = FADED;

        switch (gameState) {
            case GameState.NewGame:
                helpDisplay = "block";
                break;

            case GameState.Normal:
                destination1Opacity = "1.0";
                destination2Opacity = "1.0";
                break;

            case GameState.Win:
                winDisplay = "block";
                break;

            case GameState.Lose:
                loseDisplay = "block";
                break;
        }


        document.getElementById("destination1").style.opacity = destination1Opacity;
        document.getElementById("destination2").style.opacity = destination2Opacity;
        document.getElementById("help").style.display = helpDisplay;
        document.getElementById("win").style.display = winDisplay;
        document.getElementById("lose").style.display = loseDisplay;
    }

    function centerMapOnCity(city: Place) {
        var pos: XY = latLonToXY(city.lat, city.lon);

        var scale: number = mapViewElement.height / mapHeight;
        var offset: number = mapViewElement.width * 0.5 - pos.x * scale;
        mapViewCtx.drawImage(mapCanvas, offset, 0, mapWidth * scale, mapHeight * scale);
        mapViewCtx.drawImage(mapCanvas, offset - mapWidth * scale, 0, mapWidth * scale, mapHeight * scale);
        mapViewCtx.drawImage(mapCanvas, offset + mapWidth * scale, 0, mapWidth * scale, mapHeight * scale);
    }

    function drawCityCircle(city: Place, r: number, col: string) {
        var pos: XY = latLonToXY(city.lat, city.lon);

        mapCtx.strokeStyle = "#000000";
        mapCtx.fillStyle = col;
        mapCtx.lineWidth = 2;
        mapCtx.beginPath();
        mapCtx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
        mapCtx.stroke();
        mapCtx.fill()
    }

    function selectCity(cityName: string, cityList: Place[]): Place {
        for (var i: number = cityList.length - 1; i >= 0; i--) {
            if (cityList[i].city == cityName)
                return cityList[i];
        }

        return null;
    }

    function selectRandomCity(cityList: Place[]): Place {
        return cityList[Math.floor(Math.random() * cityList.length)];
    }

    function getBestCities(city: Place, distanceFunc: (other: Place) => any): Place[] {
        var RANK_WEIGHT: number = 50;
        var WEIGHT_WINDOW: number = 40;
        var MAX_CHOICES: number = 5;

        // weighted by distance and rank
        for (var i = freeCityList.length - 1; i >= 0; i--) {
            var other: Place = freeCityList[i];
            if (other == city) {
                other.weight = 10000;
            } else {
                var distance = distanceFunc(other);
                if (distance < 0) {
                    distance += 360;
                }
                other.weight = other.rank * RANK_WEIGHT + distance;
            }
        }

        var bestCityList: Place[] = freeCityList.sort(function(a, b) {
            return a.weight - b.weight; // ascending
        });

        // filter out cities that are outside the window, and limit the total number of choices
        var maxWeight: number = bestCityList[0].weight + WEIGHT_WINDOW * bestCityList[0].rank;
        bestCityList = bestCityList.filter(function(elem, index) {
            return index < MAX_CHOICES && elem.weight < maxWeight;
        });

        return bestCityList;
    }

    function pickTwoDestinations(city: Place) {
        var MIN_LON: number = 10;

        // we offset by MIN_LON, so we don't pick cities next to us
        var eastCityList: Place[] = getBestCities(city, function(other) {
            return diffLon(city.lon, (other.lon - MIN_LON));
        });

        var westCityList: Place[] = getBestCities(city, function(other) {
            return -diffLon(city.lon, (other.lon + MIN_LON));
        });

        if (eastCityList.length == 0) {
            alert("need a better algorithm for pickTwoDestinations()");
            gameState = GameState.Lose;
            return;
        }

        // chose random slot for east and west
        var destIndex = Math.random() > 0.5 ? 1 : 0;
        itinerary.destinationList[destIndex] = selectRandomCity(eastCityList);
        itinerary.destinationList[1 - destIndex] = selectRandomCity(westCityList);
        itinerary.winDestination = destIndex; // city to the east
    }

    function setup() {
        patchLatLon();
        setupHTML();
    }

    function baseGame() {
        freeCityList.length = 0;
        for (var i: number = 0; i < cityList.length; i++) {
            freeCityList.push(cityList[i]);
        }

        // itinerary.home = selectCity("Pago Pago", freeCityList);
        itinerary.home = selectRandomCity(freeCityList);
        itinerary.from = itinerary.home;
        itinerary.visited = 0;
        itinerary.distance = 0;

        removeCityFromList(itinerary.from, freeCityList);

        mapCtx.drawImage(mapImg, 0, 0, mapWidth, mapHeight);
        drawCityCircle(itinerary.home, mapDotRadius, "yellow");
    }

    function newGame() {
        baseGame();
        itinerary.bonus = 0;

        pickTwoDestinations(itinerary.home);

        centerMapOnCity(itinerary.from);

        gameState = GameState.NewGame;
        updateHTML();
    }

    function restartGame() {
        baseGame();

        // start with some bonus stops
        for (var i: number = 0; i < itinerary.bonus; ++i) {
            pickTwoDestinations(itinerary.from);
            selectDestinationInternal(itinerary.winDestination);
        }

        pickTwoDestinations(itinerary.from);
        centerMapOnCity(itinerary.from);

        gameState = GameState.Normal;
        updateHTML();
    }

    function resumeGame() {
        gameState = GameState.Normal;
        updateHTML();
    }


    window.onload = function() {
        setup();

        mapCanvas = document.createElement("canvas");
        mapCtx = mapCanvas.getContext("2d");

        mapViewElement = document.getElementById("mapView");
        mapViewCtx = mapViewElement.getContext("2d");

        mapImg = new Image();
        mapImg.onload = function() {
            mapWidth = mapImg.width;
            mapHeight = mapImg.height;
            mapCanvas.width = mapWidth;
            mapCanvas.height = mapHeight;
            mapDotRadius = mapHeight * 0.02;
            mapLineWidth = mapHeight * 0.01;

            newGame();
        }
        mapImg.src = "world-map-b1.jpg";
    }
}
