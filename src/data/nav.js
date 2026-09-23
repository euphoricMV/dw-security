import config from '../config.js';

/** Menu in de header; `on` wordt gezet op de link van de huidige pagina. */
export const menu = [
  { href: '/diensten', label: 'Diensten' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/vacatures', label: 'Vacatures' },
  { href: '/contact', label: 'Contact', cls: 'btn solid' }
];

export const servicePath = (slug) => `/diensten/${slug}`;
export const plain = (html) => html.replace(/&shy;/g, '');
export const tel = `tel:${config.contact.phone}`;
export const mailto = `mailto:${config.contact.email}`;
/** Voor attributen (alt): &shy; als echt zacht afbreekstreepje. */
export const attrText = (html) => html.replace(/&shy;/g, '­');
