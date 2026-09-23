/**
 * Het ene instellingenbestand van de site. Contactgegevens, juridische gegevens,
 * diensten en formulier-endpoints staan hier één keer; pagina's, header, footer,
 * JSON-LD en het formulierscript lezen ze hieruit.
 */
export default {
  business: {
    name: 'D&W Security',
    url: 'https://www.dwsecurity.nl'
  },

  contact: {
    phone: '+31615571622',            // voor tel:-links
    phoneDisplay: '+31 6 155 716 22', // zoals getoond op de site
    email: 'info@dwsecurity.nl',
    street: 'Groen van Prinstererlaan 17',
    city: 'Den Haag',
    country: 'NL'
  },

  legal: {
    kvk: '71845089',
    license: 'ND5359' // vergunning Justis
  },

  social: {
    facebook: 'https://www.facebook.com/p/DW-Security-100057452048964/',
    instagram: 'https://www.instagram.com/dwsecurity/'
  },

  /**
   * Diensten, in volgorde van de site. `name` mag HTML bevatten (&shy;).
   * `image` is de foto op de dienstpagina en in "Andere diensten";
   * `homeImage` is de foto op de homepage-kaart (Horeca heeft daar een andere).
   */
  services: [
    { slug: 'horeca', name: 'Horeca', intro: 'Portiers en toezicht voor restaurants, cafés en clubs.', image: '/assets/img/hero.jpg', homeImage: '/assets/img/horeca-kaart.jpg' },
    { slug: 'evenementen', name: 'Evenementen', intro: 'Van besloten feest tot festival.', image: '/assets/img/evenementen.jpg' },
    { slug: 'persoonsbeveiliging', name: 'Persoons&shy;beveiliging', intro: 'Personen en hun omgeving beschermen met sterke beveiliging.', image: '/assets/img/persoonsbeveiliging.jpg' },
    { slug: 'objectbeveiliging', name: 'Object&shy;beveiliging', intro: 'Uw specialist in objectbeveiliging.', image: '/assets/img/objectbeveiliging.jpg' }
  ],

  /** Logo's in de strip "Opdrachtgevers" op de homepage. */
  clients: [
    { name: 'FUEL Beachclub', logo: '/assets/img/klant-fuel-beachclub.png' },
    { name: 'Luminosity', logo: '/assets/img/klant-luminosity.png' },
    { name: 'Colorado Charlie', logo: '/assets/img/klant-colorado-charlie.png' },
    { name: 'Mingle Mush', logo: '/assets/img/klant-mingle-mush.png' },
    { name: 'Bierlokaal De Luifel', logo: '/assets/img/klant-de-luifel.png' }
  ],

  /**
   * Formulier-endpoints. Leeg = het formulier opent het e-mailprogramma van de
   * bezoeker (mailto). Zet op '/api/contact' zodra RESEND_API_KEY, MAIL_TO en
   * MAIL_FROM in Cloudflare staan en een directe test werkt (zie LEESMIJ.md).
   */
  endpoints: {
    contact: ''
  }
};
