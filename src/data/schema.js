import config from '../config.js';

const { business, contact, legal, social } = config;

/** schema.org-gegevens voor de homepage, opgebouwd uit config.js. */
export const organization = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${business.url}/#organisatie`,
  name: business.name,
  url: business.url,
  logo: `${business.url}/assets/img/logo.png`,
  image: `${business.url}/assets/img/hero.jpg`,
  telephone: contact.phone,
  email: contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.street,
    addressLocality: contact.city,
    addressCountry: contact.country
  },
  areaServed: 'NL',
  openingHours: 'Mo-Su 00:00-23:59',
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'KvK', value: legal.kvk },
    { '@type': 'PropertyValue', propertyID: 'Vergunning Justis', value: legal.license }
  ],
  sameAs: [social.facebook, social.instagram]
};
