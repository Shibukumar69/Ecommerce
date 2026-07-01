import fs from 'fs';
import path from 'path';

const replacements = {
  'src/pages/CartPage.tsx': [
    { search: '>\n                            ${activePrice}', replace: '>\n                            ₹{activePrice}' },
    { search: '>\n                              ${item.product.price}', replace: '>\n                              ₹{item.product.price}' },
    { search: '>\n                        ${itemTotal}', replace: '>\n                        ₹{itemTotal}' },
    { search: 'font-mono">${(freeShippingThreshold', replace: 'font-mono">₹{(freeShippingThreshold' }
  ],
  'src/pages/ProductDetailsPage.tsx': [
    { search: '>\n                  ${product.discountPrice}', replace: '>\n                  ₹{product.discountPrice}' },
    { search: '>\n                  ${product.price}', replace: '>\n                  ₹{product.price}' },
    { search: '>\n                ${product.price}', replace: '>\n                ₹{product.price}' }
  ]
};

for (const [file, list] of Object.entries(replacements)) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of list) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      console.log(`Replaced in ${file}: "${search}" -> "${replace}"`);
    } else {
      console.warn(`Target not found in ${file}: "${search}"`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Currency symbol replacements finished.');
